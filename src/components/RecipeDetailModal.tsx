import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Info, Plus } from "lucide-react";
import { Recipe } from "../types";
import { getCalorieBadgeLevel } from "../utils/engine";
import { recipes } from "../data/recipes";

export function RecipeDetailModal({
  recipe,
  onClose,
  appState,
  updateState,
  showToast,
  goToTab,
}: any) {
  const [showPicker, setShowPicker] = useState(false);
  const [showKcalInfo, setShowKcalInfo] = useState(false);
  const badge = getCalorieBadgeLevel(recipe.kcalPerServing);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black z-50"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-[var(--color-paper)] rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto w-full max-w-lg mx-auto"
      >
        <div className="sticky top-0 bg-[var(--color-paper)]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-[var(--color-line)]">
          <div className="font-display font-bold text-xl flex items-center">
            <span className="text-2xl mr-2">{recipe.emoji}</span>
            {recipe.name}
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full border border-[var(--color-line)]"
          >
            <X size={20} className="text-[var(--color-ink)]" />
          </button>
        </div>

        <div className="px-6 py-6 pb-24">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs px-3 py-1 bg-white border border-[var(--color-line)] rounded-full text-[var(--color-ink-soft)] flex items-center">
              <Clock size={12} className="mr-1" /> {recipe.time} min
            </span>
            <button
              onClick={() => setShowKcalInfo(true)}
              className={`text-xs px-3 py-1 rounded-full flex items-center ${badge.color}`}
            >
              {recipe.kcalPerServing} kcal ({badge.label})
              <Info size={12} className="ml-1 opacity-80" />
            </button>
            {recipe.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-[var(--color-sand)] text-[var(--color-ink)] rounded-full border border-[var(--color-line)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h4 className="font-semibold text-lg mb-3">
            Ingredientes ({recipe.baseServings} doses)
          </h4>
          <ul className="space-y-3 mb-8">
            {recipe.ingredients.map((ing: any, i: number) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white p-3 rounded-xl border border-[var(--color-line)]"
              >
                <span className="font-medium text-sm">{ing.name}</span>
                <span className="text-[var(--color-ink-soft)] text-sm">
                  {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
          </ul>

          <h4 className="font-semibold text-lg mb-3">Modo de Preparação</h4>
          <ol className="space-y-4 list-decimal pl-4 mb-4">
            {recipe.instructions.map((step: string, i: number) => (
              <li key={i} className="text-sm text-[var(--color-ink)] pl-2">
                {step}
              </li>
            ))}
          </ol>

          <p className="text-xs text-[var(--color-ink-soft)] mt-6 text-center">
            Calorias por dose/pessoa, como orientação. Numa versão real seriam
            validadas por uma base nutricional certificada.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-line)] w-full max-w-lg mx-auto">
          <button
            onClick={() => setShowPicker(true)}
            className="w-full bg-[var(--color-brand)] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Adicionar ao plano</span>
          </button>
        </div>
      </motion.div>

      {/* Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <DayMealPicker
            recipe={recipe}
            appState={appState}
            updateState={updateState}
            onClose={() => setShowPicker(false)}
            onComplete={() => {
              setShowPicker(false);
              onClose();
              showToast(`${recipe.name} adicionado!`);
              goToTab("semana");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKcalInfo && (
          <KcalInfoModal onClose={() => setShowKcalInfo(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function DayMealPicker({
  recipe,
  appState,
  updateState,
  onClose,
  onComplete,
}: any) {
  const days = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const handleSelect = (day: string, meal: "almoco" | "jantar") => {
    const updatedPlan = [...appState.weekPlan];
    const dayIndex = updatedPlan.findIndex((d) => d.day === day);
    if (dayIndex > -1) {
      updatedPlan[dayIndex] = {
        ...updatedPlan[dayIndex],
        [meal]: { id: Math.random().toString(36), recipeId: recipe.id },
      };
      updateState({ weekPlan: updatedPlan });
      onComplete();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[60]"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] p-6 pb-safe w-full max-w-lg mx-auto"
      >
        <h3 className="font-display font-bold text-xl mb-4">Para quando?</h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {days.map((day) => (
            <div key={day}>
              <div className="font-medium mb-2">{day}</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect(day, "almoco")}
                  className="py-2.5 rounded-xl border border-[var(--color-line)] hover:bg-[var(--color-brand-soft)] transition-colors text-sm font-medium"
                >
                  Almoço
                </button>
                <button
                  onClick={() => handleSelect(day, "jantar")}
                  className="py-2.5 rounded-xl border border-[var(--color-line)] hover:bg-[var(--color-brand-soft)] transition-colors text-sm font-medium"
                >
                  Jantar
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function KcalInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[60]"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-[var(--color-paper)] rounded-t-3xl z-[70] p-6 pb-safe w-full max-w-lg mx-auto"
      >
        <h3 className="font-display font-bold text-xl mb-4">
          Guia de Calorias
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)] mb-6">
          As calorias apresentadas são valores de referência por dose/pessoa e
          classificam as receitas em três níveis:
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#2E5E4E] flex-shrink-0 mr-3"></div>
            <div>
              <div className="font-bold text-[var(--color-ink)] text-sm">
                Leve (≤ 450 kcal)
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#C8972A] flex-shrink-0 mr-3"></div>
            <div>
              <div className="font-bold text-[var(--color-ink)] text-sm">
                Equilibrado (451 - 700 kcal)
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#D9682E] flex-shrink-0 mr-3"></div>
            <div>
              <div className="font-bold text-[var(--color-ink)] text-sm">
                Reforçado (&gt; 700 kcal)
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-sand)] p-4 rounded-xl text-xs text-[var(--color-ink-soft)] mb-6">
          <strong>Aviso:</strong> Esta classificação é apenas informativa e não
          prescreve metas calóricas, numa versão final seria validada por base
          nutricional.
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-white border border-[var(--color-line)] text-[var(--color-ink)] font-bold rounded-xl active:bg-[var(--color-sand)] transition-colors"
        >
          Fechar
        </button>
      </motion.div>
    </>
  );
}
