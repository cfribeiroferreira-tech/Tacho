import React, { useState } from "react";
import {
  Book,
  Calendar,
  Refrigerator,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Tab } from "./types";
import ReceitasTab from "./components/ReceitasTab";
import SemanaTab from "./components/SemanaTab";
import DespensaTab from "./components/DespensaTab";
import ListaTab from "./components/ListaTab";
import { useStore } from "./utils/useStore";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("semana");
  const [state, updateState] = useStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showMvpSupport, setShowMvpSupport] = useState(false);
  const [email, setEmail] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast(
        "Obrigado! Ficarás a saber quando lançarmos a versão completa.",
      );
      setShowMvpSupport(false);
      setEmail("");
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "receitas":
        return (
          <ReceitasTab
            appState={state}
            updateState={updateState}
            showToast={showToast}
            goToTab={setActiveTab}
          />
        );
      case "semana":
        return (
          <SemanaTab
            appState={state}
            updateState={updateState}
            showToast={showToast}
            goToTab={setActiveTab}
          />
        );
      case "despensa":
        return (
          <DespensaTab
            appState={state}
            updateState={updateState}
            showToast={showToast}
            goToTab={setActiveTab}
          />
        );
      case "lista":
        return (
          <ListaTab
            appState={state}
            updateState={updateState}
            showToast={showToast}
          />
        );
    }
  };

  const navItems = [
    { id: "receitas" as Tab, icon: Book, label: "Receitas" },
    { id: "semana" as Tab, icon: Calendar, label: "Semana" },
    { id: "despensa" as Tab, icon: Refrigerator, label: "Despensa" },
    { id: "lista" as Tab, icon: ShoppingCart, label: "Lista" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-lg mx-auto bg-[var(--color-paper)] relative">
      <main className="flex-1 w-full bg-[var(--color-paper)]">
        {renderTab()}
      </main>

      {/* Floating MVP Support Button */}
      <button
        onClick={() => setShowMvpSupport(true)}
        className="fixed bottom-20 right-4 z-30 bg-[#2E5E4E] text-white p-3 rounded-full shadow-lg flex items-center justify-center animate-bounce hover:bg-[#1E4336] transition-colors"
      >
        <Heart size={24} />
      </button>

      {/* MVP Feedback / Subscribe Modal */}
      <AnimatePresence>
        {showMvpSupport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[60]"
              onClick={() => setShowMvpSupport(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[var(--color-paper)] rounded-t-3xl z-[70] p-6 pb-safe w-full max-w-lg mx-auto shadow-2xl"
            >
              <h3 className="font-display font-bold text-2xl mb-2 text-[var(--color-ink)]">
                Gostas do que vês?
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] mb-6 leading-relaxed">
                Esta é uma versão (MVP) para testarmos se esta aplicação te
                ajuda realmente a poupar tempo e dinheiro nas compras e a
                organizar a semana!
                <br />
                <br />
                Para termos uma versão 100% final e completa com passos
                detalhados e centenas de receitas, deixa cá o teu e-mail para
                receberes a novidade no dia de lançamento:
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="O teu endereço de email..."
                  required
                  className="w-full bg-white border border-[var(--color-line)] rounded-xl px-4 py-3 text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--color-brand)] text-white font-bold rounded-xl active:bg-[#1A382E] transition-colors"
                >
                  Quero acesso à versão final
                </button>
                <button
                  type="button"
                  onClick={() => setShowMvpSupport(false)}
                  className="w-full py-3 bg-transparent text-[var(--color-ink-soft)] font-medium rounded-xl pt-2 pb-0"
                >
                  Agora não
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 w-full max-w-lg mx-auto bg-white border-t border-[var(--color-line)] pb-safe z-40">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            let badgeCount = 0;
            if (item.id === "semana") {
              badgeCount = state.weekPlan.reduce(
                (acc, max) => acc + (max.almoco ? 1 : 0) + (max.jantar ? 1 : 0),
                0,
              );
            } else if (item.id === "despensa") {
              badgeCount = state.pantry.length;
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-[var(--color-brand)]" : "text-[var(--color-ink-soft)]"}`}
              >
                <div className="relative">
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-[var(--color-pumpkin)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-[var(--color-ink)] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg px-6 py-3 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4">
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
}
