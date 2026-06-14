import { useState, useMemo } from "react";
import {
  AppState,
  AISLE_ORDER,
  Supermarket,
  SUPERMARKET_LINKS,
} from "../types";
import { generateShoppingList } from "../utils/engine";
import { getEstimatedPrice } from "../utils/pricing";
import {
  Copy,
  ExternalLink,
  Settings,
  CheckCircle2,
  Circle,
  Lightbulb,
  Share2,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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

export default function ListaTab({ appState, updateState, showToast }: Props) {
  const [showMarkets, setShowMarkets] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [randomTip] = useState(
    () => TIPS[Math.floor(Math.random() * TIPS.length)],
  );

  // Memoize so it doesn't recalculate unless plan/people/pantry changes
  const { grouped, excludedCount, excludedNames } = useMemo(() => {
    return generateShoppingList(
      appState.weekPlan,
      appState.peopleCount,
      appState.pantry,
    );
  }, [appState.weekPlan, appState.peopleCount, appState.pantry]);

  const toggleBought = (id: string) => {
    const current = appState.boughtItems;
    if (current.includes(id)) {
      updateState({ boughtItems: current.filter((i) => i !== id) });
    } else {
      updateState({ boughtItems: [...current, id] });
    }
  };

  const hasItems = Object.values(grouped).some((arr: any) => arr.length > 0);

  const { totalContinente, totalAuchan, recommendedMarket } = useMemo(() => {
    let continente = 0;
    let auchan = 0;

    Object.values(grouped).forEach((items: any) => {
      items.forEach((item: any) => {
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
    let text = `Lista de Compras (${appState.peopleCount} pessoas)\n\n`;

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

  const getMarketLink = (market: Supermarket, query: string) => {
    const template = SUPERMARKET_LINKS[market];
    return template
      ? template.replace("{query}", encodeURIComponent(query))
      : "#";
  };

  return (
    <div className="pt-6 px-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="flex items-center text-3xl font-display text-[var(--color-ink)] font-bold mb-1">
            Lista
            {appState.sharedRoomId && (
              <span className="ml-3 inline-flex items-center text-[10px] bg-[var(--color-brand)]/10 text-[var(--color-brand)] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold h-6 align-middle">
                <Users size={12} className="mr-1" /> Sincronizada
              </span>
            )}
          </h1>
          <p className="text-[var(--color-ink-soft)] text-sm">
            {appState.peopleCount}{" "}
            {appState.peopleCount === 1 ? "pessoa" : "pessoas"}
          </p>
        </div>
        <div className="flex space-x-2">
          {hasItems && (
            <button
              onClick={handleShareText}
              className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink)]"
            >
              <Share2 size={20} />
            </button>
          )}
          <button
            onClick={() => setShowRoomModal(true)}
            className={`p-2.5 bg-white border ${appState.sharedRoomId ? "border-[var(--color-brand)] text-[var(--color-brand)] bg-[#E6EEE8]" : "border-[var(--color-line)] text-[var(--color-ink)]"} rounded-xl`}
          >
            <Users size={20} />
          </button>
          <button
            onClick={() => setShowMarkets(true)}
            className="p-2.5 bg-white border border-[var(--color-line)] rounded-xl text-[var(--color-ink)]"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {!hasItems ? (
        <div className="text-center py-20 px-6 bg-white rounded-3xl border border-[var(--color-line)]">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="font-display font-bold text-xl mb-2">Lista vazia</h3>
          <p className="text-[var(--color-ink-soft)] text-sm mb-6">
            Adiciona receitas ao plano da semana para gerar uma lista de
            compras.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Price Estimator MVP */}
          {(totalContinente > 0 || totalAuchan > 0) && (
            <div className="bg-white border border-[var(--color-line)] rounded-2xl p-4 shadow-sm overflow-hidden mb-8">
              <h4 className="font-bold text-[var(--color-ink)] mb-3 text-sm flex items-center">
                <span className="bg-[#E6EEE8] text-[var(--color-brand)] p-1.5 rounded-lg mr-2">
                  💰
                </span>
                Estimativa de Custo
                <span className="ml-auto text-[10px] bg-[var(--color-sand)] px-2 py-0.5 rounded text-[var(--color-ink-soft)] font-medium">
                  MVP
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

          {AISLE_ORDER.map((aisle) => {
            const items = grouped[aisle];
            if (!items || items.length === 0) return null;

            const aisleIcons: Record<string, string> = {
              "Frutas e Legumes": "🥦",
              Talho: "🥩",
              Peixaria: "🐟",
              "Laticínios e Ovos": "🥛",
              Mercearia: "🥫",
              Congelados: "🧊",
            };

            const allBought = items.every((item) =>
              appState.boughtItems.includes(item.id),
            );

            return (
              <div key={aisle} className="scroll-mt-6">
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
                        key={item.id}
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
                                  .map((market) => (
                                    <a
                                      key={market}
                                      href={getMarketLink(market, item.name)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] uppercase font-bold tracking-wide text-[var(--color-ink-soft)] bg-[var(--color-paper)] px-2 py-1 rounded-md border border-[var(--color-line)] flex items-center hover:bg-[var(--color-sand)] transition-colors"
                                    >
                                      {market}{" "}
                                      <ExternalLink
                                        size={10}
                                        className="ml-1"
                                      />
                                    </a>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

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

          <div className="mt-6 mb-4 text-center">
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
        </div>
      )}

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

function RoomSettingsModal({ appState, updateState, onClose, showToast }: any) {
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

function MarketsModal({ appState, updateState, onClose }: any) {
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
          {allMarkets.map((market) => {
            const isSelected = appState.selectedSupermarkets.includes(market);
            return (
              <button
                key={market}
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
