"use client";

import { useEffect, useState } from "react";
import type { Mode, Preferences, Result } from "@/lib/types";

const KEY = "nutrition-app:v1";
const DEFAULT_PREFS: Preferences = { days: 3, mealsPerDay: 3, servings: 1, notes: "" };

export default function Home() {
  const [text, setText] = useState("");
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<Mode | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) { setText(saved.text ?? ""); setPrefs({ ...DEFAULT_PREFS, ...saved.prefs }); }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ text, prefs })); } catch {}
  }, [text, prefs]);

  const ingredients = text.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);

  async function run(mode: Mode) {
    setLoading(mode); setError(""); setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ingredients, prefs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(null);
    }
  }

  const num = (k: "days" | "mealsPerDay" | "servings") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrefs({ ...prefs, [k]: Math.max(1, Number(e.target.value) || 1) });

  const menu = result && result.mode !== "dishes" ? result.menu : undefined;

  return (
    <main>
      <h1>Nutrition App</h1>
      <p className="muted">Pega tus ingredientes de cada día y genera menús, platos o la lista de la compra.</p>

      <div className="card">
        <label htmlFor="ing"><b>Mis ingredientes</b> <span className="muted">(uno por línea o separados por comas · {ingredients.length})</span></label>
        <textarea id="ing" value={text} onChange={(e) => setText(e.target.value)} placeholder={"Avena\nHuevos\nPechuga de pollo\nArroz integral\nBrócoli\n..."} />
        <div className="row" style={{ marginTop: 12 }}>
          <label>Días<input type="number" min={1} max={14} value={prefs.days} onChange={num("days")} /></label>
          <label>Comidas/día<input type="number" min={1} max={6} value={prefs.mealsPerDay} onChange={num("mealsPerDay")} /></label>
          <label>Personas<input type="number" min={1} max={10} value={prefs.servings} onChange={num("servings")} /></label>
        </div>
        <label style={{ display: "block", marginTop: 12, fontSize: 14 }}>Notas (alergias, objetivo, tiempo, cocina favorita…)
          <input value={prefs.notes} onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })} />
        </label>
        <div className="row" style={{ marginTop: 16 }}>
          <button disabled={!ingredients.length || !!loading} onClick={() => run("menu")}>{loading === "menu" ? "Generando…" : "Menú diario"}</button>
          <button disabled={!ingredients.length || !!loading} onClick={() => run("dishes")} className="ghost">{loading === "dishes" ? "Generando…" : "Ideas de platos"}</button>
          <button disabled={!ingredients.length || !!loading} onClick={() => run("shopping")} className="ghost">{loading === "shopping" ? "Generando…" : "Lista de la compra"}</button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {result?.mode === "shopping" && (
        <>
          <h2>Lista de la compra</h2>
          {result.shopping.map((c) => (
            <div className="card" key={c.category}>
              <h3>{c.category}</h3>
              <ul>{c.items.map((i) => <li key={i.name}>{i.name} — {i.quantity}</li>)}</ul>
            </div>
          ))}
        </>
      )}

      {result?.mode === "dishes" && (
        <>
          <h2>Ideas de platos</h2>
          {result.dishes.map((d) => (
            <div className="card" key={d.title}>
              <h3>{d.title} <span className="muted">· {d.minutes} min</span></h3>
              <p>{d.description}</p>
              <p className="muted">Con: {d.mainIngredients.join(", ")}{d.extraIngredients.length ? ` · Comprar: ${d.extraIngredients.join(", ")}` : ""}</p>
            </div>
          ))}
        </>
      )}

      {menu && (
        <>
          <h2>Menú</h2>
          {menu.map((d) => (
            <div className="card" key={d.day}>
              <h3>{d.day}</h3>
              {d.meals.map((m) => (
                <details key={m.name}>
                  <summary><b>{m.name}:</b> {m.dish}</summary>
                  <ul>{m.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
                  <p className="muted">{m.steps}</p>
                </details>
              ))}
            </div>
          ))}
        </>
      )}
    </main>
  );
}
