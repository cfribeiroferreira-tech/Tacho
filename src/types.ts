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
  | "Familiar"
  | "Lanche"
  | "Praia"
  | "Doce"
  | "Bebida"
  | "Saudável"
  | "Sanduíche"
  | "Quiche"
  | "Almoço"
  | "Económico"
  | "Especial"
  | "Snack"
  | "Fim de Semana"
  | "Kids"
  | "Favoritos";

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
  | "Alternativas Vegetais"
  | "Mercearia"
  | "Padaria"
  | "Bebidas";

export const AISLE_ORDER: Aisle[] = [
  "Frutas e Legumes",
  "Talho",
  "Peixaria",
  "Laticínios e Ovos",
  "Alternativas Vegetais",
  "Mercearia",
  "Padaria",
  "Bebidas",
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
  recipeId?: string; // reference to local db
  customRecipe?: any; // AI generated recipe
}

export interface DayPlan {
  day: DayOfWeek;
  pequeno_almoco: PlannedMeal | null;
  almoco: PlannedMeal | null;
  lanche: PlannedMeal | null;
  jantar: PlannedMeal | null;
}

export interface MenuHistoryItem {
  id: string;
  date: string;
  weekPlan: DayPlan[];
  tag?: string;
  calories?: number;
}

export interface AppState {
  peopleCount: number; // Keep for backwards compatibility, or maybe just total people
  adultsCount: number;
  children: { age: number }[];
  weekPlan: DayPlan[];
  pantry: string[]; // names of marked items
  selectedSupermarkets: Supermarket[];
  boughtItems: string[]; // for tracking checked items in list
  customShoppingItems?: string[]; // user-added items
  sharedRoomId?: string | null;
  menuHistory?: MenuHistoryItem[];
  pendingRecipeSelection?: {
    type?: "weekPlan" | "menu";
    day?: DayOfWeek;
    meal?: "pequeno_almoco" | "almoco" | "lanche" | "jantar";
    menuId?: string;
  };
  generatorConfig?: {
    focus: string;
    mealTypes: ("Pequeno-almoço" | "Almoço" | "Lanche" | "Jantar")[];
  };
  favorites?: string[]; // IDs das receitas
  favoritesPortions?: { adultsCount?: number; children?: { age: number }[] };
  customMenus?: CustomMenu[];
  activeCustomMenuId?: string | null;
  activeListView?: {
    type: "week" | "menu";
    menuId?: string;
  };
}

export interface CustomMenu {
  id: string;
  name: string;
  recipeIds: string[];
  adultsCount?: number;
  children?: { age: number }[];
}

export type Tab =
  | "home"
  | "receitas"
  | "semana"
  | "despensa"
  | "lista"
  | "menus";
