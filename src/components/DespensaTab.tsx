import { useState, useMemo } from "react";
import { AppState, DayPlan, Recipe } from "../types";
import { COMMON_PANTRY_ITEMS } from "../data/pantry";
import { getRecipeById } from "../utils/engine";
import { Info, Sparkles, ChevronRight, Search, Plus } from "lucide-react";
import { recipes } from "../data/recipes";
import { RecipeDetailModal } from "./RecipeDetailModal";
import { AnimatePresence } from "motion/react";

interface Props {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  showToast?: (m: string) => void;
  goToTab?: (tab: any) => void;
}

export default function DespensaTab({
  appState,
  updateState,
  showToast,
  goToTab,
}: Props) {
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allIngredients = useMemo(() => {
    const map = new Map<string, string>();
    COMMON_PANTRY_ITEMS.forEach((i) => map.set(i.toLowerCase(), i));

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
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return allIngredients
      .filter(
        (i) => i.toLowerCase().includes(query) && !appState.pantry.includes(i),
      )
      .slice(0, 5);
  }, [searchQuery, allIngredients, appState.pantry]);

  const toggleItem = (item: string) => {
    const current = appState.pantry;
    if (current.includes(item)) {
      updateState({ pantry: current.filter((i) => i !== item) });
    } else {
      updateState({ pantry: [...current, item] });
    }
  };

  // Find out what is needed this week
  const neededThisWeek = new Set<string>();
  appState.weekPlan.forEach((day) => {
    [day.almoco, day.jantar].forEach((meal) => {
      if (meal) {
        const r = getRecipeById(meal.recipeId);
        if (r) {
          r.ingredients.forEach((i) =>
            neededThisWeek.add(i.name.toLowerCase()),
          );
        }
      }
    });
  });

  // Calculate recommendations based on pantry
  const getRecommendations = () => {
    const pantryNormalized = appState.pantry.map((i) => i.toLowerCase());
    if (pantryNormalized.length === 0) return [];

    const scored = recipes.map((recipe) => {
      let matches = 0;
      recipe.ingredients.forEach((ing) => {
        const ingName = ing.name.toLowerCase();
        if (pantryNormalized.some((p) => ingName.includes(p))) {
          matches++;
        }
      });
      return { recipe, matchScore: matches, total: recipe.ingredients.length };
    });

    // Score by ratio of matched ingredients
    scored.sort((a, b) => b.matchScore / b.total - a.matchScore / a.total);

    // Filter out those with less than 30% match to be useful
    return scored.filter((s) => s.matchScore / s.total > 0.3).slice(0, 5);
  };

  const recommendations = getRecommendations();

  return (
    <div className="pt-6 px-4 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-display text-[var(--color-ink)] font-bold mb-1">
          Despensa
        </h1>
        <p className="text-[var(--color-ink-soft)] text-sm">
          O que já tens em casa?
        </p>
      </div>

      <div className="bg-[#E6EEE8] border border-[var(--color-brand)]/20 p-4 rounded-2xl mb-6 flex items-start space-x-3">
        <Info
          className="text-[var(--color-brand)] mt-0.5 flex-shrink-0"
          size={18}
        />
        <p className="text-sm font-medium text-[var(--color-brand)]">
          Marca os básicos que já tens. Eles serão automaticamente retirados da
          lista de compras da semana.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {COMMON_PANTRY_ITEMS.map((item) => {
          const isSelected = appState.pantry.includes(item);
          const isNeeded = neededThisWeek.has(item.toLowerCase());

          return (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className={`relative px-4 py-2 rounded-full font-medium text-sm border transition-colors ${
                isSelected
                  ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                  : "bg-white text-[var(--color-ink)] border-[var(--color-line)]"
              }`}
            >
              {item}
              {isNeeded && !isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-pumpkin)] rounded-full border-2 border-[var(--color-paper)]"></span>
              )}
            </button>
          );
        })}
        {appState.pantry
          .filter((i) => !COMMON_PANTRY_ITEMS.includes(i))
          .map((item) => {
            const isNeeded = neededThisWeek.has(item.toLowerCase());
            return (
              <button
                key={item}
                onClick={() => toggleItem(item)}
                className="relative px-4 py-2 rounded-full font-medium text-sm border transition-colors bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
              >
                {item}
                {isNeeded && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-pumpkin)] rounded-full border-2 border-[var(--color-paper)]"></span>
                )}
              </button>
            );
          })}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-[var(--color-ink-soft)]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Procurar mais ingredientes..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-line)] rounded-xl outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all text-sm font-medium"
        />

        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-[var(--color-line)] rounded-xl shadow-lg overflow-hidden">
            {searchResults.map((item) => (
              <button
                key={item}
                onClick={() => {
                  toggleItem(item);
                  setSearchQuery("");
                }}
                className="w-full text-left px-4 py-3 hover:bg-[var(--color-paper)] flex items-center justify-between border-b border-[var(--color-line)] last:border-0"
              >
                <span className="text-sm font-medium text-[var(--color-ink)]">
                  {item}
                </span>
                <Plus size={18} className="text-[var(--color-brand)]" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center text-xs text-[var(--color-ink-soft)] px-2 mb-10">
        <span className="w-2 h-2 bg-[var(--color-pumpkin)] rounded-full inline-block mr-2 flex-shrink-0"></span>
        Indica os ingredientes que precisas para a ementa desta semana para
        receberes recomendações.
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold font-display text-[var(--color-ink)] mb-4 flex items-center">
          <Sparkles size={20} className="mr-2 text-[var(--color-pumpkin)]" />
          Faz com o que tens
        </h2>

        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map(({ recipe, matchScore, total }) => {
              const percentage = Math.round((matchScore / total) * 100);
              return (
                <div
                  key={recipe.id}
                  onClick={() => setViewingRecipe(recipe)}
                  className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex items-center cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="text-3xl mr-4">{recipe.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--color-ink)] text-sm truncate">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 bg-[var(--color-paper)] h-1.5 rounded-full overflow-hidden mr-3">
                        <div
                          className="bg-[var(--color-brand)] h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--color-brand)]">
                        {matchScore}/{total} ingr.
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-[var(--color-ink-soft)] ml-2"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[var(--color-line)] border-dashed rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3 opacity-50">✨</div>
            <h3 className="font-bold text-[var(--color-ink)] mb-1">
              Cozinha com a despensa
            </h3>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Seleciona alguns ingredientes acima para receber recomendações de
              receitas que já podes fazer.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewingRecipe && (
          <RecipeDetailModal
            recipe={viewingRecipe}
            onClose={() => setViewingRecipe(null)}
            appState={appState}
            updateState={updateState}
            showToast={showToast}
            goToTab={goToTab}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
