import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Info, Plus, Heart } from "lucide-react";
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
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [showKcalInfo, setShowKcalInfo] = useState(false);
  const badge = getCalorieBadgeLevel(recipe.kcalPerServing);
  
  const isFavorite = appState.favorites?.includes(recipe.id) || false;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favs = appState.favorites || [];
    if (isFavorite) {
      updateState({ favorites: favs.filter((f) => f !== recipe.id) });
      showToast("Removido dos favoritos");
    } else {
      updateState({ favorites: [...favs, recipe.id] });
      showToast("Adicionado aos favoritos!");
    }
  };

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
        <div className="sticky top-0 bg-[var(--color-paper)]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-[var(--color-line)] z-10">
          <div className="font-display font-bold text-xl flex items-center pr-2">
            <span className="text-2xl mr-2">{recipe.emoji}</span>
            {recipe.name}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className="p-2 bg-white rounded-full border border-[var(--color-line)] shrink-0"
            >
              <Heart size={20} className={isFavorite ? "fill-orange-500 text-orange-500" : "text-[var(--color-ink)]"} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white rounded-full border border-[var(--color-line)] shrink-0"
            >
              <X size={20} className="text-[var(--color-ink)]" />
            </button>
          </div>
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
            {recipe.tags.map((tag: string, idx: number) => (
              <span
                key={`${tag}-${idx}`}
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

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-line)] w-full max-w-lg mx-auto flex gap-3">
          <button
            onClick={() => setShowPicker(true)}
            className="flex-1 bg-[var(--color-brand)] text-white py-3.5 rounded-2xl font-bold flex flex-col items-center justify-center text-sm shadow-sm active:scale-95 transition-transform"
          >
            <span className="flex items-center gap-1"><Plus size={16} /> Plano Semanal</span>
          </button>
          <button
            onClick={() => setShowCollectionPicker(true)}
            className="flex-1 bg-[var(--color-paper)] border-2 border-[var(--color-line)] text-[var(--color-ink)] py-3.5 rounded-2xl font-bold flex flex-col items-center justify-center text-sm active:scale-95 transition-transform hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          >
            <span className="flex items-center gap-1"><Plus size={16} /> Coleção</span>
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

      {/* Collection Picker Modal */}
      <AnimatePresence>
        {showCollectionPicker && (
          <CollectionPicker
            recipe={recipe}
            appState={appState}
            updateState={updateState}
            onClose={() => setShowCollectionPicker(false)}
            onComplete={(isAlreadyAdded: boolean) => {
              setShowCollectionPicker(false);
              onClose();
              if (isAlreadyAdded) {
                showToast("A receita já consta desta coleção.");
              } else {
                showToast(`${recipe.name} adicionado à coleção!`);
                goToTab("menus");
              }
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

  const handleSelect = (day: string, meal: "pequeno_almoco" | "almoco" | "lanche" | "jantar") => {
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
          {days.map((day, idx) => (
            <div key={`${day}-${idx}`}>
              <div className="font-medium mb-2">{day}</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect(day, "pequeno_almoco")}
                  className="py-2.5 rounded-xl border border-[var(--color-line)] hover:bg-[var(--color-brand-soft)] transition-colors text-sm font-medium"
                >
                  P. Almoço
                </button>
                <button
                  onClick={() => handleSelect(day, "almoco")}
                  className="py-2.5 rounded-xl border border-[var(--color-line)] hover:bg-[var(--color-brand-soft)] transition-colors text-sm font-medium"
                >
                  Almoço
                </button>
                <button
                  onClick={() => handleSelect(day, "lanche")}
                  className="py-2.5 rounded-xl border border-[var(--color-line)] hover:bg-[var(--color-brand-soft)] transition-colors text-sm font-medium"
                >
                  Lanche
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

function CollectionPicker({
  recipe,
  appState,
  updateState,
  onClose,
  onComplete,
}: any) {
  const menus = appState.customMenus || [];

  const handleSelect = (menuId: string) => {
    let isAlreadyAdded = false;

    if (menuId === "favorites") {
      const favs = appState.favorites || [];
      if (!favs.includes(recipe.id)) {
        updateState({ favorites: [...favs, recipe.id] });
      } else {
        isAlreadyAdded = true;
      }
      onComplete(isAlreadyAdded);
      return;
    }

    let targetMenu = menus.find((m: any) => m.id === menuId);
    let newMenus = [...menus];

    if (!targetMenu) {
      targetMenu = {
        id: Math.random().toString(36).substring(7),
        name: "Nova Coleção",
        recipeIds: [recipe.id],
      };
      newMenus.push(targetMenu);
    } else {
      if (!targetMenu.recipeIds.includes(recipe.id)) {
        newMenus = newMenus.map(m => m.id === menuId ? { ...m, recipeIds: [...m.recipeIds, recipe.id] } : m);
      } else {
        isAlreadyAdded = true;
      }
    }

    updateState({ customMenus: newMenus });
    onComplete(isAlreadyAdded);
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
        <h3 className="font-display font-bold text-xl mb-4">Adicionar à Coleção</h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <button
            onClick={() => handleSelect("favorites")}
            className="w-full text-left p-3 rounded-xl border border-[var(--color-line)] hover:border-[var(--color-brand)] transition-colors flex justify-between items-center bg-orange-50"
          >
            <div className="flex items-center">
              <span className="font-medium text-[var(--color-ink)]">Favoritos</span>
            </div>
            <Heart size={16} className="text-orange-500 fill-orange-500" />
          </button>
          
          {menus.map((menu: any) => {
            return (
              <button
                key={menu.id}
                onClick={() => handleSelect(menu.id)}
                className={`w-full text-left p-3 rounded-xl border border-[var(--color-line)] hover:border-[var(--color-brand)] transition-colors flex justify-between items-center`}
              >
                <div className="flex items-center">
                  <span className="font-medium text-[var(--color-ink)]">{menu.name}</span>
                </div>
                <span className="text-sm text-[var(--color-ink-soft)]">{menu.recipeIds.length} receitas</span>
              </button>
            );
          })}
          
          <button
            onClick={() => handleSelect("new")}
            className="w-full text-left p-3 rounded-xl border-2 border-dashed border-[var(--color-line)] hover:border-[var(--color-ink)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors flex items-center justify-center font-medium mt-4"
          >
            <Plus size={18} className="mr-2" />
            Criar Nova Coleção
          </button>
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
