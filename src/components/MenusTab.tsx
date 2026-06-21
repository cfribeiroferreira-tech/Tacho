import React, { useState } from "react";
import { AppState, CustomMenu } from "../types";
import {
  ChevronLeft,
  Plus,
  Trash2,
  ShoppingCart,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { recipes } from "../data/recipes";
import { AnimatePresence, motion } from "motion/react";
import { RecipeDetailModal } from "./RecipeDetailModal";

interface Props {
  appState: AppState;
  updateState: (
    updates: Partial<AppState> | ((prev: AppState) => Partial<AppState>),
  ) => void;
  showToast: (msg: string) => void;
  goToTab: (tab: any) => void;
}

export default function MenusTab({
  appState,
  updateState,
  showToast,
  goToTab,
}: Props) {
  const selectedMenuId = appState.activeCustomMenuId || null;
  const setSelectedMenuId = (id: string | null) =>
    updateState({ activeCustomMenuId: id });
  const menus = appState.customMenus || [];

  const favoritesMenu: CustomMenu = {
    id: "favorites",
    name: "Favoritos",
    recipeIds: appState.favorites || [],
  };

  const allMenus = [favoritesMenu, ...menus];
  const selectedMenu = selectedMenuId
    ? allMenus.find((m) => m.id === selectedMenuId)
    : null;

  const handleCreateMenu = () => {
    const newMenu: CustomMenu = {
      id: Math.random().toString(36).substring(7),
      name: `Menu Extra ${menus.length + 1}`,
      recipeIds: [],
    };
    updateState({ customMenus: [...menus, newMenu] });
    setSelectedMenuId(newMenu.id);
  };

  const handleDeleteMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateState({ customMenus: menus.filter((m) => m.id !== id) });
    if (selectedMenuId === id) {
      setSelectedMenuId(null);
    }
    showToast("Menu removido!");
  };

  return (
    <div className="pt-6 px-4 pb-24">
      <button
        onClick={() => goToTab("home")}
        className="flex items-center text-sm text-[var(--color-ink-soft)] font-medium mb-4 hover:text-[var(--color-ink)] transition-colors active:scale-95 group"
      >
        <div className="bg-white border border-[var(--color-line)] rounded-full p-1 mr-2 group-hover:bg-gray-50">
          <ChevronLeft size={16} />
        </div>
        Voltar ao Início
      </button>

      <h1 className="text-3xl font-display text-[var(--color-ink)] font-bold mb-6">
        Coleções
      </h1>

      {selectedMenuId && selectedMenu ? (
        <MenuEditor
          menu={selectedMenu}
          appState={appState}
          updateState={updateState}
          onClose={() => setSelectedMenuId(null)}
          goToTab={goToTab}
          showToast={showToast}
        />
      ) : (
        <>
          <p className="text-[var(--color-ink-soft)] text-sm mb-6">
            Cria menus personalizados para festas, jantares de amigos ou eventos
            e gera uma lista de compras para cada um.
          </p>

          <button
            onClick={handleCreateMenu}
            className="w-full flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-[var(--color-line)] text-[var(--color-ink-soft)] font-medium hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors mb-6"
          >
            <Plus size={20} className="mr-2" />
            Criar Nova Coleção
          </button>

          <div className="space-y-3">
            {allMenus.map((menu) => (
              <div
                key={menu.id}
                onClick={() => setSelectedMenuId(menu.id)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-line)] cursor-pointer hover:border-[var(--color-brand)] transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{menu.name}</h3>
                  {menu.id !== "favorites" && (
                    <button
                      onClick={(e) => handleDeleteMenu(menu.id, e)}
                      className="text-red-400 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] mb-3">
                  {menu.recipeIds.length} receitas
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateState({
                      activeListView: { type: "menu", menuId: menu.id },
                    });
                    goToTab("lista");
                  }}
                  disabled={menu.recipeIds.length === 0}
                  className="flex items-center text-sm font-medium text-[var(--color-brand)] disabled:opacity-50"
                >
                  <ShoppingCart size={16} className="mr-1" />
                  Lista de Compras
                </button>
              </div>
            ))}

            {allMenus.length === 0 && (
              <div className="text-center p-8 bg-[var(--color-sand)] rounded-2xl">
                <ShoppingBag
                  size={32}
                  className="mx-auto mb-3 text-[var(--color-ink-soft)]"
                />
                <p className="text-sm font-medium text-[var(--color-ink-soft)]">
                  Sem coleções.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MenuEditor({
  menu,
  appState,
  updateState,
  onClose,
  goToTab,
  showToast,
}: any) {
  const [showRecipeModal, setShowRecipeModal] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);

  const updateMenuName = (name: string) => {
    if (menu.id === "favorites") return;
    updateState((prev: AppState) => {
      const updatedMenus = (prev.customMenus || []).map((m: CustomMenu) =>
        m.id === menu.id ? { ...m, name } : m,
      );
      return { customMenus: updatedMenus };
    });
  };

  const removeRecipe = (recipeId: string) => {
    if (menu.id === "favorites") {
      updateState((prev: AppState) => ({
        favorites: (prev.favorites || []).filter((id) => id !== recipeId),
      }));
      return;
    }
    updateState((prev: AppState) => {
      const updatedMenus = (prev.customMenus || []).map((m: CustomMenu) =>
        m.id === menu.id
          ? { ...m, recipeIds: m.recipeIds.filter((id) => id !== recipeId) }
          : m,
      );
      return { customMenus: updatedMenus };
    });
  };

  const menuRecipes = menu.recipeIds
    .map((id: string) => recipes.find((r) => r.id === id))
    .filter(Boolean);

  const adultsCount =
    menu.id === "favorites"
      ? (appState.favoritesPortions?.adultsCount ?? appState.adultsCount ?? 2)
      : menu.adultsCount !== undefined
        ? menu.adultsCount
        : appState.adultsCount || 2;
  const children =
    menu.id === "favorites"
      ? (appState.favoritesPortions?.children ?? appState.children ?? [])
      : menu.children !== undefined
        ? menu.children
        : appState.children || [];

  const updateMenuAdults = (newCount: number) => {
    if (menu.id === "favorites") {
      updateState((prev: AppState) => ({
        favoritesPortions: {
          ...(prev.favoritesPortions || {}),
          adultsCount: newCount,
        },
      }));
      return;
    }
    updateState((prev: AppState) => {
      const updatedMenus = (prev.customMenus || []).map((m: CustomMenu) =>
        m.id === menu.id ? { ...m, adultsCount: newCount } : m,
      );
      return { customMenus: updatedMenus };
    });
  };

  const updateMenuChildren = (newChildren: { age: number }[]) => {
    if (menu.id === "favorites") {
      updateState((prev: AppState) => ({
        favoritesPortions: {
          ...(prev.favoritesPortions || {}),
          adultsCount: prev.favoritesPortions?.adultsCount ?? prev.adultsCount,
          children: newChildren,
        },
      }));
      return;
    }
    updateState((prev: AppState) => {
      const updatedMenus = (prev.customMenus || []).map((m: CustomMenu) =>
        m.id === menu.id ? { ...m, children: newChildren } : m,
      );
      return { customMenus: updatedMenus };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={onClose}
          className="p-2 border border-[var(--color-line)] bg-white shadow-sm rounded-full active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <input
          type="text"
          value={menu.name}
          readOnly={menu.id === "favorites"}
          onChange={(e) => updateMenuName(e.target.value)}
          onFocus={() => setIsEditingName(true)}
          onBlur={(e) => {
            setIsEditingName(false);
            if (e.target.value.trim() === "") {
              updateMenuName("Nova Lista");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.currentTarget.value.trim() === "") {
                updateMenuName("Nova Lista");
              }
              e.currentTarget.blur();
              showToast("Nome atualizado!");
            }
          }}
          className={`font-bold text-xl bg-transparent flex-1 border-b transition-colors outline-none w-full
            ${
              menu.id === "favorites"
                ? "border-transparent text-[var(--color-brand)] py-1"
                : "border-transparent py-1 hover:border-[var(--color-line)] focus:border-[var(--color-brand)]"
            }
          `}
        />
        {menu.id !== "favorites" && isEditingName && (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              if (input) input.blur();
              showToast("Nome atualizado!");
            }}
            className="px-3 py-1.5 bg-[var(--color-ink)] text-white text-sm font-medium rounded-lg shadow-sm active:scale-95 transition-transform shrink-0"
          >
            Guardar
          </button>
        )}
      </div>

      <div className="mb-6 flex">
        <div
          className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-[var(--color-line)] shadow-sm cursor-pointer shrink-0"
          onClick={() => setShowFamilyModal(true)}
        >
          <div className="flex items-center space-x-1 font-medium text-sm text-[var(--color-ink)]">
            <Users size={14} />
            <span>
              {adultsCount} Adultos, {children.length} Crianças
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-line)] p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Receitas na Coleção</h3>
          <button
            onClick={() => {
              // Add a generic flag to know we want to pick a recipe for THIS menu
              updateState({
                pendingRecipeSelection: {
                  type: "menu",
                  menuId: menu.id,
                },
              });
              goToTab("receitas");
            }}
            className="flex items-center text-sm bg-[var(--color-brand)] text-white px-3 py-1.5 rounded-lg font-medium active:scale-95"
          >
            <Plus size={14} className="mr-1" /> Add Receita
          </button>
        </div>

        {menuRecipes.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)] text-center py-4">
            Nenhuma receita. Adiciona receitas para gerar a lista.
          </p>
        ) : (
          <div className="space-y-2">
            {menuRecipes.map((r: any) => (
              <div
                key={r.id}
                onClick={() => setShowRecipeModal(r)}
                className="flex items-center justify-between p-3 border border-[var(--color-line)] rounded-xl cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{r.emoji}</span>
                  <span className="font-medium text-sm text-[var(--color-ink)]">
                    {r.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecipe(r.id);
                  }}
                  className="text-[var(--color-ink-soft)] hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFamilyModal && (
        <FamilyConfigModal
          adultsCount={adultsCount}
          childrenList={children}
          onAdultsChange={updateMenuAdults}
          onChildrenChange={updateMenuChildren}
          onClose={() => setShowFamilyModal(false)}
        />
      )}

      {showRecipeModal && (
        <RecipeDetailModal
          recipe={showRecipeModal}
          onClose={() => setShowRecipeModal(null)}
          appState={appState}
          updateState={updateState}
          showToast={showToast}
          goToTab={goToTab}
        />
      )}
    </div>
  );
}

function FamilyConfigModal({
  adultsCount,
  childrenList,
  onAdultsChange,
  onChildrenChange,
  onClose,
}: any) {
  const [localAdults, setLocalAdults] = useState(adultsCount || 2);
  const [localChildren, setLocalChildren] = useState<{ age: number }[]>(
    childrenList || [],
  );

  const save = () => {
    onAdultsChange(localAdults);
    onChildrenChange(localChildren);
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
            onClick={save}
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
                onClick={() => setLocalAdults(Math.max(1, localAdults - 1))}
                className="text-[var(--color-ink-soft)] font-medium text-lg"
              >
                -
              </button>
              <span className="font-bold w-4 text-center">{localAdults}</span>
              <button
                onClick={() => setLocalAdults(localAdults + 1)}
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
                onClick={() => setLocalChildren([...localChildren, { age: 5 }])}
                className="bg-[var(--color-paper)] border border-[var(--color-line)] px-3 py-1.5 rounded-lg text-sm font-bold text-[var(--color-ink)] flex items-center"
              >
                + Adicionar Criança
              </button>
            </div>

            <div className="space-y-3">
              {localChildren.map((child, idx) => (
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
                        const newChildren = [...localChildren];
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = 0;
                        newChildren[idx] = {
                          age: val,
                        };
                        setLocalChildren(newChildren);
                      }}
                      className="w-16 border border-[var(--color-line)] rounded-lg p-1.5 text-center font-bold"
                    />
                    <button
                      onClick={() => {
                        const newChildren = [...localChildren];
                        newChildren.splice(idx, 1);
                        setLocalChildren(newChildren);
                      }}
                      className="text-red-400 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {localChildren.length === 0 && (
                <p className="text-sm text-[var(--color-ink-soft)] italic">
                  Sem crianças configuradas.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={save}
            className="w-full bg-[var(--color-brand)] text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
          >
            Guardar Configuração
          </button>
        </div>
      </div>
    </div>
  );
}
