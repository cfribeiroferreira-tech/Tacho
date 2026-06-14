export const BASE_PRICES: Record<string, number> = {
  bacalhau: 11.5,
  "batata palha": 2.5,
  cebola: 0.2,
  natas: 0.9,
  azeite: 6.5,
  "carne picada": 7.0,
  esparguete: 1.2,
  "tomate pelado": 1.0,
  atum: 1.5,
  ovos: 0.2,
  frango: 4.5,
  arroz: 1.3,
  salmão: 18.0,
  batata: 1.5,
  alface: 1.2,
  tomate: 0.4,
  "grão de bico": 1.1,
  cenoura: 0.15,
  "alho francês": 0.8,
  curgete: 0.6,
  cogumelos: 2.5,
  massa: 1.2,
  pescada: 8.0,
  peru: 6.0,
  feijão: 1.0,
  leite: 0.9,
};

export function getEstimatedPrice(
  itemName: string,
  quantity: number,
  unit: string,
  supermarket: "Continente" | "Auchan",
): number {
  const normName = itemName.toLowerCase().trim();
  let basePrice = 2.0; // fallback base price

  for (const key of Object.keys(BASE_PRICES)) {
    if (normName.includes(key)) {
      basePrice = BASE_PRICES[key];
      break;
    }
  }

  let multiplier = 1;
  const u = unit.toLowerCase();

  if (u === "g" || u === "ml") {
    multiplier = quantity / 1000;
  } else if (u === "kg" || u === "l") {
    multiplier = quantity;
  } else if (
    u === "un" ||
    u === "unid" ||
    u === "unidade" ||
    u === "unidades"
  ) {
    multiplier = quantity;
  } else {
    // For spoonfuls, pinches, cloves etc. Use a small fraction
    multiplier = 0.05 * quantity;
  }

  // Add variation based on string length to simulate realistic differences between supermarkets
  const hash = itemName.length;
  let variation = 0;
  if (supermarket === "Continente") {
    // -6% to +6%
    variation = ((hash % 7) - 3) * 0.02;
  } else {
    // -6% to +6% with a different offset
    variation = ((hash % 5) - 2) * -0.03;
  }

  return Math.max(0.1, basePrice * multiplier * (1 + variation));
}
