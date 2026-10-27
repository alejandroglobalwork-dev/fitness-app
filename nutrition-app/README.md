# Nutrition App

Segunda rama vertical del negocio (junto a fitness). Le pasas la lista de ingredientes de tu dieta diaria y genera:

- **Menú diario** (N días, X comidas/día)
- **Ideas de platos** inspirados en tus ingredientes
- **Lista de la compra** agrupada por categoría, con cantidades

Usa la API de Claude desde una ruta de servidor (`app/api/generate`).

## Arranque

```bash
cp .env.example .env.local   # añade tu ANTHROPIC_API_KEY
npm install
npm run dev
```

Tus ingredientes y preferencias se guardan en el navegador (localStorage).

## Siguientes pasos posibles
- Macros/calorías por plato y objetivo diario
- Despensa: restar lo que ya tienes de la lista de la compra
- Guardar menús favoritos / exportar lista a PDF o al móvil
- Compartir ingredientes con la app de fitness (objetivos de proteína, etc.)
