import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const MODEL = "claude-sonnet-5-5";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const prompt = body?.prompt;
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 20000) {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Falta ANTHROPIC_API_KEY en .env.local" }, { status: 500 });
  }
  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    return NextResponse.json(JSON.parse(json));
  } catch (e) {
    console.error(e);
    const status = e instanceof Anthropic.APIError && e.status === 429 ? 429 : 500;
    return NextResponse.json({ error: "No se pudo generar el resultado" }, { status });
  }
}
