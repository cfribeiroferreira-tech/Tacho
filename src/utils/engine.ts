import {
  Aisle,
  DayPlan,
  DayOfWeek,
  Recipe,
  Category,
  PlannedMeal,
} from "../types";
import { recipes } from "../data/recipes";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export const createEmptyWeekPlan = (): DayPlan[] => {
  return DAYS_OF_WEEK.map((day) => ({
    day,
    almoco: null,
    jantar: null,
  }));
};

// Simple pseudo-random string id generator
export const generateId = () => Math.random().toString(36).substring(2, 9);

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export interface AggregatedItem {
  id: string; // generated
  name: string;
  totalQuantity: number;
  unit: string;
  section: Aisle;
  recipeNames: string[];
}

export function normalizeIngredientName(name: string): string {
  return name
    .replace(/\s+cozid[oa]s?$/i, "")
    .replace(/\s+assad[oa]s?$/i, "")
    .replace(/\s+a murro$/i, "")
    .replace(/\s+descascad[oa]s?$/i, "")
    .replace(/\s+maduros?$/i, "")
    .replace(/\s+para fritar$/i, "")
    .replace(/\s+para estufar$/i, "")
    .trim();
}

// Shopping list aggregation
export function generateShoppingList(
  weekPlan: DayPlan[],
  peopleCount: number,
  pantry: string[],
): {
  grouped: Record<Aisle, AggregatedItem[]>;
  excludedCount: number;
  excludedNames: string[];
} {
  const allIngredientsMap = new Map<string, AggregatedItem>();

  weekPlan.forEach((day) => {
    [day.almoco, day.jantar].forEach((meal) => {
      if (!meal) return;
      const recipe = getRecipeById(meal.recipeId);
      if (!recipe) return;

      const scale = peopleCount / recipe.baseServings;

      recipe.ingredients.forEach((ing) => {
        const normalizedName = normalizeIngredientName(ing.name);
        const key = `${normalizedName.toLowerCase()}||${ing.unit.toLowerCase()}`;

        let scaledQuantity = ing.quantity * scale;
        // round logic
        if (
          ing.unit === "un" ||
          ing.unit === "dentes" ||
          ing.unit === "lata" ||
          ing.unit === "emb" ||
          ing.unit === "saco"
        ) {
          scaledQuantity = Math.ceil(scaledQuantity);
        } else if (scaledQuantity > 10) {
          scaledQuantity = Math.round(scaledQuantity);
        } else {
          scaledQuantity = Math.round(scaledQuantity * 10) / 10;
        }

        if (allIngredientsMap.has(key)) {
          const existing = allIngredientsMap.get(key)!;
          existing.totalQuantity += scaledQuantity;
          // again round after addition
          if (
            ing.unit === "un" ||
            ing.unit === "dentes" ||
            ing.unit === "lata" ||
            ing.unit === "emb" ||
            ing.unit === "saco"
          ) {
            existing.totalQuantity = Math.ceil(existing.totalQuantity);
          } else if (existing.totalQuantity > 10) {
            existing.totalQuantity = Math.round(existing.totalQuantity);
          }
          if (!existing.recipeNames.includes(recipe.name)) {
            existing.recipeNames.push(recipe.name);
          }
        } else {
          allIngredientsMap.set(key, {
            id: generateId(),
            name: normalizedName,
            totalQuantity: scaledQuantity,
            unit: ing.unit,
            section: ing.section,
            recipeNames: [recipe.name],
          });
        }
      });
    });
  });

  const excludedNames: string[] = [];
  const pantryLower = pantry.map((p) => p.toLowerCase());

  // Filter out pantry items and group
  const grouped: Record<Aisle, AggregatedItem[]> = {
    "Frutas e Legumes": [],
    Talho: [],
    Peixaria: [],
    "Laticínios e Ovos": [],
    Mercearia: [],
    Congelados: [],
  };

  const finalItems = Array.from(allIngredientsMap.values());

  finalItems.forEach((item) => {
    if (pantryLower.includes(item.name.toLowerCase())) {
      if (!excludedNames.includes(item.name)) {
        excludedNames.push(item.name);
      }
    } else {
      if (grouped[item.section]) {
        grouped[item.section].push(item);
      }
    }
  });

  return {
    grouped,
    excludedCount: excludedNames.length,
    excludedNames,
  };
}

// Auto-generator
export function generateWeekMenu(focus: string): DayPlan[] {
  let pool =
    focus === "Pequeno-almoço"
      ? recipes.filter((r) => r.tags.includes("Pequeno-almoço"))
      : recipes.filter((r) => !r.tags.includes("Pequeno-almoço"));

  if (focus !== "Geral") {
    if (focus === "Familiar") {
      pool = pool.filter((r) => r.tags.includes("Familiar"));
    } else if (focus === "Fit") {
      pool = pool.filter(
        (r) => r.tags.includes("Fit") || r.tags.includes("Leve"),
      );
    } else if (focus === "Vegetariano") {
      pool = pool.filter((r) => r.tags.includes("Vegetariano"));
    } else if (focus === "Vegan") {
      pool = pool.filter((r) => r.tags.includes("Vegan"));
    } else if (focus === "Económico") {
      pool = pool.filter((r) => {
        // Simple logic for MVP: avoid expensive items like salmon, cod, steak
        const hasExpensive = r.ingredients.some((i) => {
          const n = i.name.toLowerCase();
          return (
            n.includes("salmão") || n.includes("bacalhau") || n.includes("bife")
          );
        });
        return !hasExpensive;
      });
    } else if (focus === "Rápido") {
      pool = pool.filter((r) => r.tags.includes("Rápido") || r.time <= 25);
    } else {
      pool = pool.filter((r) => r.tags.includes(focus as any));
    }
  }

  // If pool is too small, fallback
  if (pool.length < 5) {
    if (focus === "Pequeno-almoço") {
      pool = recipes.filter((r) => r.tags.includes("Pequeno-almoço"));
      if (pool.length === 0) pool = recipes;
    } else {
      pool = recipes.filter((r) => !r.tags.includes("Pequeno-almoço"));
    }
  }

  // shuffle pool
  const shuffle = (array: Recipe[]) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  let shuffledPool = shuffle([...pool]);
  const result = createEmptyWeekPlan();

  // Need to fill 14 slots
  const totalSlots = 14;
  let usedRecipes = new Set<string>();

  DAYS_OF_WEEK.forEach((day, index) => {
    result[index].almoco = popRecipe();
    result[index].jantar = popRecipe();
  });

  function popRecipe(): PlannedMeal | null {
    if (shuffledPool.length === 0) {
      // Reshuffle original pool if we run out, allowing duplicates
      shuffledPool = shuffle([...pool]);
    }
    const r = shuffledPool.pop();
    if (!r) return null;
    return { id: generateId(), recipeId: r.id };
  }

  return result;
}

export function getCalorieBadgeLevel(kcal: number): {
  label: string;
  color: string;
} {
  if (kcal <= 450) return { label: "Leve", color: "bg-[#2E5E4E] text-white" };
  if (kcal <= 700)
    return { label: "Equilibrado", color: "bg-[#C8972A] text-white" };
  return { label: "Reforçado", color: "bg-[#D9682E] text-white" };
}
