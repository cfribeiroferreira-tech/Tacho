import { useState } from "react";
import { AppState, Category, Recipe } from "../types";
import { recipes } from "../data/recipes";
import { Search, Plus, X, Clock, Info, ExternalLink } from "lucide-react";
import { getCalorieBadgeLevel } from "../utils/engine";
import { AnimatePresence, motion } from "motion/react";
import { RecipeDetailModal } from "./RecipeDetailModal";

const CATEGORIES: Category[] = [
  "Todas",
  "Familiar",
  "Leve",
  "Vegetariano",
  "Vegan",
  "Peixe",
  "Carne",
  "Rápido",
  "Sopa",
  "Conforto",
  "Pequeno-almoço",
  "Fit",
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
  const [activeCat, setActiveCat] = useState<Category>("Todas");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filtered = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === "Todas" || r.tags.includes(activeCat);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="pt-6 px-4">
      <div className="mb-4">
        <h1 className="text-3xl font-display text-[var(--color-ink)] font-bold">
          Receitas
        </h1>
        <p className="text-[var(--color-ink-soft)] text-sm">
          {recipes.length} receitas disponíveis
        </p>
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

      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCat === cat
                ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-6 mt-2">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setSelectedRecipe(recipe)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-[var(--color-ink-soft)]">
            Nenhuma receita encontrada.
          </div>
        )}
      </div>

      <div className="mt-2 mb-10 text-center pb-4">
        <a
          href="https://forms.gle/test-feedback"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center space-x-2 text-[var(--color-brand)] font-semibold text-sm bg-[#E6EEE8] px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
        >
          <span>Dar Feedback do MVP</span>
          <ExternalLink size={16} />
        </a>
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
