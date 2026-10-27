# Nutrition App (Despensa y Menús)

Segunda rama vertical del negocio (junto a fitness). Marcas los alimentos de tu dieta (carbohidratos, proteínas y grasas) y genera:

- **Ideas de platos** por tipo (desayuno, comida, cena, postres) y nivel (rápido, variado, elaborado), con ilustración, ingredientes y receta
- **Lista de la compra** unificada, solo de los platos que añadas a la compra

## Cómo está hecha
- La interfaz es una sola página, `public/despensa.html`, igual que el artefacto de Claude. En `/` se sirve con un rewrite.
- La IA se llama desde el servidor en `app/api/sample/route.ts` (modelo `claude-sonnet-5-5`); la página la usa con la misma interfaz que en el artefacto (`window.claude`).
- Tus alimentos y ajustes se guardan en el navegador (localStorage).

## Arranque
```bash
cp .env.example .env.local   # añade tu ANTHROPIC_API_KEY
npm install
npm run dev
```

## Siguientes pasos posibles
- Platos favoritos y filtro por tiempo
- Calorías y macros por plato, enlazados con los objetivos de la app de fitness
- Cuenta de usuario para guardar datos entre dispositivos
