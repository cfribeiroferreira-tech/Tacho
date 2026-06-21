import { useState, useRef } from "react";
import { AppState, DayPlan, Recipe } from "../types";
import { getRecipeById, generateWeekMenu } from "../utils/engine";
import {
  Users,
  Clock,
  Trash2,
  X,
  Sparkles,
  AlertCircle,
  Info,
  Download,
  ChevronLeft,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { RecipeDetailModal } from "./RecipeDetailModal";
import { AdSlot } from "./AdSlot";
import html2canvas from "html2canvas";

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
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (!printRef.current) return;
    try {
      setIsExporting(true);
      showToast("A gerar imagem...");
      // small delay to let UI updates register
      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: "#FAFCFB", // same as bg default
        windowWidth: 800,
      });

      const imgData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = "Planeamento_Semana.png";
      a.click();
      showToast("Imagem guardada no seu dispositivo!");
    } catch (e) {
      console.error(e);
      showToast("Erro ao exportar imagem.");
    } finally {
      setIsExporting(false);
    }
  };

  const saveCurrentToHistory = () => {
    // Only save if there's at least one meal planned
    const hasMeals = appState.weekPlan.some(
      (day) => day.pequeno_almoco || day.almoco || day.lanche || day.jantar,
    );
    if (!hasMeals) return;

    const currentTotalWeekCalories = appState.weekPlan.reduce((acc, day) => {
      let dcal = 0;
      ["pequeno_almoco", "almoco", "lanche", "jantar"].forEach((m) => {
        const meal = day[m as keyof DayPlan] as any;
        if (meal) {
          const rec = getRecipeById(meal.recipeId) || meal.customRecipe;
          if (rec?.kcal) dcal += rec.kcal;
        }
      });
      return acc + dcal;
    }, 0);
    const avgCal = Math.round(currentTotalWeekCalories / 7);

    const newHistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      weekPlan: [...appState.weekPlan],
      tag: appState.generatorConfig?.focus || "Manual",
      calories: avgCal,
    };

    const currentHistory = appState.menuHistory || [];
    // Keep last 10 entries max
    const newHistory = [...currentHistory, newHistoryItem].slice(-10);

    updateState({ menuHistory: newHistory });
  };

  const handlePeopleChange = (delta: number) => {
    const newVal = appState.peopleCount + delta;
    if (newVal >= 1 && newVal <= 12) {
      updateState({ peopleCount: newVal });
    }
  };

  const removeMeal = (
    dayIdx: number,
    meal: "pequeno_almoco" | "almoco" | "lanche" | "jantar",
  ) => {
    const updated = [...appState.weekPlan];
    updated[dayIdx] = { ...updated[dayIdx], [meal]: null };
    updateState({ weekPlan: updated });
  };

  const clearWeek = () => {
    saveCurrentToHistory();
    const empty = appState.weekPlan.map((d) => ({
      ...d,
      pequeno_almoco: null,
      almoco: null,
      lanche: null,
      jantar: null,
    }));
    updateState({ weekPlan: empty });
    showToast("Semana apagada");
  };

  const runGeneratorLocal = (
    focus: string,
    mealTypes: ("Pequeno-almoço" | "Almoço" | "Lanche" | "Jantar")[],
  ) => {
    saveCurrentToHistory();
    const mergePlan = (generatedPlan: any[]) => {
      return appState.weekPlan.map((day, idx) => {
        const newDay = generatedPlan[idx] || {};
        return {
          ...day,
          pequeno_almoco: mealTypes.includes("Pequeno-almoço")
            ? newDay.pequeno_almoco || null
            : null,
          almoco: mealTypes.includes("Almoço") ? newDay.almoco || null : null,
          lanche: mealTypes.includes("Lanche") ? newDay.lanche || null : null,
          jantar: mealTypes.includes("Jantar") ? newDay.jantar || null : null,
        };
      });
    };

    const newPlan = generateWeekMenu(focus, appState, mealTypes);
    updateState({
      weekPlan: mergePlan(newPlan),
      generatorConfig: { focus, mealTypes },
    });
    setShowGenerator(false);
    showToast("Ementa sugerida através das receitas locais!");
  };

  const currentTotalWeekCalories = appState.weekPlan.reduce((acc, day) => {
    let dcal = 0;
    ["pequeno_almoco", "almoco", "lanche", "jantar"].forEach((m) => {
      const meal = day[m as keyof DayPlan] as any;
      if (meal) {
        const rec = getRecipeById(meal.recipeId) || meal.customRecipe;
        if (rec?.kcal) dcal += rec.kcal;
      }
    });
    return acc + dcal;
  }, 0);
  const activeDaysCount = appState.weekPlan.filter(
    (day) => day.pequeno_almoco || day.almoco || day.lanche || day.jantar,
  ).length;
  const averageDayCalories =
    activeDaysCount > 0
      ? Math.round(currentTotalWeekCalories / activeDaysCount)
      : 0;

  return (
    <div className="pt-6 px-4 pb-24">
      <button
        onClick={() => goToTab("home")}
        className="flex items-center text-sm text-[var(--color-ink-soft)] font-medium mb-4 hover:text-[var(--color-ink)] transition-colors active:scale-95 group hide-on-print"
      >
        <div className="bg-white border border-[var(--color-line)] rounded-full p-1 mr-2 group-hover:bg-gray-50">
          <ChevronLeft size={16} />
        </div>
        Voltar ao Início
      </button>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-display text-[var(--color-ink)] font-bold">
          Semana
        </h1>
        <div
          className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-[var(--color-line)] shadow-sm cursor-pointer"
          onClick={() => setShowFamilyModal(true)}
        >
          <div className="flex items-center space-x-1 font-medium text-sm">
            <Users size={14} />
            <span>
              {appState.adultsCount} Adultos, {appState.children?.length || 0}{" "}
              Crianças
            </span>
          </div>
        </div>
      </div>

      {(appState.generatorConfig || averageDayCalories > 0) && (
        <div className="flex items-center gap-2 mb-4 bg-white/50 p-2 rounded-xl border border-[var(--color-line)] shrink-0 overflow-x-auto">
          {appState.generatorConfig && (
            <div className="flex items-center space-x-1 bg-[var(--color-brand-soft)]/50 text-[var(--color-brand)] px-2 py-1 rounded-md">
              <Sparkles size={12} />
              <span className="text-[11px] font-bold">
                Sugerido: {appState.generatorConfig.focus}
              </span>
            </div>
          )}
          {averageDayCalories > 0 && (
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-bold ${averageDayCalories > 2500 ? "bg-orange-100 text-orange-700" : "bg-[var(--color-paper)] text-[var(--color-ink-soft)] border border-[var(--color-line)]"}`}
            >
              <Info size={12} />
              <span>
                Aporte Calórico Médio: ~{averageDayCalories} kcal/dia/pessoa
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-2 mb-6 hide-on-print">
        <button
          onClick={() => setShowGenerator(true)}
          className="flex-1 bg-[var(--color-brand)] text-white py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center space-x-1"
        >
          <Sparkles size={16} /> <span>Sugerir ementa</span>
        </button>
        <button
          onClick={exportAsImage}
          disabled={isExporting}
          className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink)] hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
          title="Exportar como imagem"
        >
          <Download size={18} />
        </button>
        <button
          className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink-soft)]"
          onClick={() => setShowHistoryModal(true)}
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

      <div
        className="space-y-4"
        ref={printRef}
        style={
          isExporting
            ? {
                width: "800px",
                maxWidth: "800px",
                padding: "20px",
                background: "#FAFCFB",
              }
            : undefined
        }
      >
        {isExporting && (
          <h2 className="text-3xl font-display font-bold text-center mb-6 text-[var(--color-ink)]">
            Ementa Semanal O Nosso Sabor
          </h2>
        )}
        {appState.weekPlan.flatMap((dayPlan, idx) => {
          let dayKcal = 0;
          const computeKcal = (meal: any) => {
            if (!meal) return;
            const isDirectRecipe = !!meal.name;
            const r = isDirectRecipe
              ? meal
              : meal.customRecipe || getRecipeById(meal.recipeId);
            if (r) dayKcal += r.kcalPerServing || 0;
          };
          computeKcal(dayPlan.pequeno_almoco);
          computeKcal(dayPlan.almoco);
          computeKcal(dayPlan.lanche);
          computeKcal(dayPlan.jantar);

          return [
            ...(idx === 3 && !isExporting
              ? [
                  <AdSlot
                    key={`ad-${idx}`}
                    type="rectangle"
                    className="my-6 shadow-sm"
                  />,
                ]
              : []),
            <div
              key={`${dayPlan.day}-${idx}`}
              className="bg-white border border-[var(--color-line)] rounded-2xl p-4 shadow-sm page-break-inside-avoid"
              style={{ pageBreakInside: "avoid" }}
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
                  label="P. Almoço"
                  meal={dayPlan.pequeno_almoco}
                  onRemove={() => removeMeal(idx, "pequeno_almoco")}
                  onAdd={() => {
                    updateState({
                      pendingRecipeSelection: {
                        type: "weekPlan",
                        day: dayPlan.day,
                        meal: "pequeno_almoco",
                      },
                    });
                    goToTab("receitas");
                  }}
                  onViewRecipe={setViewingRecipe}
                  isExporting={isExporting}
                />
                <MealSlot
                  label="Almoço"
                  meal={dayPlan.almoco}
                  onRemove={() => removeMeal(idx, "almoco")}
                  onAdd={() => {
                    updateState({
                      pendingRecipeSelection: {
                        type: "weekPlan",
                        day: dayPlan.day,
                        meal: "almoco",
                      },
                    });
                    goToTab("receitas");
                  }}
                  onViewRecipe={setViewingRecipe}
                  isExporting={isExporting}
                />
                <MealSlot
                  label="Lanche"
                  meal={dayPlan.lanche}
                  onRemove={() => removeMeal(idx, "lanche")}
                  onAdd={() => {
                    updateState({
                      pendingRecipeSelection: {
                        type: "weekPlan",
                        day: dayPlan.day,
                        meal: "lanche",
                      },
                    });
                    goToTab("receitas");
                  }}
                  onViewRecipe={setViewingRecipe}
                  isExporting={isExporting}
                />
                <MealSlot
                  label="Jantar"
                  meal={dayPlan.jantar}
                  onRemove={() => removeMeal(idx, "jantar")}
                  onAdd={() => {
                    updateState({
                      pendingRecipeSelection: {
                        type: "weekPlan",
                        day: dayPlan.day,
                        meal: "jantar",
                      },
                    });
                    goToTab("receitas");
                  }}
                  onViewRecipe={setViewingRecipe}
                  isExporting={isExporting}
                />
              </div>
            </div>,
          ];
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
        {showHistoryModal && (
          <HistoryModal
            history={appState.menuHistory || []}
            onClose={() => setShowHistoryModal(false)}
            onRestore={(weekPlan: any) => {
              saveCurrentToHistory();
              updateState({ weekPlan });
              setShowHistoryModal(false);
              showToast("Ementa restaurada!");
            }}
            onClear={() => {
              updateState({ menuHistory: [] });
              setShowHistoryModal(false);
              showToast("Histórico apagado!");
            }}
            onDeleteEntry={(id: string) => {
              const newHistory = (appState.menuHistory || []).filter(
                (h) => h.id !== id,
              );
              updateState({ menuHistory: newHistory });
              showToast("Entrada apagada!");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGenerator && (
          <GeneratorModal
            initialConfig={appState.generatorConfig}
            onClose={() => setShowGenerator(false)}
            onGenerateLocal={runGeneratorLocal}
          />
        )}
        {showFamilyModal && (
          <FamilyConfigModal
            appState={appState}
            updateState={updateState}
            onClose={() => setShowFamilyModal(false)}
          />
        )}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center p-6 bg-white border border-[var(--color-line)] rounded-3xl shadow-xl max-w-sm w-full mx-4">
              <div className="text-4xl mb-4 animate-bounce">✨</div>
              <h3 className="font-display font-bold text-xl mb-2 text-[var(--color-ink)]">
                A criar a tua ementa
              </h3>
              <p className="text-[var(--color-ink-soft)] text-sm mb-4">
                A usar Inteligência Artificial para preparar deliciosas receitas
                para a tua família...
              </p>
              <div className="w-full bg-[var(--color-line)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--color-brand)] h-2 w-1/2 rounded-full animate-pulse transition-all"></div>
              </div>
            </div>
          </motion.div>
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

function MealSlot({
  label,
  meal,
  onRemove,
  onAdd,
  onViewRecipe,
  isExporting,
}: any) {
  // Check if meal actually has data
  if (!meal || (!meal.name && !meal.recipeId && !meal.customRecipe)) {
    if (isExporting) return null;
    return (
      <div className="flex items-center h-12">
        <span className="w-16 text-xs font-medium text-[var(--color-ink-soft)] shrink-0">
          {label}
        </span>
        <button
          onClick={onAdd}
          className="flex-1 h-full border border-dashed border-[var(--color-line)] rounded-xl py-2 text-sm text-[var(--color-brand)] font-medium bg-[var(--color-brand-soft)]/30 hover:bg-[var(--color-brand-soft)] transition-colors"
        >
          + adicionar
        </button>
      </div>
    );
  }

  const isDirectRecipe = !!meal.name;
  const recipe = isDirectRecipe
    ? meal
    : meal.customRecipe || getRecipeById(meal.recipeId);

  if (!recipe) {
    if (isExporting) return null;
    return (
      <div className="flex items-center h-12">
        <span className="w-16 text-xs font-medium text-[var(--color-ink-soft)] shrink-0">
          {label}
        </span>
        <button
          onClick={onAdd}
          className="flex-1 h-full border border-dashed border-[var(--color-line)] rounded-xl py-2 text-sm text-[var(--color-brand)] font-medium bg-[var(--color-brand-soft)]/30 hover:bg-[var(--color-brand-soft)] transition-colors"
        >
          + adicionar
        </button>
      </div>
    );
  }

  const cleanRecipeName = (name: string) =>
    name
      ? name
          .replace(/[#*`_]+/g, "")
          .replace(/\n/g, " ")
          .trim()
      : "";

  return (
    <div className="flex items-center relative h-12">
      <span className="w-16 text-xs font-medium text-[var(--color-ink-soft)] shrink-0">
        {label}
      </span>
      <div
        onClick={() => !isExporting && onViewRecipe && onViewRecipe(recipe)}
        className="flex-1 h-full min-w-0 max-w-full bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl py-2 px-3 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform overflow-hidden"
        style={
          isExporting
            ? {
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                cursor: "default",
              }
            : undefined
        }
      >
        <div className="flex items-center space-x-2 truncate pr-2">
          <span className="text-xl leading-none shrink-0">{recipe.emoji}</span>
          <span className="text-sm font-medium truncate">
            {cleanRecipeName(recipe.name)}
          </span>
        </div>
        {!isExporting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-[var(--color-ink-soft)] shrink-0 p-1 hover:bg-white rounded-full bg-transparent"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function FamilyConfigModal({ appState, updateState, onClose }: any) {
  const [adultsCount, setAdultsCount] = useState(appState.adultsCount || 2);
  const [children, setChildren] = useState<{ age: number }[]>(
    appState.children || [],
  );

  const save = () => {
    updateState({
      adultsCount,
      children,
      // Keep peopleCount updated for backward compatibility
      peopleCount: adultsCount + children.length,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[#FAF9F6] w-full max-w-lg sm:rounded-3xl rounded-t-3xl p-6 shadow-xl pb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-display text-[var(--color-ink)]">
            Configurar Família
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-2"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="font-bold text-[var(--color-ink)]">Adultos</label>
            <div className="flex items-center space-x-4 bg-white border border-[var(--color-line)] rounded-full px-4 py-2">
              <button
                onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                className="text-[var(--color-ink-soft)] font-medium text-lg"
              >
                -
              </button>
              <span className="font-bold w-4 text-center">{adultsCount}</span>
              <button
                onClick={() => setAdultsCount(adultsCount + 1)}
                className="text-[var(--color-ink-soft)] font-medium text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-[var(--color-ink)]">
                Crianças
              </label>
              <button
                onClick={() => setChildren([...children, { age: 5 }])}
                className="bg-[var(--color-paper)] border border-[var(--color-line)] px-3 py-1.5 rounded-lg text-sm font-bold text-[var(--color-ink)] flex items-center"
              >
                + Adicionar Criança
              </button>
            </div>

            <div className="space-y-3">
              {children.map((child, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-[var(--color-line)] p-3 rounded-xl"
                >
                  <span className="text-sm font-medium">
                    Idade da criança {idx + 1}
                  </span>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      max="17"
                      value={child.age.toString()}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const newChildren = [...children];
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = 0;
                        newChildren[idx] = {
                          age: val,
                        };
                        setChildren(newChildren);
                      }}
                      className="w-16 border border-[var(--color-line)] rounded-lg p-1.5 text-center font-bold"
                    />
                    <button
                      onClick={() => {
                        const newChildren = [...children];
                        newChildren.splice(idx, 1);
                        setChildren(newChildren);
                      }}
                      className="text-red-400 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {children.length === 0 && (
                <p className="text-sm text-[var(--color-ink-soft)] italic">
                  Sem crianças configuradas.
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={save}
          className="w-full mt-8 bg-[var(--color-brand)] text-white font-bold py-3.5 rounded-xl shadow-sm text-lg"
        >
          Guardar Configuração
        </button>
      </div>
    </div>
  );
}

function GeneratorModal({ onClose, onGenerateLocal, initialConfig }: any) {
  const [mealTypes, setMealTypes] = useState<
    ("Pequeno-almoço" | "Almoço" | "Lanche" | "Jantar")[]
  >(
    initialConfig?.mealTypes || [
      "Pequeno-almoço",
      "Almoço",
      "Lanche",
      "Jantar",
    ],
  );
  const [focus, setFocus] = useState<string>(initialConfig?.focus || "Geral");
  const options = [
    "Geral",
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
    "Praia",
    "Económico",
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
        className="fixed bottom-0 left-0 right-0 bg-[var(--color-paper)] h-[90vh] overflow-y-auto rounded-t-3xl z-50 p-6 pb-20 w-full max-w-lg mx-auto"
      >
        <h3 className="font-display font-bold text-xl mb-4">Sugerir ementa</h3>

        <div className="mb-6">
          <h4 className="font-bold mb-3">Refeições a preencher</h4>
          <div className="grid grid-cols-2 gap-2">
            {["Pequeno-almoço", "Almoço", "Lanche", "Jantar"].map(
              (type, idx) => (
                <button
                  key={`${type}-${idx}`}
                  onClick={() => {
                    setMealTypes((prev) =>
                      prev.includes(type as any)
                        ? prev.filter((t) => t !== type)
                        : [...prev, type as any],
                    );
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${mealTypes.includes(type as any) ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]" : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)] hover:border-[var(--color-brand)]"}`}
                >
                  {type}
                </button>
              ),
            )}
          </div>
        </div>

        <h4 className="font-bold mb-3">Escolhe o Foco</h4>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {options.map((opt, idx) => (
            <button
              key={`${opt}-${idx}`}
              onClick={() => setFocus(opt)}
              className={`border py-2 px-3 rounded-xl font-medium text-xs text-center transition-all ${focus === opt ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow-sm" : "bg-white text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-brand)]"}`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="space-y-3 mt-4">
          <button
            onClick={() => onGenerateLocal(focus, mealTypes)}
            className="w-full py-4 bg-[var(--color-brand)] text-white font-bold rounded-xl shadow-sm hover:brightness-110 transition-all flex justify-center items-center gap-2"
          >
            Gerar Nova Ementa
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-transparent text-[var(--color-ink-soft)] font-medium rounded-xl mt-4 hover:bg-[var(--color-line)] transition-all"
        >
          Cancelar
        </button>
      </motion.div>
    </>
  );
}

function HistoryModal({
  history,
  onClose,
  onRestore,
  onClear,
  onDeleteEntry,
}: any) {
  // Sort history newest first
  const sorted = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

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
        className="fixed bottom-0 left-0 right-0 bg-[var(--color-paper)] h-[90vh] overflow-y-auto rounded-t-3xl z-50 p-6 pb-20 w-full max-w-lg mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold text-xl">Histórico</h3>
          {sorted.length > 0 && (
            <button
              onClick={onClear}
              className="text-red-500 text-sm font-medium hover:underline"
            >
              Apagar tudo
            </button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-10 text-[var(--color-ink-soft)]">
            <Clock size={40} className="mx-auto mb-4 opacity-20" />
            <p>O histórico está vazio.</p>
            <p className="text-sm mt-2">
              Gera ou apaga ementas para guardar o progresso automaticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((item: any, idx: number) => {
              const d = new Date(item.date);
              const dateStr = d.toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              });

              // Preview text
              const firstMeals = item.weekPlan
                .slice(0, 3)
                .map((w: any) => {
                  let mealName = "Refeição";
                  if (w.jantar) {
                    mealName =
                      w.jantar.name ||
                      w.jantar.customRecipe?.name ||
                      getRecipeById(w.jantar.recipeId)?.name ||
                      "Jantar";
                  } else if (w.almoco) {
                    mealName =
                      w.almoco.name ||
                      w.almoco.customRecipe?.name ||
                      getRecipeById(w.almoco.recipeId)?.name ||
                      "Almoço";
                  }
                  return mealName;
                })
                .join(", ");

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-white border border-[var(--color-line)] p-4 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-[var(--color-ink)]">
                        Salvo em {dateStr}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.tag && (
                          <span className="text-[10px] font-bold text-[var(--color-brand)] bg-[var(--color-brand-soft)]/50 px-2 py-0.5 rounded-md">
                            Foco: {item.tag}
                          </span>
                        )}
                        {item.calories ? (
                          <span className="text-[10px] font-medium text-[var(--color-ink-soft)] bg-[var(--color-paper)] border border-[var(--color-line)] px-2 py-0.5 rounded-md">
                            ~{item.calories} kcal/dia
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onDeleteEntry(item.id)}
                        className="text-red-500 font-medium text-sm bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Apagar
                      </button>
                      <button
                        onClick={() => onRestore(item.weekPlan)}
                        className="text-[var(--color-brand)] font-medium text-sm bg-[var(--color-brand-soft)] px-3 py-1 rounded-lg hover:bg-[var(--color-brand)] hover:text-white transition-colors"
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-ink-soft)] truncate mt-2">
                    Exemplo: {firstMeals}...
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-[var(--color-line)] text-[var(--color-ink)] font-bold rounded-xl mt-6 hover:brightness-95 transition-all"
        >
          Fechar
        </button>
      </motion.div>
    </>
  );
}
