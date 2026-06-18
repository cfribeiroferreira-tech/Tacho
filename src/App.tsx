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
import { AdSlot } from "./components/AdSlot";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("semana");
  const [state, updateState] = useStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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
    <div className="flex flex-col min-h-[100dvh] max-w-lg mx-auto bg-[var(--color-paper)] relative pb-16">
      <main className="flex-1 w-full bg-[var(--color-paper)] flex flex-col">
        <div className="flex-1 w-full relative">
          {renderTab()}
        </div>
        <div className="px-4 sticky bottom-0 z-30 pb-2 pt-2 bg-gradient-to-t from-[var(--color-paper)] to-transparent pointer-events-none flex justify-center">
          <div className="pointer-events-auto w-[320px] max-w-full">
            <AdSlot type="banner" className="shadow-sm m-0" />
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full max-w-lg mx-auto bg-white border-t border-[var(--color-line)] pb-safe z-40">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item, idx) => {
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
                key={`${item.id}-${idx}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors rounded-xl mx-1 my-1 px-1 ${isActive ? "text-[var(--color-ink)] bg-black/5" : "text-[var(--color-ink-soft)]"}`}
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
