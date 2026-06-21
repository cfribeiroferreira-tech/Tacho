import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Book,
  Calendar,
  Refrigerator,
  ShoppingCart,
  Layers,
  Users,
  Copy,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Tab, AppState } from "../types";

interface LandingPageProps {
  goToTab: (tab: Tab) => void;
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
  showToast: (msg: string) => void;
}

export default function LandingPage({
  goToTab,
  appState,
  updateState,
  showToast,
}: LandingPageProps) {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const generateRoomId = () => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    updateState({ sharedRoomId: newId });
    showToast(`Código ${newId} gerado!`);
  };

  const joinRoom = () => {
    if (roomIdInput.trim()) {
      updateState({ sharedRoomId: roomIdInput.trim().toUpperCase() });
      showToast(`A sincronizar...`);
    }
  };

  const leaveRoom = () => {
    updateState({ sharedRoomId: null });
    showToast("Saíste da partilha.");
  };

  const copyCode = () => {
    if (appState.sharedRoomId) {
      navigator.clipboard.writeText(appState.sharedRoomId);
      setIsCopied(true);
      showToast("Código copiado!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const navItems = [
    {
      id: "receitas" as Tab,
      icon: Book,
      label: "Receitas",
      desc: "Descobre novas ideias",
      color: "text-[var(--color-pumpkin)]",
      bg: "bg-[var(--color-pumpkin)]/20",
    },
    {
      id: "semana" as Tab,
      icon: Calendar,
      label: "Semana",
      desc: "Organiza as tuas refeições",
      color: "text-blue-500",
      bg: "bg-blue-500/20",
    },
    {
      id: "menus" as Tab,
      icon: Layers,
      label: "Coleções",
      desc: "Ementas personalizadas",
      color: "text-rose-500",
      bg: "bg-rose-500/20",
    },
    {
      id: "despensa" as Tab,
      icon: Refrigerator,
      label: "Despensa",
      desc: "Gere o teu inventário",
      color: "text-[var(--color-brand)]",
      bg: "bg-[var(--color-brand)]/20",
    },
    {
      id: "lista" as Tab,
      icon: ShoppingCart,
      label: "Lista de Compras",
      desc: "O que falta comprar",
      color: "text-[var(--color-mustard)]",
      bg: "bg-[var(--color-mustard)]/20",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-paper)] text-[var(--color-ink)] pb-24">
      {/* Content */}
      <div className="relative z-10 flex flex-col px-6 py-12 lg:px-12 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-8 mb-12 md:mt-24"
        >
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-pumpkin)] flex items-center justify-center shadow-lg shadow-[var(--color-pumpkin)]/20">
              <span className="font-black text-2xl text-white">T</span>
            </div>
            <h2 className="text-2xl font-black tracking-widest text-[var(--color-pumpkin)] uppercase">
              Tacho
            </h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight mb-6 max-w-3xl leading-[1.15]">
            O teu assistente <br />
            <span className="text-[var(--color-pumpkin)] drop-shadow-sm">
              na cozinha.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-ink-soft)] max-w-2xl font-light mb-10 leading-relaxed md:leading-relaxed">
            Simplifica o teu dia a dia. Gere a despensa, cria o menu da semana
            sem esforço, descobre novas receitas e mantém a tua lista de compras
            sempre atualizada.
          </p>

          <button
            onClick={() => goToTab("semana")}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-ink)] text-white font-semibold rounded-full overflow-hidden transition-transform active:scale-95 hover:bg-black focus:outline-none shadow-xl shadow-black/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              Começar a Planear{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-auto pb-8"
        >
          {/* Quick Links Grid */}
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              onClick={() => goToTab(item.id)}
              className="group cursor-pointer bg-white border border-[var(--color-line)] p-6 rounded-3xl transition-all duration-300 flex items-center gap-6 shadow-sm hover:shadow-md"
            >
              <div
                className={`shrink-0 w-14 h-14 rounded-full ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <item.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-[var(--color-ink)] mb-1">
                  {item.label}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-snug">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sync / Share Section */}
        <motion.div
          variants={itemVariants}
          className="mt-4 bg-white border border-[var(--color-line)] p-6 rounded-3xl text-left shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-[var(--color-ink)]">
                Partilha em Família
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] mt-1">
                Sincroniza compras e menus em tempo real.
              </p>
            </div>
          </div>

          {appState.sharedRoomId ? (
            <div className="bg-[var(--color-paper)] rounded-2xl p-6 border border-[var(--color-line)] text-center mt-4">
              <p className="text-sm text-[var(--color-ink-soft)] mb-3">
                A tua conta está sincronizada. Código de partilha:
              </p>
              <div className="text-4xl font-mono tracking-widest font-black text-[var(--color-brand)] mb-6">
                {appState.sharedRoomId}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyCode}
                  className="flex-1 py-3 bg-[var(--color-ink)] font-semibold text-white rounded-xl flex items-center justify-center text-sm transition-colors active:scale-95"
                >
                  {isCopied ? (
                    <CheckCircle2 size={18} className="mr-2 text-green-400" />
                  ) : (
                    <Copy size={18} className="mr-2" />
                  )}
                  {isCopied ? "Copiado" : "Copiar"}
                </button>
                <button
                  onClick={leaveRoom}
                  className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition-colors active:scale-95"
                >
                  Desconectar
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-[var(--color-ink-soft)] mb-5 leading-relaxed">
                Podes partilhar um código com outra pessoa. Ambos verão o mesmo
                plano semanal e despensa. As alterações num telemóvel vão surgir
                no outro instantaneamente!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={generateRoomId}
                  className="flex-1 bg-[var(--color-ink)] text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 text-sm"
                >
                  Criar Partilha
                </button>
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Inserir código..."
                    value={roomIdInput}
                    onChange={(e) =>
                      setRoomIdInput(e.target.value.toUpperCase())
                    }
                    className="w-full bg-white border border-[var(--color-line)] rounded-xl px-4 py-3 text-[var(--color-ink)] font-mono font-bold tracking-wider placeholder:tracking-normal placeholder:font-sans placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] uppercase"
                    maxLength={6}
                  />
                  {roomIdInput.length === 6 && (
                    <button
                      onClick={joinRoom}
                      className="absolute right-2 text-white font-bold text-sm bg-[var(--color-brand)] px-4 py-1.5 rounded-lg active:scale-95 transition-transform"
                    >
                      Entrar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
