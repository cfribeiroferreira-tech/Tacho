export type Category =
  | "Todas"
  | "Leve"
  | "Vegetariano"
  | "Vegan"
  | "Peixe"
  | "Carne"
  | "Rápido"
  | "Sopa"
  | "Conforto"
  | "Pequeno-almoço"
  | "Fit"
  | "Familiar";

export type Supermarket = "Continente" | "Auchan";

export const SUPERMARKET_LINKS: Record<Supermarket, string> = {
  Continente: "https://www.continente.pt/pesquisa/?q={query}",
  Auchan: "https://www.auchan.pt/pt/pesquisa/?q={query}",
};

export type Aisle =
  | "Frutas e Legumes"
  | "Talho"
  | "Peixaria"
  | "Laticínios e Ovos"
  | "Mercearia"
  | "Congelados";

export const AISLE_ORDER: Aisle[] = [
  "Frutas e Legumes",
  "Talho",
  "Peixaria",
  "Laticínios e Ovos",
  "Mercearia",
  "Congelados",
];

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  section: Aisle;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  time: number; // in minutes
  baseServings: number;
  kcalPerServing: number;
  tags: Category[];
  ingredients: Ingredient[];
  instructions?: string[];
}

export type DayOfWeek =
  | "Segunda"
  | "Terça"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sábado"
  | "Domingo";

export interface PlannedMeal {
  id: string; // unique instance id
  recipeId: string; // reference to local db
}

export interface DayPlan {
  day: DayOfWeek;
  almoco: PlannedMeal | null;
  jantar: PlannedMeal | null;
}

export interface AppState {
  peopleCount: number;
  weekPlan: DayPlan[];
  pantry: string[]; // names of marked items
  selectedSupermarkets: Supermarket[];
  boughtItems: string[]; // for tracking checked items in list
  sharedRoomId?: string | null;
}

export type Tab = "receitas" | "semana" | "despensa" | "lista";
