import { NextResponse } from "next/server";
import { generate } from "@/lib/claude";
import type { Mode, Preferences } from "@/lib/types";

const MODES: Mode[] = ["menu", "dishes", "shopping"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const mode = body?.mode as Mode;
  const ingredients = body?.ingredients as string[];
  const prefs = body?.prefs as Preferences;

  if (!MODES.includes(mode) || !Array.isArray(ingredients) || !ingredients.length || !prefs) {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Falta ANTHROPIC_API_KEY en .env.local" }, { status: 500 });
  }
  try {
    return NextResponse.json(await generate(mode, ingredients.slice(0, 100), prefs));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No se pudo generar el resultado" }, { status: 500 });
  }
}
