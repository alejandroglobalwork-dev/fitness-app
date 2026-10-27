import Anthropic from "@anthropic-ai/sdk";
import type { Mode, Preferences, Result } from "./types";

const MODEL = "claude-sonnet-5-5";

const SCHEMAS: Record<Mode, string> = {
  menu: `{"menu":[{"day":"Día 1","meals":[{"name":"Desayuno","dish":"...","ingredients":["..."],"steps":"..."}]}]}`,
  dishes: `{"dishes":[{"title":"...","description":"...","mainIngredients":["..."],"extraIngredients":["..."],"minutes":20}]}`,
  shopping: `{"menu":[{"day":"Día 1","meals":[{"name":"Desayuno","dish":"...","ingredients":["..."],"steps":"..."}]}],"shopping":[{"category":"Verdura","items":[{"name":"...","quantity":"500 g"}]}]}`,
};

const TASKS: Record<Mode, (p: Preferences) => string> = {
  menu: (p) =>
    `Crea un menú de ${p.days} día(s) con ${p.mealsPerDay} comida(s) al día para ${p.servings} persona(s). Usa sobre todo los ingredientes de la dieta; puedes añadir básicos de despensa (aceite, sal, especias).`,
  dishes: (p) =>
    `Propón 8 platos de inspiración (variados, no un menú cerrado) basados en estos ingredientes, para ${p.servings} persona(s). Indica qué habría que comprar además en extraIngredients.`,
  shopping: (p) =>
    `Crea un menú de ${p.days} día(s) con ${p.mealsPerDay} comida(s) al día para ${p.servings} persona(s) y, a partir de él, la lista de la compra con cantidades totales agrupada por categoría (verdura, fruta, proteína, lácteos, despensa...).`,
};

export async function generate(
  mode: Mode,
  ingredients: string[],
  prefs: Preferences,
): Promise<Result> {
  const client = new Anthropic(); // usa ANTHROPIC_API_KEY
  const system =
    "Eres un nutricionista y cocinero práctico. Respondes siempre en español y SOLO con JSON válido, sin texto adicional ni markdown.";
  const user = `Ingredientes de mi dieta diaria:
${ingredients.map((i) => `- ${i}`).join("\n")}

Notas y restricciones: ${prefs.notes || "ninguna"}

Tarea: ${TASKS[mode](prefs)}

Formato JSON exacto:
${SCHEMAS[mode]}`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = res.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return { mode, ...JSON.parse(json) } as Result;
}
