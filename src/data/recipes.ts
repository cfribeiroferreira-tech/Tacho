import { Recipe } from "../types";
import { recipesP1 } from "./r1";
import { recipesP2 } from "./r2";
import { recipesP3 } from "./r3";
import { recipesP4 } from "./r4";
import { recipesP5 } from "./r5";
import { recipesP6 } from "./r6";
import { recipesP7 } from "./r7";
import { recipesP8 } from "./r8";
import { recipesP9 } from "./r9";
import { recipesP10 } from "./r10";

const allRecipes: Recipe[] = [
  ...recipesP1,
  ...recipesP2,
  ...recipesP3,
  ...recipesP4,
  ...recipesP5,
  ...recipesP6,
  ...recipesP7,
  ...recipesP8,
  ...recipesP9,
  ...recipesP10,
];

const KIDS_TAG_KEYWORDS = ["massa", "hambúrguer", "frango", "esparguete", "pizza", "puré", "macarrão", "salsicha", "crepe", "panqueca", "bifes", "almondegas"];

allRecipes.forEach((r) => {
  const nameLower = r.name.toLowerCase();
  if (KIDS_TAG_KEYWORDS.some(k => nameLower.includes(k))) {
    if (!r.tags.includes("Kids")) {
      r.tags.push("Kids");
    }
  }

  if (!r.instructions || r.instructions.length === 0) {
    const names = r.ingredients.map((i) => i.name.toLowerCase());
    const mainVars = names.slice(0, Math.min(3, names.length)).join(", ");

    let isOven =
      r.name.toLowerCase().includes("forno") ||
      r.name.toLowerCase().includes("assado") ||
      r.name.toLowerCase().includes("pizza") ||
      r.name.toLowerCase().includes("lasanha") ||
      r.name.toLowerCase().includes("empadão");
    let isSoup = r.tags.includes("Sopa");
    let isSalad =
      r.name.toLowerCase().includes("salada") ||
      (r.tags.includes("Leve") && r.emoji === "🥗");
    let isGrilled =
      r.name.toLowerCase().includes("grelhado") ||
      r.name.toLowerCase().includes("grelhados") ||
      r.name.toLowerCase().includes("grelhada") ||
      r.name.toLowerCase().includes("brasa");
    let isBoiled =
      r.name.toLowerCase().includes("cozido") ||
      r.name.toLowerCase().includes("cozida") ||
      r.name.toLowerCase().includes("cozidos") ||
      r.name.toLowerCase().includes("vapor");

    if (isSalad) {
      r.instructions = [
        `Prepara os ingredientes frescos: lava e corta ${mainVars}.`,
        `Numa taça grande ou saladeira, junta todos os ingredientes da receita.`,
        `Prepara um tempero a gosto usando azeite, vinagre ou sumo de limão, sal e pimenta.`,
        `Envolve tudo muito bem para que os sabores se misturem e serve de imediato.`,
      ];
    } else if (isSoup) {
      r.instructions = [
        `Descasca, lava e corta todos os legumes: ${mainVars}.`,
        `Numa panela, faz um refogado rápido com um fio de azeite (opcional) ou coloca logo os legumes a cozer cobertos de água.`,
        `Tempera com um pouco de sal e deixa cozer durante cerca de ${r.time - 5} minutos.`,
        `Tritura tudo muito bem com a varinha mágica até obteres um creme aveludado.`,
        `Acrescenta os ingredientes finais (se houver) e ferve mais 2 minutos antes de servir.`,
      ];
    } else if (isOven) {
      r.instructions = [
        `Pré-aquece o forno a 180ºC - 200ºC.`,
        `Prepara os ingredientes principais (${mainVars}) e dispõe num tabuleiro de ir ao forno.`,
        `Tempera tudo generosamente a gosto com sal, pimenta, azeite e/ou outras especiarias da tua preferência.`,
        `Leva a assar no forno pré-aquecido durante a maior parte dos ${r.time} minutos de receita.`,
        `Verifica a cozedura, retira do forno quando estiver com um aspeto dourado e apetitoso e serve!`,
      ];
    } else if (isGrilled) {
      r.instructions = [
        `Aquece a grelha, grelhador ou chapa e pincela levemente com azeite se necessário.`,
        `Tempera os ingredientes principais (${mainVars}) com um pouco de sal, alho ou limão.`,
        `Grelha de ambos os lados até ficarem com marca de grelha e cozinhados por dentro.`,
        `Prepara os acompanhamentos adicionais em simultâneo.`,
        `Serve quente, finalizando com um fio de azeite e ervas frescas a gosto.`,
      ];
    } else if (isBoiled) {
      r.instructions = [
        `Lava e prepara os ingredientes: ${names.join(", ")}.`,
        `Leva uma panela generosa com água e sal ao lume.`,
        `Quando ferver, introduz os ingredientes principais e deixa cozer (o tempo total da receita é ~${r.time}m).`,
        `Verifica a cozedura dos elementos mais rijos com a ponta de um garfo.`,
        `Escorre bem a água de cozedura e serve, temperando com um fio de azeite e vinagre a gosto.`,
      ];
    } else {
      r.instructions = [
        `Prepara todos os ingredientes base: ${names.join(", ")}.`,
        `Aquece um fio de azeite num tacho ou frigideira (consoante a receita).`,
        `Se a receita contiver cebola ou alho, começa por fazer um ligeiro refogado.`,
        `Adiciona os ingredientes principais e deixa cozinhar, mexendo ocasionalmente.`,
        `Junta os restantes elementos e tempera a gosto (sal, pimenta, ervas).`,
        `Deixa apurar e cozinhar durante os ${r.time} minutos previstos até ficar no ponto.`,
        `Retira do lume e serve bem quente. Bom apetite!`,
      ];
    }
  }
});

export const recipes: Recipe[] = allRecipes;
