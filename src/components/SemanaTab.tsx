import { useState } from "react";
import { AppState, DayPlan, Recipe } from "../types";
import { getRecipeById, generateWeekMenu } from "../utils/engine";
import { Users, Clock, Trash2, X, Sparkles, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { RecipeDetailModal } from "./RecipeDetailModal";

interface Props {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  showToast: (msg: string) => void;
  goToTab: (tab: any) => void;
}

export default function SemanaTab({
  appState,
  updateState,
  showToast,
  goToTab,
}: Props) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const handlePeopleChange = (delta: number) => {
    const newVal = appState.peopleCount + delta;
    if (newVal >= 1 && newVal <= 12) {
      updateState({ peopleCount: newVal });
    }
  };

  const removeMeal = (dayIdx: number, meal: "almoco" | "jantar") => {
    const updated = [...appState.weekPlan];
    updated[dayIdx] = { ...updated[dayIdx], [meal]: null };
    updateState({ weekPlan: updated });
  };

  const clearWeek = () => {
    const empty = appState.weekPlan.map((d) => ({
      ...d,
      almoco: null,
      jantar: null,
    }));
    updateState({ weekPlan: empty });
    showToast("Semana apagada");
  };

  const runGenerator = (focus: string) => {
    const newPlan = generateWeekMenu(focus);
    updateState({ weekPlan: newPlan });
    setShowGenerator(false);
    showToast("Nova ementa gerada!");
  };

  return (
    <div className="pt-6 px-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display text-[var(--color-ink)] font-bold">
          Semana
        </h1>
        <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-[var(--color-line)] shadow-sm">
          <button
            onClick={() => handlePeopleChange(-1)}
            className="text-[var(--color-ink-soft)] w-6 h-6 flex items-center justify-center"
          >
            -
          </button>
          <div className="flex items-center space-x-1 font-medium text-sm">
            <Users size={14} />
            <span>{appState.peopleCount}</span>
          </div>
          <button
            onClick={() => handlePeopleChange(1)}
            className="text-[var(--color-ink-soft)] w-6 h-6 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setShowGenerator(true)}
          className="flex-1 bg-[var(--color-brand)] text-white py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center space-x-1"
        >
          <Sparkles size={16} /> <span>Sugerir ementa</span>
        </button>
        <button
          className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink-soft)]"
          onClick={() => showToast("Histórico não implementado na v1")}
        >
          <Clock size={18} />
        </button>
        <button
          onClick={clearWeek}
          className="p-2.5 bg-white text-red-500 border border-[var(--color-line)] rounded-xl"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {appState.weekPlan.map((dayPlan, idx) => {
          let dayKcal = 0;
          if (dayPlan.almoco) {
            const r = getRecipeById(dayPlan.almoco.recipeId);
            if (r) dayKcal += r.kcalPerServing;
          }
          if (dayPlan.jantar) {
            const r = getRecipeById(dayPlan.jantar.recipeId);
            if (r) dayKcal += r.kcalPerServing;
          }

          return (
            <div
              key={dayPlan.day}
              className="bg-white border border-[var(--color-line)] rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display font-bold text-lg">
                  {dayPlan.day}
                </h3>
                {dayKcal > 0 && (
                  <span className="text-xs font-medium text-[var(--color-ink-soft)] bg-[var(--color-sand)] px-2 py-0.5 rounded-full">
                    {dayKcal} kcal
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <MealSlot
                  label="Almoço"
                  meal={dayPlan.almoco}
                  onRemove={() => removeMeal(idx, "almoco")}
                  onAdd={() => goToTab("receitas")}
                  onViewRecipe={setViewingRecipe}
                />
                <MealSlot
                  label="Jantar"
                  meal={dayPlan.jantar}
                  onRemove={() => removeMeal(idx, "jantar")}
                  onAdd={() => goToTab("receitas")}
                  onViewRecipe={setViewingRecipe}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-start space-x-2 text-xs text-[var(--color-ink-soft)] bg-white p-3 rounded-xl border border-[var(--color-line)]">
        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
        <p>
          Calorias por dose/pessoa, como orientação. Numa versão real seriam
          validadas por uma base nutricional certificada.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => goToTab("lista")}
          className="w-full bg-[var(--color-brand)] text-white py-4 rounded-2xl font-bold text-lg shadow-sm"
        >
          Ver lista de compras
        </button>
      </div>

      <AnimatePresence>
        {showGenerator && (
          <GeneratorModal
            onClose={() => setShowGenerator(false)}
            onGenerate={runGenerator}
          />
        )}
      </AnimatePresence>

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

function MealSlot({ label, meal, onRemove, onAdd, onViewRecipe }: any) {
  if (!meal) {
    return (
      <div className="flex items-center">
        <span className="w-16 text-xs font-medium text-[var(--color-ink-soft)]">
          {label}
        </span>
        <button
          onClick={onAdd}
          className="flex-1 border border-dashed border-[var(--color-line)] rounded-xl py-2 text-sm text-[var(--color-brand)] font-medium bg-[var(--color-brand-soft)]/30 hover:bg-[var(--color-brand-soft)] transition-colors"
        >
          + adicionar
        </button>
      </div>
    );
  }

  const recipe = getRecipeById(meal.recipeId);
  if (!recipe) return null;

  return (
    <div className="flex items-center relative">
      <span className="w-16 text-xs font-medium text-[var(--color-ink-soft)]">
        {label}
      </span>
      <div
        onClick={() => onViewRecipe && onViewRecipe(recipe)}
        className="flex-1 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl py-2 px-3 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center space-x-2 truncate pr-2">
          <span className="text-xl leading-none">{recipe.emoji}</span>
          <span className="text-sm font-medium truncate">{recipe.name}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-[var(--color-ink-soft)] p-1 hover:bg-white rounded-full"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function GeneratorModal({ onClose, onGenerate }: any) {
  const options = [
    "Geral",
    "Familiar",
    "Leve",
    "Vegetariano",
    "Vegan",
    "Peixe",
    "Carne",
    "Económico",
    "Rápido",
    "Sopa",
    "Conforto",
    "Fit",
    "Pequeno-almoço",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-[var(--color-paper)] rounded-t-3xl z-50 p-6 pb-safe w-full max-w-lg mx-auto"
      >
        <h3 className="font-display font-bold text-xl mb-2">Sugerir ementa</h3>
        <p className="text-sm text-[var(--color-ink-soft)] mb-6">
          Preenche os 14 espaços da semana com uma seleção automática.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onGenerate(opt)}
              className="bg-white border border-[var(--color-line)] py-3 px-4 rounded-xl font-medium text-sm text-left hover:border-[var(--color-brand)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-[var(--color-line)] text-[var(--color-ink)] font-bold rounded-xl mt-2"
        >
          Cancelar
        </button>
      </motion.div>
    </>
  );
}
