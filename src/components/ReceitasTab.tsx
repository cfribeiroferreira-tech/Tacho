import { useState } from "react";
import { AppState, Category, Recipe } from "../types";
import { recipes } from "../data/recipes";
import { Search, Plus, X, Clock, Info, ExternalLink, ChevronLeft } from "lucide-react";
import { getCalorieBadgeLevel, removeAccents } from "../utils/engine";
import { AnimatePresence, motion } from "motion/react";
import { RecipeDetailModal } from "./RecipeDetailModal";
import { AdSlot } from "./AdSlot";

const CATEGORIES: Category[] = [
  "Todas",
  "Favoritos",
  "Kids",
  "Familiar",
  "Leve",
  "Vegetariano",
  "Vegan",
  "Peixe",
  "Carne",
  "Rápido",
  "Sopa",
  "Conforto",
  "Fit",
  "Pequeno-almoço",
  "Lanche",
  "Praia",
];


interface Props {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  showToast: (msg: string) => void;
  goToTab: (tab: any) => void;
}

export default function ReceitasTab({
  appState,
  updateState,
  showToast,
  goToTab,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeCats, setActiveCats] = useState<Category[]>(["Todas"]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const toggleCat = (cat: Category) => {
    if (cat === "Todas") {
      setActiveCats(["Todas"]);
      return;
    }
    
    let newCats = activeCats.filter((c) => c !== "Todas");
    if (newCats.includes(cat)) {
      newCats = newCats.filter((c) => c !== cat);
      if (newCats.length === 0) newCats = ["Todas"];
    } else {
      newCats = [...newCats, cat];
    }
    setActiveCats(newCats);
  };

  const filtered = recipes.filter((r) => {
    const matchesSearch = removeAccents(r.name).includes(removeAccents(search));
    const isFavorito = appState.favorites?.includes(r.id);
    
    // activeCats.includes("Todas") is handled if activeCats=[Todas], true for all
    const matchesCat = activeCats.includes("Todas") || activeCats.every((cat) => {
      if (cat === "Favoritos") return isFavorito;
      return r.tags.includes(cat);
    });

    return matchesSearch && matchesCat;
  });

  return (
    <div className="pt-6 px-4">
      <button onClick={() => goToTab('home')} className="flex items-center text-sm text-[var(--color-ink-soft)] font-medium mb-4 hover:text-[var(--color-ink)] transition-colors active:scale-95 group">
        <div className="bg-white border border-[var(--color-line)] rounded-full p-1 mr-2 group-hover:bg-gray-50">
          <ChevronLeft size={16} />
        </div>
        Voltar ao Início
      </button>
      <div className="mb-4">
        {appState.pendingRecipeSelection ? (
          <div className="bg-[var(--color-brand-soft)]/50 border border-[var(--color-brand)] p-3 rounded-2xl flex justify-between items-center mb-4">
            <div>
              <div className="text-xs font-bold text-[var(--color-brand)]">A ESCOLHER PARA</div>
              <div className="text-sm">
                {appState.pendingRecipeSelection.day} -{" "}
                {appState.pendingRecipeSelection.meal.replace("_", "-")}
              </div>
            </div>
            <button
              onClick={() => {
                updateState({ pendingRecipeSelection: undefined });
                goToTab("semana");
              }}
              className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium border border-[var(--color-line)] shrink-0"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-display text-[var(--color-ink)] font-bold">
              Receitas
            </h1>
            <p className="text-[var(--color-ink-soft)] text-sm">
              {recipes.length} receitas disponíveis
            </p>
          </>
        )}
      </div>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]"
          size={18}
        />
        <input
          type="text"
          placeholder="Procurar receita..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[var(--color-line)] rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--color-brand)] transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 pb-4 pt-1">
        {CATEGORIES.map((cat, idx) => {
          const isActive = activeCats.includes(cat);
          return (
            <button
              key={`${cat}-${idx}`}
              onClick={() => toggleCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                isActive
                  ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                  : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-6 mt-2">
        {filtered.flatMap((recipe, index) => {
          const isAdSlot = index > 0 && index % 4 === 0;
          return [
            ...(isAdSlot ? [<div key={`ad-${index}`} className="col-span-2 px-1"><AdSlot type="banner" className="opacity-90 my-1" /></div>] : []),
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => {
                if (appState.pendingRecipeSelection) {
                  const { day, meal } = appState.pendingRecipeSelection;
                  const updatedPlan = [...appState.weekPlan];
                  const dayIndex = updatedPlan.findIndex((d) => d.day === day);
                  if (dayIndex > -1) {
                    updatedPlan[dayIndex] = {
                      ...updatedPlan[dayIndex],
                      [meal]: { id: Math.random().toString(36), recipeId: recipe.id },
                    };
                    updateState({ weekPlan: updatedPlan, pendingRecipeSelection: undefined });
                    showToast(`${recipe.name} adicionado!`);
                    goToTab("semana");
                  }
                } else {
                  setSelectedRecipe(recipe);
                }
              }}
            />
          ];
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-[var(--color-ink-soft)]">
            Nenhuma receita encontrada.
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
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

function RecipeCard({
  recipe,
  onClick,
}: {
  key?: string;
  recipe: Recipe;
  onClick: () => void;
}) {
  const badge = getCalorieBadgeLevel(recipe.kcalPerServing);
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[var(--color-line)] rounded-2xl p-3 flex flex-col cursor-pointer active:scale-95 transition-transform"
    >
      <div className="text-4xl mb-2">{recipe.emoji}</div>
      <h3 className="font-display font-semibold text-sm leading-tight mb-2 flex-grow">
        {recipe.name}
      </h3>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xs text-[var(--color-ink-soft)] flex items-center">
          <Clock size={12} className="mr-1" /> {recipe.time}m
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}
