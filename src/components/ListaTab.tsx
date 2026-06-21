import React, { useState, useMemo } from "react";
import {
  AppState,
  AISLE_ORDER,
  Supermarket,
  SUPERMARKET_LINKS,
} from "../types";
import {
  generateShoppingList,
  getAllIngredients,
  removeAccents,
} from "../utils/engine";
import type { AggregatedItem } from "../utils/engine";
import { getEstimatedPrice, getLastScrapedAt } from "../utils/pricing";
import {
  Copy,
  ExternalLink,
  Settings,
  CheckCircle2,
  Circle,
  Lightbulb,
  Share2,
  Users,
  Download,
  Plus,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AdSlot } from "./AdSlot";

const TIPS = [
  "Verifica as promoções da semana nos folhetos digitais antes de ir às compras.",
  "Considera comprar produtos a granel para reduzir o desperdício e poupar.",
  "Verifica as datas de validade para garantir que os frescos duram toda a semana.",
  "Marcas brancas costumam ter excelente qualidade a um preço mais acessível.",
  "Reaproveita os sacos reutilizáveis que já tens em casa.",
];

interface Props {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  showToast: (msg: string) => void;
}

export default function ListaTab({
  appState,
  updateState,
  showToast,
  goToTab,
}: Props & { goToTab?: (tab: any) => void }) {
  const [showMarkets, setShowMarkets] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [randomTip] = useState(
    () => TIPS[Math.floor(Math.random() * TIPS.length)],
  );

  // Memoize so it doesn't recalculate unless plan/people/pantry changes
  const { grouped, excludedCount, excludedNames } = useMemo(() => {
    let plan = appState.weekPlan;
    if (
      appState.activeListView?.type === "menu" &&
      appState.activeListView.menuId
    ) {
      if (appState.activeListView.menuId === "favorites") {
        plan = (appState.favorites || []).map((rId, i) => ({
          day: "Segunda" as any,
          pequeno_almoco: null,
          lanche: null,
          almoco: { id: `mock-fav-${i}`, recipeId: rId },
          jantar: null,
        }));
      } else {
        const menu = appState.customMenus?.find(
          (m) => m.id === appState.activeListView?.menuId,
        );
        if (menu) {
          // Mock a week plan to reuse generateShoppingList
          plan = menu.recipeIds.map((rId, i) => ({
            day: "Segunda" as any,
            pequeno_almoco: null,
            lanche: null,
            almoco: { id: `mock-${i}`, recipeId: rId },
            jantar: null,
          }));
        }
      }
    }

    let effectivePeopleCount = appState.peopleCount;
    if (
      appState.activeListView?.type === "menu" &&
      appState.activeListView.menuId !== "favorites"
    ) {
      const menu = appState.customMenus?.find(
        (m) => m.id === appState.activeListView?.menuId,
      );
      if (
        menu &&
        (menu.adultsCount !== undefined || menu.children !== undefined)
      ) {
        const adults = menu.adultsCount ?? 2;
        const kids = menu.children ?? [];
        effectivePeopleCount = adults + kids.length;
      }
    }

    return generateShoppingList(plan, effectivePeopleCount, appState.pantry);
  }, [
    appState.weekPlan,
    appState.peopleCount,
    appState.pantry,
    appState.activeListView,
    appState.customMenus,
  ]);

  const toggleBought = (id: string) => {
    const current = appState.boughtItems;
    if (current.includes(id)) {
      updateState({ boughtItems: current.filter((i) => i !== id) });
    } else {
      updateState({ boughtItems: [...current, id] });
    }
  };

  const allIngredients = useMemo(() => {
    return getAllIngredients();
  }, []);

  const [customItemInput, setCustomItemInput] = useState("");
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);

  const customItemSuggestions = useMemo(() => {
    if (!customItemInput.trim()) return [];
    const query = removeAccents(customItemInput);
    return allIngredients
      .filter((i) => removeAccents(i).includes(query))
      .slice(0, 5);
  }, [customItemInput, allIngredients]);

  const addCustomItem = (e: React.FormEvent, itemValue?: string) => {
    e.preventDefault();
    const valueToAdd = itemValue || customItemInput.trim();
    if (!valueToAdd) return;
    const current = appState.customShoppingItems || [];
    if (!current.includes(valueToAdd)) {
      updateState({ customShoppingItems: [...current, valueToAdd] });
    }
    setCustomItemInput("");
    setShowItemSuggestions(false);
  };

  const removeCustomItem = (itemToRemove: string) => {
    const current = appState.customShoppingItems || [];
    updateState({
      customShoppingItems: current.filter((i) => i !== itemToRemove),
    });
    // Also remove from bought items if it was bought
    const currentBought = appState.boughtItems;
    if (currentBought.includes(`custom-${itemToRemove}`)) {
      updateState({
        boughtItems: currentBought.filter(
          (i) => i !== `custom-${itemToRemove}`,
        ),
      });
    }
  };

  const hasItems =
    (Object.values(grouped) as AggregatedItem[][]).some(
      (arr) => arr.length > 0,
    ) ||
    (appState.customShoppingItems && appState.customShoppingItems.length > 0);

  const { totalContinente, totalAuchan, recommendedMarket } = useMemo(() => {
    let continente = 0;
    let auchan = 0;

    (Object.values(grouped) as AggregatedItem[][]).forEach((items) => {
      items.forEach((item) => {
        const isBought = appState.boughtItems.includes(item.id);
        if (!isBought) {
          continente += getEstimatedPrice(
            item.name,
            item.totalQuantity,
            item.unit,
            "Continente",
          );
          auchan += getEstimatedPrice(
            item.name,
            item.totalQuantity,
            item.unit,
            "Auchan",
          );
        }
      });
    });

    const recommended = continente <= auchan ? "Continente" : "Auchan";

    return {
      totalContinente: continente,
      totalAuchan: auchan,
      recommendedMarket: recommended,
    };
  }, [grouped, appState.boughtItems]);

  const handleShareText = async () => {
    let effectiveAdultsCount = appState.adultsCount;
    let effectiveChildren = appState.children;
    let effectivePeopleCount = appState.peopleCount;

    if (
      appState.activeListView?.type === "menu" &&
      appState.activeListView.menuId !== "favorites"
    ) {
      const menu = appState.customMenus?.find(
        (m) => m.id === appState.activeListView?.menuId,
      );
      if (
        menu &&
        (menu.adultsCount !== undefined || menu.children !== undefined)
      ) {
        effectiveAdultsCount = menu.adultsCount ?? 2;
        effectiveChildren = menu.children ?? [];
        effectivePeopleCount = effectiveAdultsCount + effectiveChildren.length;
      }
    }

    const familyStr =
      effectiveChildren && effectiveChildren.length > 0
        ? `${effectiveAdultsCount} Adultos, ${effectiveChildren.length} Crianças`
        : `${effectivePeopleCount} ${effectivePeopleCount === 1 ? "pessoa" : "pessoas"}`;

    let text = `Lista de Compras (${familyStr})\n\n`;

    AISLE_ORDER.forEach((aisle) => {
      const items = grouped[aisle];
      if (!items || items.length === 0) return;
      text += `--- ${aisle.toUpperCase()} ---\n`;
      items.forEach((item) => {
        text += `☐ ${item.name} (${item.totalQuantity} ${item.unit})\n`;
      });
      text += "\n";
    });

    if (excludedCount > 0) {
      text += `(Excluídos ${excludedCount} itens que já estão na despensa)\n`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "A minha lista Tacho",
          text: text,
        });
        showToast("Texto partilhado!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          navigator.clipboard.writeText(text);
          showToast("Texto copiado!");
        }
      }
    } else {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Texto copiado!");
      });
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Lista de Compras", 14, 22);

    let effectiveAdultsCount = appState.adultsCount;
    let effectiveChildren = appState.children;
    let effectivePeopleCount = appState.peopleCount;

    if (
      appState.activeListView?.type === "menu" &&
      appState.activeListView.menuId !== "favorites"
    ) {
      const menu = appState.customMenus?.find(
        (m) => m.id === appState.activeListView?.menuId,
      );
      if (
        menu &&
        (menu.adultsCount !== undefined || menu.children !== undefined)
      ) {
        effectiveAdultsCount = menu.adultsCount ?? 2;
        effectiveChildren = menu.children ?? [];
        effectivePeopleCount = effectiveAdultsCount + effectiveChildren.length;
      }
    }

    doc.setFontSize(11);
    const familyStr =
      effectiveChildren && effectiveChildren.length > 0
        ? `${effectiveAdultsCount} Adultos, ${effectiveChildren.length} Crianças`
        : `${effectivePeopleCount} ${effectivePeopleCount === 1 ? "pessoa" : "pessoas"}`;

    doc.text(`Para ${familyStr}`, 14, 30);

    let yPos = 40;

    AISLE_ORDER.forEach((aisle) => {
      const items = grouped[aisle];
      if (!items || items.length === 0) return;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(aisle.toUpperCase(), 14, yPos);
      yPos += 4;

      const tableData: any[][] = [];
      for (let i = 0; i < items.length; i += 2) {
        const item1 = items[i];
        const item2 = items[i + 1];

        const row = [
          `[  ] ${item1.name}`,
          `${item1.totalQuantity} ${item1.unit}`,
        ];

        if (item2) {
          row.push(
            `[  ] ${item2.name}`,
            `${item2.totalQuantity} ${item2.unit}`,
          );
        } else {
          row.push("", "");
        }

        tableData.push(row);
      }

      autoTable(doc, {
        startY: yPos,
        head: [],
        body: tableData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 1.5, minCellHeight: 8 },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 20, halign: "right" },
          2: { cellWidth: 70 },
          3: { cellWidth: 20, halign: "right" },
        },
        margin: { left: 14, right: 14 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;

      // Page break if needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    if (excludedCount > 0) {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        `Nota: ${excludedCount} itens excluidos por ja estarem na despensa.`,
        14,
        yPos,
      );
    }

    doc.save("lista-compras-tacho.pdf");
    showToast("PDF descarregado!");
  };

  const getMarketLink = (market: Supermarket, query: string) => {
    const template = SUPERMARKET_LINKS[market];
    return template
      ? template.replace("{query}", encodeURIComponent(query))
      : "#";
  };

  let activeMenu = null;
  if (appState.activeListView?.type === "menu") {
    if (appState.activeListView.menuId === "favorites") {
      activeMenu = { id: "favorites", name: "Favoritos" };
    } else {
      activeMenu = appState.customMenus?.find(
        (m) => m.id === appState.activeListView?.menuId,
      );
    }
  }

  return (
    <div className="pt-6 px-4 pb-24">
      <button
        onClick={() => goToTab?.(activeMenu ? "menus" : "home")}
        className="flex items-center text-sm text-[var(--color-ink-soft)] font-medium mb-4 hover:text-[var(--color-ink)] transition-colors active:scale-95 group"
      >
        <div className="bg-white border border-[var(--color-line)] rounded-full p-1 mr-2 group-hover:bg-gray-50">
          <ChevronLeft size={16} />
        </div>
        {activeMenu ? "Voltar às Coleções" : "Voltar ao Início"}
      </button>
      <div className="flex justify-between items-center mb-6 gap-2">
        <div>
          <div className="flex flex-col relative items-start gap-1">
            <h1 className="flex flex-wrap items-center text-3xl font-display text-[var(--color-ink)] font-bold mb-1">
              Lista
              {appState.sharedRoomId && !activeMenu && (
                <span className="ml-3 inline-flex items-center text-[10px] bg-[var(--color-brand)]/10 text-[var(--color-brand)] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold h-6 align-middle">
                  <Users size={12} className="mr-1" /> Sincronizada
                </span>
              )}
            </h1>
          </div>
          <p className="text-[var(--color-ink-soft)] text-sm">
            {(() => {
              let effectiveAdultsCount = appState.adultsCount;
              let effectiveChildren = appState.children;
              let effectivePeopleCount = appState.peopleCount;

              if (
                appState.activeListView?.type === "menu" &&
                appState.activeListView.menuId !== "favorites"
              ) {
                const menu = appState.customMenus?.find(
                  (m) => m.id === appState.activeListView?.menuId,
                );
                if (
                  menu &&
                  (menu.adultsCount !== undefined ||
                    menu.children !== undefined)
                ) {
                  effectiveAdultsCount = menu.adultsCount ?? 2;
                  effectiveChildren = menu.children ?? [];
                  effectivePeopleCount =
                    effectiveAdultsCount + effectiveChildren.length;
                }
              }

              return effectiveChildren && effectiveChildren.length > 0
                ? `${effectiveAdultsCount} Adultos, ${effectiveChildren.length} Crianças`
                : `${effectivePeopleCount} ${effectivePeopleCount === 1 ? "pessoa" : "pessoas"}`;
            })()}
          </p>
        </div>
        <div className="flex space-x-2">
          {hasItems && (
            <>
              <button
                onClick={handleExportPDF}
                className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink)]"
                title="Exportar como PDF"
                aria-label="Exportar como PDF"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handleShareText}
                className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink)]"
                title="Partilhar Texto"
                aria-label="Partilhar Texto"
              >
                <Share2 size={20} />
              </button>
            </>
          )}
          <button
            onClick={() => setShowRoomModal(true)}
            className={`p-2.5 bg-white border ${appState.sharedRoomId ? "border-[var(--color-brand)] text-[var(--color-brand)] bg-[#E6EEE8]" : "border-[var(--color-line)] text-[var(--color-ink)]"} rounded-xl`}
            title={
              appState.sharedRoomId
                ? "Gerir Sincronização"
                : "Sincronizar Lista"
            }
            aria-label={
              appState.sharedRoomId
                ? "Gerir Sincronização"
                : "Sincronizar Lista"
            }
          >
            <Users size={20} />
          </button>
          <button
            onClick={() => setShowMarkets(true)}
            className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink)] hidden sm:flex"
            title="Configurar Supermercados"
            aria-label="Configurar Supermercados"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/20 p-4">
        <label className="block text-sm font-medium text-[var(--color-brand)] mb-2">
          Selecione a lista que pretende visualizar:
        </label>
        <div className="relative">
          <select
            value={
              appState.activeListView?.type === "menu"
                ? `menu:${appState.activeListView.menuId}`
                : "plan"
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "plan") {
                updateState({ activeListView: undefined });
              } else if (val.startsWith("menu:")) {
                updateState({
                  activeListView: {
                    type: "menu",
                    menuId: val.split(":")[1],
                  },
                });
              }
            }}
            className="w-full appearance-none bg-white border border-[var(--color-brand)]/30 rounded-xl pl-4 pr-10 py-3 text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] shadow-sm font-medium"
          >
            <option value="plan">Geral (Plano Semanal)</option>
            <optgroup label="Coleções">
              <option value="menu:favorites">Favoritos</option>
              {(appState.customMenus || []).map((m) => (
                <option key={m.id} value={`menu:${m.id}`}>
                  {m.name}
                </option>
              ))}
            </optgroup>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-brand)]">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {!hasItems && (
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-[var(--color-line)] mb-8 mt-4">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="font-display font-bold text-xl mb-2">Lista vazia</h3>
          <p className="text-[var(--color-ink-soft)] text-sm">
            Adiciona receitas ao plano da semana para gerar uma lista de
            compras, ou começa a adicionar itens manualmente abaixo.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {/* Price Estimator */}
        {(totalContinente > 0 || totalAuchan > 0) && (
          <div className="bg-white border border-[var(--color-line)] rounded-2xl p-4 shadow-sm overflow-hidden mb-8">
            <h4 className="font-bold text-[var(--color-ink)] mb-3 text-sm flex items-center">
              <span className="bg-[#E6EEE8] text-[var(--color-brand)] p-1.5 rounded-lg mr-2">
                💰
              </span>
              Estimativa de Custo
              <span className="ml-auto text-[10px] bg-[var(--color-brand)]/10 text-[var(--color-brand)] px-2 py-0.5 rounded font-bold">
                Automação a correr diariamente (12:00)
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 border rounded-xl flex flex-col justify-center ${recommendedMarket === "Continente" ? "border-[var(--color-brand)] bg-[#FAFCFB]" : "border-[var(--color-line)] bg-white"}`}
              >
                <div className="text-xs font-bold text-[var(--color-ink-soft)] mb-1">
                  Continente
                </div>
                <div
                  className={`font-display text-lg font-bold ${recommendedMarket === "Continente" ? "text-[var(--color-brand)]" : "text-[var(--color-ink)]"}`}
                >
                  {totalContinente.toFixed(2)}€
                </div>
                {recommendedMarket === "Continente" && (
                  <div className="text-[10px] text-[var(--color-brand)] font-bold mt-1.5 uppercase tracking-wide">
                    🏆 Mais Barato
                  </div>
                )}
              </div>
              <div
                className={`p-3 border rounded-xl flex flex-col justify-center ${recommendedMarket === "Auchan" ? "border-[var(--color-brand)] bg-[#FAFCFB]" : "border-[var(--color-line)] bg-white"}`}
              >
                <div className="text-xs font-bold text-[var(--color-ink-soft)] mb-1">
                  Auchan
                </div>
                <div
                  className={`font-display text-lg font-bold ${recommendedMarket === "Auchan" ? "text-[var(--color-brand)]" : "text-[var(--color-ink)]"}`}
                >
                  {totalAuchan.toFixed(2)}€
                </div>
                {recommendedMarket === "Auchan" && (
                  <div className="text-[10px] text-[var(--color-brand)] font-bold mt-1.5 uppercase tracking-wide">
                    🏆 Mais Barato
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-center text-[var(--color-ink-soft)] mt-3">
              Valores baseados em marcas brancas e médias. O preço real pode
              variar na loja.
            </p>
          </div>
        )}

        {AISLE_ORDER.flatMap((aisle, aisleIdx) => {
          const items = grouped[aisle];
          if (!items || items.length === 0) return [];

          const aisleIcons: Record<string, string> = {
            "Frutas e Legumes": "🥦",
            Talho: "🥩",
            Peixaria: "🐟",
            "Laticínios e Ovos": "🥛",
            "Alternativas Vegetais": "🌱",
            Mercearia: "🥫",
            Padaria: "🍞",
            Bebidas: "🥤",
          };

          const allBought = items.every((item) =>
            appState.boughtItems.includes(item.id),
          );

          return [
            ...(aisleIdx === 2
              ? [
                  <AdSlot
                    key={`ad-${aisleIdx}`}
                    type="rectangle"
                    className="mb-8"
                  />,
                ]
              : []),
            <div key={`${aisle}-${aisleIdx}`} className="scroll-mt-6">
              <div className="flex items-center mb-3 px-1 sticky top-16 bg-[var(--color-paper)]/90 backdrop-blur-md z-10 py-2">
                <span className="text-2xl mr-2">
                  {aisleIcons[aisle] || "🛒"}
                </span>
                <h3
                  className={`font-bold text-xl transition-colors ${allBought ? "text-[var(--color-ink-soft)]" : "text-[var(--color-brand)]"}`}
                >
                  {aisle}
                </h3>
                <span className="ml-auto text-xs font-bold bg-white border border-[var(--color-line)] px-2.5 py-1 rounded-full text-[var(--color-ink-soft)]">
                  {
                    items.filter((i) => appState.boughtItems.includes(i.id))
                      .length
                  }
                  /{items.length}
                </span>
              </div>
              <div className="bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden shadow-sm">
                {items.map((item, idx) => {
                  const isBought = appState.boughtItems.includes(item.id);
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className={`p-4 flex items-start gap-3 transition-colors ${idx !== items.length - 1 ? "border-b border-[var(--color-line)]" : ""} ${isBought ? "bg-[var(--color-paper)]/50" : ""}`}
                    >
                      <button
                        onClick={() => toggleBought(item.id)}
                        className="mt-0.5 text-[var(--color-brand)] flex-shrink-0"
                      >
                        {isBought ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <Circle
                            size={24}
                            className="text-[var(--color-line)]"
                          />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`flex justify-between items-start ${isBought ? "opacity-50 line-through" : ""}`}
                        >
                          <span className="font-medium pr-2 text-sm leading-tight">
                            {item.name}
                          </span>
                          <span className="font-bold whitespace-nowrap text-sm bg-[var(--color-sand)] px-2 py-0.5 rounded-md">
                            {item.totalQuantity} {item.unit}
                          </span>
                        </div>

                        {/* Aggregation Note */}
                        {item.recipeNames.length > 1 && !isBought && (
                          <div className="text-xs text-[var(--color-pumpkin)] mt-1.5 font-medium">
                            ↳ Junta {item.recipeNames.length} receitas
                          </div>
                        )}

                        {/* Supermarket Links */}
                        {!isBought &&
                          appState.selectedSupermarkets.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {appState.selectedSupermarkets
                                .filter((market) => SUPERMARKET_LINKS[market])
                                .map((market, marketIdx) => (
                                  <a
                                    key={`${market}-${marketIdx}`}
                                    href={getMarketLink(market, item.name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] uppercase font-bold tracking-wide text-[var(--color-ink-soft)] bg-[var(--color-paper)] px-2 py-1 rounded-md border border-[var(--color-line)] flex items-center hover:bg-[var(--color-sand)] transition-colors"
                                  >
                                    {market}{" "}
                                    <ExternalLink size={10} className="ml-1" />
                                  </a>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>,
          ];
        })}

        {appState.customShoppingItems &&
          appState.customShoppingItems.length > 0 && (
            <div className="scroll-mt-6">
              <div className="flex items-center mb-3 px-1 sticky top-16 bg-[var(--color-paper)]/90 backdrop-blur-md z-10 py-2">
                <span className="text-2xl mr-2">📌</span>
                <h3 className="font-bold text-xl transition-colors text-[var(--color-brand)]">
                  Outros
                </h3>
              </div>
              <div className="bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden shadow-sm shadow-[var(--color-line)]">
                <div className="divide-y divide-[var(--color-line)]">
                  {[...appState.customShoppingItems]
                    .sort((a, b) => a.localeCompare(b, "pt"))
                    .map((item, idxx) => {
                      const isBought = appState.boughtItems.includes(
                        `custom-${item}`,
                      );
                      return (
                        <div
                          key={`custom-${item}-${idxx}`}
                          onClick={() => toggleBought(`custom-${item}`)}
                          className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-gray-50/50 ${isBought ? "opacity-50 bg-gray-50/80" : ""}`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`font-semibold text-sm transition-all ${isBought ? "text-[var(--color-ink-soft)] line-through decoration-[var(--color-line)] decoration-2" : "text-[var(--color-ink)]"}`}
                            >
                              {item}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomItem(item);
                              }}
                              className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 rounded"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            </button>
                            <div
                              className={`transition-all ${isBought ? "text-[var(--color-brand)] scale-110" : "text-[var(--color-ink-soft)]/30 hover:text-[var(--color-brand)]/50"}`}
                            >
                              {isBought ? (
                                <CheckCircle2
                                  size={24}
                                  className="fill-[var(--color-brand)]/10"
                                />
                              ) : (
                                <Circle size={24} strokeWidth={2} />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

        <div className="bg-white border text-sm font-medium border-[var(--color-line)] rounded-2xl p-4 shadow-sm relative">
          <form onSubmit={addCustomItem} className="flex space-x-2">
            <input
              type="text"
              placeholder="Adicionar ingrediente extra..."
              value={customItemInput}
              onChange={(e) => {
                setCustomItemInput(e.target.value);
                setShowItemSuggestions(true);
              }}
              onFocus={() => setShowItemSuggestions(true)}
              className="flex-1 px-3 py-2 border border-[var(--color-line)] rounded-xl outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all bg-transparent"
            />
            <button
              type="submit"
              disabled={!customItemInput.trim()}
              className="px-4 py-2 bg-[var(--color-brand)] text-white rounded-xl font-bold disabled:opacity-50"
            >
              Adicionar
            </button>
          </form>

          {showItemSuggestions && customItemSuggestions.length > 0 && (
            <div className="absolute z-10 left-4 right-4 mt-2 bg-white border border-[var(--color-line)] rounded-xl shadow-lg overflow-hidden">
              {customItemSuggestions.map((item, idx) => (
                <button
                  key={`suggest-${item}-${idx}`}
                  type="button"
                  onClick={(e) => addCustomItem(e, item)}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--color-sand)] active:bg-[var(--color-line)] border-b last:border-b-0 border-[var(--color-line)] transition-colors flex items-center space-x-3"
                >
                  <Plus size={16} className="text-[var(--color-ink-soft)]" />
                  <span className="font-medium text-[var(--color-ink)]">
                    {item}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {excludedCount > 0 && (
          <div className="bg-[var(--color-sand)] rounded-2xl p-4 text-sm text-[var(--color-ink-soft)] font-medium">
            <span className="font-bold text-[var(--color-mustard)]">
              {excludedCount} itens
            </span>{" "}
            excluídos por estarem na despensa:
            <span className="block mt-1 font-normal opacity-75">
              {excludedNames.join(", ")}
            </span>
          </div>
        )}

        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-4 mt-6 mb-2 flex gap-3 shadow-sm">
          <div className="text-[var(--color-mustard)] mt-0.5">
            <Lightbulb size={20} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1">
              Dica de Poupança
            </h4>
            <p className="text-sm font-medium text-[var(--color-ink)] leading-snug">
              {randomTip}
            </p>
          </div>
        </div>

        <div className="mt-6 mb-4 text-center"></div>
      </div>

      {/* Room Modal */}
      <AnimatePresence>
        {showRoomModal && (
          <RoomSettingsModal
            appState={appState}
            updateState={updateState}
            onClose={() => setShowRoomModal(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Markets Modal */}
      <AnimatePresence>
        {showMarkets && (
          <MarketsModal
            appState={appState}
            updateState={updateState}
            onClose={() => setShowMarkets(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RoomSettingsModal({
  appState,
  updateState,
  onClose,
  showToast,
}: {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [roomIdInput, setRoomIdInput] = useState("");

  const generateRoomId = () => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    updateState({ sharedRoomId: newId });
    showToast(`Código ${newId} gerado! Podes partilhar com o teu parceiro(a).`);
  };

  const joinRoom = () => {
    if (roomIdInput.trim()) {
      updateState({ sharedRoomId: roomIdInput.trim().toUpperCase() });
      showToast(`Entraste na lista partilhada ${roomIdInput.toUpperCase()}`);
      onClose();
    }
  };

  const leaveRoom = () => {
    updateState({ sharedRoomId: null });
    showToast("Saíste da lista partilhada.");
    onClose();
  };

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
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold text-xl flex items-center">
            <Users className="mr-2" /> Partilha em Tempo Real
          </h3>
        </div>

        {appState.sharedRoomId ? (
          <div className="bg-white border border-[var(--color-brand)] border-2 rounded-2xl p-6 text-center mb-6">
            <p className="text-sm text-[var(--color-ink-soft)] mb-2">
              O teu código de partilha atual:
            </p>
            <div className="text-4xl font-mono font-bold tracking-widest text-[var(--color-brand)] mb-4">
              {appState.sharedRoomId}
            </div>
            <p className="text-xs text-[var(--color-ink-soft)] mb-6">
              Qualquer pessoa com este código pode ver e editar a tua lista,
              plano semanal e despensa em tempo real.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(appState.sharedRoomId!);
                  showToast("Código copiado!");
                }}
                className="flex-1 py-3 bg-[var(--color-paper)] text-[var(--color-ink)] font-bold rounded-xl border border-[var(--color-line)] flex justify-center items-center"
              >
                <Copy size={18} className="mr-2" /> Copiar
              </button>
              <button
                onClick={leaveRoom}
                className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 flex justify-center items-center"
              >
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5">
              <h4 className="font-bold mb-2">Criar nova partilha</h4>
              <p className="text-sm text-[var(--color-ink-soft)] mb-4">
                Gera um código que podes dar a outra pessoa para que ambos
                editem a lista.
              </p>
              <button
                onClick={generateRoomId}
                className="w-full py-3 bg-[var(--color-brand)] text-white font-bold rounded-xl"
              >
                Gerar Código
              </button>
            </div>

            <div className="relative text-center">
              <span className="bg-[var(--color-paper)] px-4 text-[var(--color-ink-soft)] text-sm font-medium relative z-10">
                OU
              </span>
              <div className="absolute top-1/2 left-0 right-0 border-t border-[var(--color-line)] -mt-px z-0"></div>
            </div>

            <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5">
              <h4 className="font-bold mb-2">Entrar numa partilha</h4>
              <p className="text-sm text-[var(--color-ink-soft)] mb-4">
                Insere o código que alguém partilhou contigo.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: ABC123"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none font-mono font-bold text-lg uppercase tracking-wider"
                  maxLength={6}
                />
                <button
                  onClick={joinRoom}
                  disabled={roomIdInput.length < 3}
                  className="px-6 bg-[var(--color-brand)] text-white font-bold rounded-xl disabled:opacity-50"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[var(--color-paper)] text-[var(--color-ink)] font-bold rounded-xl shadow-sm border border-[var(--color-line)]"
        >
          Fechar
        </button>
      </motion.div>
    </>
  );
}

function MarketsModal({
  appState,
  updateState,
  onClose,
}: {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onClose: () => void;
}) {
  const allMarkets: Supermarket[] = ["Continente", "Auchan"];

  const toggleMarket = (market: Supermarket) => {
    const current = appState.selectedSupermarkets;
    if (current.includes(market)) {
      updateState({
        selectedSupermarkets: current.filter((m: Supermarket) => m !== market),
      });
    } else {
      updateState({ selectedSupermarkets: [...current, market] });
    }
  };

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
        <h3 className="font-display font-bold text-xl mb-2">Supermercados</h3>
        <p className="text-sm text-[var(--color-ink-soft)] mb-6">
          Ativa atalhos de pesquisa direta para os supermercados que usas.
        </p>

        <div className="space-y-3 mb-6">
          {allMarkets.map((market, marketIdx) => {
            const isSelected = appState.selectedSupermarkets.includes(market);
            return (
              <button
                key={`${market}-${marketIdx}`}
                onClick={() => toggleMarket(market)}
                className={`w-full flex justify-between items-center py-3.5 px-4 rounded-xl font-medium text-sm transition-all border ${
                  isSelected
                    ? "bg-white border-[var(--color-brand)] text-[var(--color-ink)]"
                    : "bg-white border-[var(--color-line)] text-[var(--color-ink-soft)] opacity-70"
                }`}
              >
                {market}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[var(--color-brand)] bg-[var(--color-brand)]" : "border-[var(--color-line)]"}`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[var(--color-ink-soft)] mb-4 text-center">
          Nota: Os links abrem uma pesquisa no site do supermercado. A opção de
          adicionar diretamente ao carrinho não é suportada pelas API em
          Portugal.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[var(--color-brand)] text-white font-bold rounded-xl shadow-sm"
        >
          Concluído
        </button>
      </motion.div>
    </>
  );
}
