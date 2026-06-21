import {
  Aisle,
  DayPlan,
  DayOfWeek,
  Recipe,
  Category,
  PlannedMeal,
  AppState,
} from "../types";
import { recipes } from "../data/recipes";

import { COMMON_PANTRY_ITEMS, EXTRA_INGREDIENTS } from "../data/pantry";

export const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const getAllIngredients = () => {
  const map = new Map<string, string>();
  [...COMMON_PANTRY_ITEMS, ...EXTRA_INGREDIENTS].forEach((i) => map.set(i.toLowerCase(), i));

  recipes.forEach((r) => {
    r.ingredients.forEach((i) => {
      const normalized = i.name.toLowerCase().trim();
      const capitalized = i.name.charAt(0).toUpperCase() + i.name.slice(1);
      if (!map.has(normalized)) {
        map.set(normalized, capitalized);
      }
    });
  });
  return Array.from(map.values()).sort();
};

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
    pequeno_almoco: null,
    almoco: null,
    lanche: null,
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
    [day.almoco, day.jantar].forEach((meal: any) => {
      if (!meal) return;
      const isDirectRecipe = !!meal.name;
      const recipe = isDirectRecipe ? meal : (meal.customRecipe || getRecipeById(meal.recipeId));
      if (!recipe) return;

      const scale = peopleCount / (recipe.baseServings || 4);

      recipe.ingredients.forEach((ing) => {
        const normalizedName = normalizeIngredientName(ing.name);
        const key = `${normalizedName.toLowerCase()}||${ing.unit.toLowerCase()}`;

        
        const HERBS = ["salsa", "coentros", "hortelã", "manjericão", "alecrim", "tomilho", "cebolinho", "louro", "salsa picada"];
        const isHerb = HERBS.includes(normalizedName.toLowerCase());
        let scaledQuantity = isHerb ? 1 : (ing.quantity * scale);

        if (allIngredientsMap.has(key)) {
          const existing = allIngredientsMap.get(key)!;
          
          if (isHerb) {
            existing.totalQuantity = 1;
          } else {
            existing.totalQuantity += scaledQuantity;
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

  // Apply final rounding after all accumulations
  allIngredientsMap.forEach((item) => {
    if (
      item.unit === "un" ||
      item.unit === "dentes" ||
      item.unit === "lata" ||
      item.unit === "emb" ||
      item.unit === "saco"
    ) {
      item.totalQuantity = Math.ceil(item.totalQuantity);
    } else if (item.totalQuantity > 10) {
      item.totalQuantity = Math.round(item.totalQuantity);
    } else {
      item.totalQuantity = Math.round(item.totalQuantity * 10) / 10;
    }
  });

  const excludedNames: string[] = [];
  const pantryLower = pantry.map((p) => p.toLowerCase());

  // Filter out pantry items and group
  const grouped: Record<Aisle, AggregatedItem[]> = {
    "Frutas e Legumes": [],
    Talho: [],
    Peixaria: [],
    "Laticínios e Ovos": [],
    "Alternativas Vegetais": [],
    Mercearia: [],
    Padaria: [],
    Bebidas: [],
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

  Object.values(grouped).forEach((sectionItems) => {
    sectionItems.sort((a, b) => a.name.localeCompare(b.name, "pt"));
  });

  return {
    grouped,
    excludedCount: excludedNames.length,
    excludedNames,
  };
}

// Auto-generator
export function generateWeekMenu(
  focus: string,
  appState?: AppState,
  mealTypes: string[] = ["Almoço", "Jantar"]
): DayPlan[] {
  let pool = recipes;

  if (focus === "Pequeno-almoço" || focus === "Lanche" || focus === "Praia") {
    pool = recipes.filter((r) => r.tags.includes(focus));
  } else {
    pool = recipes.filter((r) => !r.tags.includes("Pequeno-almoço") && !r.tags.includes("Lanche") && !r.tags.includes("Bebida"));
  }

  const hasChildren =
    appState && appState.children && appState.children.length > 0;
  // If no focus is selected (Geral), but they have children, mix in family recipes more heavily, or force familiar if they have young kids
  const hasYoungChildren =
    appState && appState.children && appState.children.some((c) => c.age <= 10);

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
  } else {
    // If Geral and has young children, mix in family meals.
    if (hasYoungChildren) {
      const familyPool = pool.filter((r) => r.tags.includes("Familiar"));
      const normalPool = pool.filter((r) => !r.tags.includes("Familiar"));
      // We will shuffle them later, but if we want to ensure we get some family hits, we'll boost their chances by just creating a pool dominated by them
      // Alternatively, let's just make the pool 50% "Familiar". But for simplicity, if young kids, we heavily prefer Familiar, Comfort, Rápido
      pool = pool.filter(
        (r) =>
          r.tags.includes("Familiar") ||
          r.tags.includes("Kids") ||
          r.tags.includes("Conforto") ||
          r.tags.includes("Rápido"),
      );
    }
  }

  // If pool is too small, fallback
  if (pool.length < 5) {
    if (focus === "Pequeno-almoço" || focus === "Lanche" || focus === "Praia") {
      pool = recipes.filter((r) => r.tags.includes(focus));
      if (pool.length === 0) pool = recipes;
    } else {
      pool = recipes.filter((r) => !r.tags.includes("Pequeno-almoço") && !r.tags.includes("Lanche") && !r.tags.includes("Bebida"));
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

  const getRecentRecipeIds = (): Set<string> => {
    const recentIds = new Set<string>();
    if (!appState) return recentIds;
    
    // Add current week's recipes to prevent repeats
    if (appState.weekPlan) {
      for (const day of appState.weekPlan) {
        if (day.pequeno_almoco?.recipeId) recentIds.add(day.pequeno_almoco.recipeId);
        if (day.almoco?.recipeId) recentIds.add(day.almoco.recipeId);
        if (day.lanche?.recipeId) recentIds.add(day.lanche.recipeId);
        if (day.jantar?.recipeId) recentIds.add(day.jantar.recipeId);
      }
    }

    if (!appState.menuHistory) return recentIds;
    
    // Look at last 2 weeks to avoid too much repetition
    const recentHistory = appState.menuHistory.slice(-2);
    for (const week of recentHistory) {
      for (const day of week.weekPlan) {
        if (day.pequeno_almoco?.recipeId) recentIds.add(day.pequeno_almoco.recipeId);
        if (day.almoco?.recipeId) recentIds.add(day.almoco.recipeId);
        if (day.lanche?.recipeId) recentIds.add(day.lanche.recipeId);
        if (day.jantar?.recipeId) recentIds.add(day.jantar.recipeId);
      }
    }
    return recentIds;
  };

  const recentIds = getRecentRecipeIds();

  // If we can afford to filter out recent recipes without running out, do so
  const filterRecent = (arr: Recipe[]) => {
     const filtered = arr.filter(r => !recentIds.has(r.id));
     // If filtering leaves us with too few recipes, just return the original array
     if (filtered.length >= 7) return filtered;
     return arr; // fallback
  };

  let shuffledPool = shuffle([...filterRecent(pool)]);
  
  // Specific pools for PA and Lanche if we generated a general pool but they asked for all meals
  const paPool = shuffle(filterRecent(recipes.filter(r => r.tags.includes("Pequeno-almoço"))));
  const lanchePool = shuffle(filterRecent(recipes.filter(r => r.tags.includes("Lanche"))));
  
  let shuffledPAPool = [...paPool];
  let shuffledLanchePool = [...lanchePool];

  const result = createEmptyWeekPlan();
  
  const usedThisWeek = new Set<string>();

  function popFrom(currentPool: Recipe[], originalPool: Recipe[], fallbackPool: Recipe[]): PlannedMeal | null {
    if (currentPool.length === 0) {
      currentPool.push(...shuffle([...originalPool]));
    }

    let idx = currentPool.findIndex(r => !usedThisWeek.has(r.id));
    if (idx !== -1) {
      const r = currentPool.splice(idx, 1)[0];
      usedThisWeek.add(r.id);
      return { id: generateId(), recipeId: r.id };
    }

    const unusedFallback = fallbackPool.filter(r => !usedThisWeek.has(r.id));
    if (unusedFallback.length > 0) {
      const r = shuffle(unusedFallback).pop()!;
      usedThisWeek.add(r.id);
      return { id: generateId(), recipeId: r.id };
    }

    const r = currentPool.pop();
    if (!r) return null;
    return { id: generateId(), recipeId: r.id };
  }

  function popGeneralRecipe(): PlannedMeal | null {
    const fallbackGeneral = recipes.filter(r => !r.tags.includes("Pequeno-almoço") && !r.tags.includes("Lanche") && !r.tags.includes("Bebida"));
    return popFrom(shuffledPool, pool, fallbackGeneral);
  }
  
  function popPARecipe(): PlannedMeal | null {
    const fallbackPA = recipes.filter(r => r.tags.includes("Pequeno-almoço"));
    return popFrom(shuffledPAPool, paPool, fallbackPA);
  }
  
  function popLancheRecipe(): PlannedMeal | null {
    const fallbackL = recipes.filter(r => r.tags.includes("Lanche"));
    return popFrom(shuffledLanchePool, lanchePool, fallbackL);
  }

  DAYS_OF_WEEK.forEach((day, index) => {
    if (mealTypes.includes("Pequeno-almoço")) {
      // Use PA pool if the focus isn't strictly PA, else use general generated pool
      result[index].pequeno_almoco = (focus === "Pequeno-almoço") ? popGeneralRecipe() : popPARecipe();
    }
    if (mealTypes.includes("Almoço")) result[index].almoco = popGeneralRecipe();
    if (mealTypes.includes("Lanche")) {
      result[index].lanche = (focus === "Lanche") ? popGeneralRecipe() : popLancheRecipe();
    }
    if (mealTypes.includes("Jantar")) result[index].jantar = popGeneralRecipe();
  });

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
