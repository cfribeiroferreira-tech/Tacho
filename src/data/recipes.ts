import { Recipe } from "../types";
import { recipesP1 } from "./r1";
import { recipesP2 } from "./r2";
import { recipesP3 } from "./r3";
import { recipesP4 } from "./r4";
import { recipesP5 } from "./r5";
import { recipesP6 } from "./r6";
import { recipesP7 } from "./r7";

const allRecipes: Recipe[] = [
  ...recipesP1,
  ...recipesP2,
  ...recipesP3,
  ...recipesP4,
  ...recipesP5,
  ...recipesP6,
  ...recipesP7,
];

allRecipes.forEach((r) => {
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
