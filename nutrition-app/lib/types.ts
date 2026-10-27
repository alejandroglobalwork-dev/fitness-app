export type Mode = "menu" | "dishes" | "shopping";

export interface Preferences {
  days: number;
  mealsPerDay: number;
  servings: number;
  notes: string; // alergias, objetivo, cocina preferida, tiempo disponible...
}

export interface Meal {
  name: string; // desayuno, comida, cena...
  dish: string;
  ingredients: string[];
  steps: string;
}

export interface MenuDay {
  day: string;
  meals: Meal[];
}

export interface Dish {
  title: string;
  description: string;
  mainIngredients: string[];
  extraIngredients: string[]; // lo que habría que comprar además
  minutes: number;
}

export interface ShoppingCategory {
  category: string;
  items: { name: string; quantity: string }[];
}

export type Result =
  | { mode: "menu"; menu: MenuDay[] }
  | { mode: "dishes"; dishes: Dish[] }
  | { mode: "shopping"; shopping: ShoppingCategory[]; menu?: MenuDay[] };
