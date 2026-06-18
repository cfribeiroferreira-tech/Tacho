import { useState, useMemo } from "react";
import { AppState, DayPlan, Recipe } from "../types";
import { COMMON_PANTRY_ITEMS } from "../data/pantry";
import { getRecipeById, removeAccents, getAllIngredients } from "../utils/engine";
import { Info, Sparkles, ChevronRight, Search, Plus, Trash2 } from "lucide-react";
import { recipes } from "../data/recipes";
import { RecipeDetailModal } from "./RecipeDetailModal";
import { AnimatePresence } from "motion/react";
import { AdSlot } from "./AdSlot";

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
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const allIngredients = useMemo(() => {
    return getAllIngredients();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = removeAccents(searchQuery);
    return allIngredients
      .filter(
        (i) => removeAccents(i).includes(query) && !appState.pantry.includes(i),
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
    const pantryNormalized = appState.pantry.map((i) => removeAccents(i));
    if (pantryNormalized.length === 0) return [];

    const scored = recipes.map((recipe) => {
      let matches = 0;
      const missingIngredients: string[] = [];

      recipe.ingredients.forEach((ing) => {
        const ingName = removeAccents(ing.name);
        const isMatched = pantryNormalized.some((p) => {
          return (
            ingName === p ||
            ingName.startsWith(`${p} `) ||
            ingName.endsWith(` ${p}`) ||
            ingName.includes(` ${p} `)
          );
        });
        if (isMatched) {
          matches++;
        } else {
          missingIngredients.push(ing.name);
        }
      });
      return { recipe, matchScore: matches, total: recipe.ingredients.length, missingIngredients };
    });

    // Score by ratio of matched ingredients
    scored.sort((a, b) => b.matchScore / b.total - a.matchScore / a.total);

    // Filter out those with no match
    let valid = scored.filter((s) => s.matchScore > 0);
    
    // Sort valid items so that higher matches are prioritized
    valid.sort((a, b) => {
      const aScore = a.matchScore / a.total;
      const bScore = b.matchScore / b.total;
      if (Math.abs(aScore - bScore) < 0.01) {
         return a.recipe.time - b.recipe.time; // secondary sort by time
      }
      return bScore - aScore;
    });

    const pageSize = 5;
    const totalPages = Math.ceil(valid.length / pageSize) || 1;
    const pageIndex = shuffleSeed % totalPages;

    return valid.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
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
        {COMMON_PANTRY_ITEMS.map((item, itemIdx) => {
          const isSelected = appState.pantry.includes(item);
          const isNeeded = neededThisWeek.has(item.toLowerCase());

          return (
            <button
              key={`${item}-${itemIdx}`}
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
          .map((item, idx) => {
            const isNeeded = neededThisWeek.has(item.toLowerCase());
            return (
              <button
                key={`${item}-${idx}`}
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
            {searchResults.map((item, idx) => (
              <button
                key={`${item}-${idx}`}
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

      <AdSlot type="banner" className="mb-10" />

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-display text-[var(--color-ink)] flex items-center">
            <Sparkles size={20} className="mr-2 text-[var(--color-pumpkin)]" />
            Faz com o que tens
          </h2>
          {appState.pantry.length > 0 && (
            <button
              onClick={() => updateState({ pantry: [] })}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Limpar Despensa"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map(({ recipe, matchScore, total, missingIngredients }, idx) => {
              const percentage = Math.round((matchScore / total) * 100);
              return (
                <div
                  key={`${recipe.id}-${idx}`}
                  onClick={() => setViewingRecipe(recipe)}
                  className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center">
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
                  {missingIngredients && missingIngredients.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-line)] text-xs text-[var(--color-ink-soft)] leading-tight">
                      <span className="font-bold text-[var(--color-ink)]">Falta:</span> {missingIngredients.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => setShuffleSeed((s) => s + 1)}
              className="w-full mt-4 py-3 bg-[var(--color-brand-soft)]/30 border border-[var(--color-brand-soft)] text-[var(--color-brand)] rounded-xl font-bold text-sm hover:bg-[var(--color-brand-soft)]/50 transition-colors"
            >
              Propor Mais Alternativas
            </button>
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
