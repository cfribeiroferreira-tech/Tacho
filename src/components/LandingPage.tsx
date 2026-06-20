import React from 'react';
import { motion } from 'motion/react';
import { Book, Calendar, Refrigerator, ShoppingCart, ArrowRight } from 'lucide-react';
import { Tab } from '../types';

interface LandingPageProps {
  goToTab: (tab: Tab) => void;
}

export default function LandingPage({ goToTab }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-orange-500/30">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-900/40 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1920&q=80"
          alt="Kitchen/Food background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-12 lg:px-12 xl:px-24">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mt-8 mb-16 md:mt-24"
        >
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="font-black text-2xl text-white">T</span>
            </div>
            <h2 className="text-2xl font-black tracking-widest text-orange-400 uppercase">Tacho</h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-3xl leading-[1.15]">
            O teu assistente <br/><span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-200 drop-shadow-sm">na cozinha.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light mb-10 leading-relaxed md:leading-relaxed">
            Simplifica o teu dia a dia. Gere a despensa, cria o menu da semana sem esforço,
            descobre novas receitas e mantém a tua lista de compras sempre atualizada.
          </p>

          <button 
            onClick={() => goToTab('semana')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange-500 text-white font-semibold rounded-full overflow-hidden transition-transform active:scale-95 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-xl shadow-orange-500/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Começar a Planear <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          <motion.div 
            variants={itemVariants}
            onClick={() => goToTab('receitas')}
            className="group cursor-pointer bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 p-6 rounded-2xl transition-all duration-300 flex items-center gap-6"
          >
            <div className="shrink-0 w-14 h-14 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/30 transition-all">
              <Book className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white mb-1">Receitas</h3>
              <p className="text-sm text-gray-400 leading-snug">Descobre novas ideias</p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            onClick={() => goToTab('semana')}
            className="group cursor-pointer bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 p-6 rounded-2xl transition-all duration-300 flex items-center gap-6"
          >
            <div className="shrink-0 w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/30 transition-all">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white mb-1">Menu Semanal</h3>
              <p className="text-sm text-gray-400 leading-snug">Organiza as tuas refeições</p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            onClick={() => goToTab('despensa')}
            className="group cursor-pointer bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 p-6 rounded-2xl transition-all duration-300 flex items-center gap-6"
          >
            <div className="shrink-0 w-14 h-14 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500/30 transition-all">
              <Refrigerator className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white mb-1">A Minha Despensa</h3>
              <p className="text-sm text-gray-400 leading-snug">Gere o teu inventário</p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            onClick={() => goToTab('lista')}
            className="group cursor-pointer bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 p-6 rounded-2xl transition-all duration-300 flex items-center gap-6"
          >
            <div className="shrink-0 w-14 h-14 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/30 transition-all">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white mb-1">Lista de Compras</h3>
              <p className="text-sm text-gray-400 leading-snug">O que falta comprar</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
