import { Recipe } from "../types";

export const recipesP8: Recipe[] = [
  {
    id: "r124",
    name: "Frango Rápido no Forno com Especiarias",
    emoji: "🍗",
    time: 30,
    baseServings: 4,
    kcalPerServing: 450,
    tags: ["Carne", "Familiar", "Rápido"],
    ingredients: [
      { name: "Frango", quantity: 600, unit: "g", section: "Talho" },
      { name: "Especiarias para frango", quantity: 2, unit: "c. sopa", section: "Mercearia" },
      { name: "Azeite", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Temperar o frango com especiarias e azeite.", "Assar no forno a 200ºC por 25 minutos.", "Servir quente."]
  },
  {
    id: "r125",
    name: "Massa de Atum Rápida",
    emoji: "🍝",
    time: 15,
    baseServings: 2,
    kcalPerServing: 350,
    tags: ["Peixe", "Rápido", "Económico"],
    ingredients: [
      { name: "Massa", quantity: 250, unit: "g", section: "Mercearia" },
      { name: "Lata de atum", quantity: 2, unit: "un", section: "Mercearia" },
      { name: "Polpa de tomate", quantity: 200, unit: "ml", section: "Mercearia" }
    ],
    instructions: ["Cozer massa num tacho.", "Misturar o atum e a polpa de tomate em lume brando.", "Juntar tudo e servir."]
  },
  {
    id: "r126",
    name: "Sopa de Ervilhas e Hortelã",
    emoji: "🥣",
    time: 20,
    baseServings: 4,
    kcalPerServing: 180,
    tags: ["Vegetariano", "Leve", "Rápido"],
    ingredients: [
      { name: "Ervilhas", quantity: 400, unit: "g", section: "Frutas e Legumes" },
      { name: "Hortelã", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Caldo de legumes", quantity: 1, unit: "L", section: "Mercearia" }
    ],
    instructions: ["Cozer as ervilhas no caldo.", "Juntar a hortelã.", "Triturar tudo muito bem em puré."]
  },
  {
    id: "r127",
    name: "Salada de Grão de Bico e Tomate",
    emoji: "🥗",
    time: 10,
    baseServings: 2,
    kcalPerServing: 250,
    tags: ["Vegan", "Leve", "Rápido", "Económico"],
    ingredients: [
      { name: "Grão de bico cozido", quantity: 400, unit: "g", section: "Mercearia" },
      { name: "Tomate", quantity: 2, unit: "un", section: "Frutas e Legumes" },
      { name: "Cebola", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Picar a cebola e o tomate.", "Misturar com o grão escorrido.", "Temperar a gosto e servir fresco."]
  },
  {
    id: "r128",
    name: "Arroz de Salsichas",
    emoji: "🌭",
    time: 25,
    baseServings: 4,
    kcalPerServing: 420,
    tags: ["Carne", "Familiar", "Económico", "Rápido"],
    ingredients: [
      { name: "Arroz", quantity: 200, unit: "g", section: "Mercearia" },
      { name: "Salsichas", quantity: 1, unit: "lata", section: "Mercearia" },
      { name: "Cebola", quantity: 0.5, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Refogar a cebola.", "Juntar o arroz e as salsichas cortadas.", "Adicionar água e deixar cozer."]
  },
  {
    id: "r129",
    name: "Pescada Cozida com Legumes",
    emoji: "🐟",
    time: 20,
    baseServings: 4,
    kcalPerServing: 290,
    tags: ["Peixe", "Leve", "Familiar"],
    ingredients: [
      { name: "Medalhões de pescada", quantity: 4, unit: "un", section: "Peixaria" },
      { name: "Batata", quantity: 4, unit: "un", section: "Frutas e Legumes" },
      { name: "Brócolos", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Cozer tudo em água com sal.", "Escorrer os legumes e o peixe.", "Regar com azeite e vinagre a gosto."]
  },
  {
    id: "r130",
    name: "Omelete de Cogumelos e Queijo",
    emoji: "🍳",
    time: 10,
    baseServings: 2,
    kcalPerServing: 310,
    tags: ["Vegetariano", "Rápido", "Leve"],
    ingredients: [
      { name: "Ovos", quantity: 4, unit: "un", section: "Laticínios e Ovos" },
      { name: "Cogumelos", quantity: 100, unit: "g", section: "Frutas e Legumes" },
      { name: "Queijo ralado", quantity: 50, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Bater os ovos e saltear os cogumelos.", "Fazer a omelete na frigideira.", "Adicionar o queijo antes de dobrar."]
  },
  {
    id: "r131",
    name: "Tofu Salteado com Brocolos",
    emoji: "🥦",
    time: 25,
    baseServings: 2,
    kcalPerServing: 260,
    tags: ["Vegan", "Leve"],
    ingredients: [
      { name: "Tofu", quantity: 250, unit: "g", section: "Alternativas Vegetais" },
      { name: "Brócolos", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Molho de soja", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Cortar o tofu em cubos.", "Saltear o tofu com os brócolos e adicionar molho de soja.", "Servir quente."]
  },
  {
    id: "r132",
    name: "Caril de Peixe Expresso",
    emoji: "🍛",
    time: 30,
    baseServings: 4,
    kcalPerServing: 380,
    tags: ["Peixe", "Conforto"],
    ingredients: [
      { name: "Pescada", quantity: 400, unit: "g", section: "Peixaria" },
      { name: "Leite de coco", quantity: 200, unit: "ml", section: "Mercearia" },
      { name: "Caril em pó", quantity: 1, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Fazer caril com o leite de coco num tacho.", "Juntar os cubos de peixe.", "Deixar apurar 10 min."]
  },
  {
    id: "r133",
    name: "Wrap de Frango Grelhado",
    emoji: "🌯",
    time: 15,
    baseServings: 2,
    kcalPerServing: 340,
    tags: ["Carne", "Leve", "Rápido"],
    ingredients: [
      { name: "Wraps", quantity: 4, unit: "un", section: "Padaria" },
      { name: "Peito de frango", quantity: 200, unit: "g", section: "Talho" },
      { name: "Alface", quantity: 0.25, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Grelhar o peito de frango temperado e fatiar.", "Montar o wrap com a alface.", "Enrolar e servir."]
  },
  {
    id: "r134",
    name: "Salada Caprese",
    emoji: "🍅",
    time: 5,
    baseServings: 2,
    kcalPerServing: 220,
    tags: ["Vegetariano", "Leve", "Rápido"],
    ingredients: [
      { name: "Tomate", quantity: 2, unit: "un", section: "Frutas e Legumes" },
      { name: "Queijo mozzarella fresco", quantity: 1, unit: "un", section: "Laticínios e Ovos" },
      { name: "Manjericão", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Cortar o tomate e mozzarella às rodelas.", "Dispor as rodelas e o manjericão.", "Temperar com azeite e sal."]
  },
  {
    id: "r135",
    name: "Macarrão com Queijo Simples",
    emoji: "🧀",
    time: 20,
    baseServings: 4,
    kcalPerServing: 480,
    tags: ["Vegetariano", "Familiar", "Conforto"],
    ingredients: [
      { name: "Macarrão", quantity: 300, unit: "g", section: "Mercearia" },
      { name: "Queijo cheddar", quantity: 150, unit: "g", section: "Laticínios e Ovos" },
      { name: "Leite", quantity: 100, unit: "ml", section: "Laticínios e Ovos" }
    ],
    instructions: ["Cozer a massa.", "Derreter o queijo no leite para fazer creme.", "Juntar creme à massa cozida."]
  },
  {
    id: "r136",
    name: "Batata Doce Recheada",
    emoji: "🍠",
    time: 45,
    baseServings: 2,
    kcalPerServing: 350,
    tags: ["Vegetariano", "Conforto"],
    ingredients: [
      { name: "Batata doce", quantity: 2, unit: "un", section: "Frutas e Legumes" },
      { name: "Grão de bico", quantity: 100, unit: "g", section: "Mercearia" },
      { name: "Espinafres", quantity: 1, unit: "emb", section: "Frutas e Legumes" }
    ],
    instructions: ["Assar as batatas no forno.", "Fazer um corte longitudinal e colocar o grão e espinafre."]
  },
  {
    id: "r137",
    name: "Rolo de Carne Mista",
    emoji: "🥩",
    time: 60,
    baseServings: 4,
    kcalPerServing: 520,
    tags: ["Carne", "Familiar", "Especial"],
    ingredients: [
      { name: "Carne picada mista", quantity: 600, unit: "g", section: "Talho" },
      { name: "Pão ralado", quantity: 50, unit: "g", section: "Mercearia" },
      { name: "Ovos", quantity: 1, unit: "un", section: "Laticínios e Ovos" }
    ],
    instructions: ["Envolver a carne com pão ralado, ovo e temperos.", "Moldar o rolo e levar ao forno por 45 minutos."]
  },
  {
    id: "r138",
    name: "Noodles Salteados com Vegetais",
    emoji: "🍜",
    time: 15,
    baseServings: 2,
    kcalPerServing: 310,
    tags: ["Vegan", "Rápido"],
    ingredients: [
      { name: "Noodles", quantity: 200, unit: "g", section: "Mercearia" },
      { name: "Legumes variados", quantity: 300, unit: "g", section: "Frutas e Legumes" },
      { name: "Molho de soja", quantity: 3, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Demolhar os noodles em água quente.", "Saltear os legumes numa wok e juntar os noodles coados.", "Temperar com soja e misturar."]
  },
  {
    id: "r139",
    name: "Ervilhas com Ovos Escalfados",
    emoji: "🍳",
    time: 25,
    baseServings: 3,
    kcalPerServing: 280,
    tags: ["Vegetariano", "Conforto", "Económico"],
    ingredients: [
      { name: "Ervilhas", quantity: 400, unit: "g", section: "Frutas e Legumes" },
      { name: "Ovos", quantity: 4, unit: "un", section: "Laticínios e Ovos" },
      { name: "Cebola", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Fazer um refogado com cebola e estufar as ervilhas.", "Colocar os ovos por cima para escalfar.", "Mexer devagar e servir."]
  },
  {
    id: "r140",
    name: "Sanduíche de Atum e Maionese",
    emoji: "🥪",
    time: 5,
    baseServings: 2,
    kcalPerServing: 360,
    tags: ["Peixe", "Leve", "Rápido"],
    ingredients: [
      { name: "Pão forma", quantity: 4, unit: "fatias", section: "Padaria" },
      { name: "Atum", quantity: 1, unit: "lata", section: "Mercearia" },
      { name: "Maionese", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Misturar o atum com a maionese numa tacinha.", "Espalhar a pasta de atum pelo pão e tapar à sanduíche."]
  },
  {
    id: "r141",
    name: "Frittata de Curgete",
    emoji: "🥘",
    time: 25,
    baseServings: 4,
    kcalPerServing: 220,
    tags: ["Vegetariano", "Leve"],
    ingredients: [
      { name: "Curgete", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Ovos", quantity: 6, unit: "un", section: "Laticínios e Ovos" },
      { name: "Queijo Ralado", quantity: 50, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Ralar a curgete aos bocados pequenos.", "Misturar ovos e queijo numa tigela.", "Juntar a curgete e levar ao forno por 20 minutos."]
  },
  {
    id: "r142",
    name: "Hamburger de Feijão Preto",
    emoji: "🍔",
    time: 30,
    baseServings: 4,
    kcalPerServing: 330,
    tags: ["Vegan", "Familiar"],
    ingredients: [
      { name: "Feijão preto cozido", quantity: 400, unit: "g", section: "Mercearia" },
      { name: "Farinha de aveia", quantity: 50, unit: "g", section: "Mercearia" },
      { name: "Cebola", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Esmagar e triturar feijão e a cebola no processador.", "Adicionar fariha de aveia até modelar em formato hamburger.", "Cozinhar de ambos os lados na frigideira."]
  },
  {
    id: "r143",
    name: "Pizza de Pão de Forma",
    emoji: "🍕",
    time: 15,
    baseServings: 2,
    kcalPerServing: 340,
    tags: ["Conforto", "Familiar", "Rápido"],
    ingredients: [
      { name: "Pão de forma", quantity: 4, unit: "fatias", section: "Padaria" },
      { name: "Polpa de tomate", quantity: 4, unit: "c. sopa", section: "Mercearia" },
      { name: "Queijo mozzarella ralado", quantity: 100, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Dispor o pão no tabuleiro.", "Barrar com polpa de tomate e o queijo.", "Levar ao forno a derreter."]
  },
  {
    id: "r144",
    name: "Esparguete à Bolonhesa de Lentilhas",
    emoji: "🍝",
    time: 30,
    baseServings: 4,
    kcalPerServing: 410,
    tags: ["Vegan", "Familiar", "Conforto"],
    ingredients: [
      { name: "Esparguete", quantity: 300, unit: "g", section: "Mercearia" },
      { name: "Lentilhas castanhas", quantity: 200, unit: "g", section: "Mercearia" },
      { name: "Polpa de tomate", quantity: 200, unit: "ml", section: "Mercearia" }
    ],
    instructions: ["Cozer as lentilhas com o estrugido.", "Cozer a massa noutro tacho.", "Misturar a polpa e envolver."]
  },
  {
    id: "r145",
    name: "Strogonoff de Cogumelos Simples",
    emoji: "🍛",
    time: 20,
    baseServings: 3,
    kcalPerServing: 320,
    tags: ["Vegetariano", "Conforto"],
    ingredients: [
      { name: "Cogumelos", quantity: 400, unit: "g", section: "Frutas e Legumes" },
      { name: "Natas", quantity: 200, unit: "ml", section: "Mercearia" },
      { name: "Ketchup", quantity: 1, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Saltear os cogumelos bem fatiados numa frigideira.", "Juntar as natas, ketchup, e temperos.", "Deixar ferver dois minutos e servir."]
  },
  {
    id: "r146",
    name: "Salmão Frito com Alecrim",
    emoji: "🐠",
    time: 15,
    baseServings: 2,
    kcalPerServing: 420,
    tags: ["Peixe", "Rápido", "Especial"],
    ingredients: [
      { name: "Salmão", quantity: 2, unit: "postas", section: "Peixaria" },
      { name: "Alecrim", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Limão", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Aquecer o azeite na frigideira com os ramos do alecrim.", "Adicionar as postas do salmão e fritar bem.", "Temperar com sal e regar com sumo de limão."]
  },
  {
    id: "r147",
    name: "Lasanha de Atum Rápida",
    emoji: "👩‍🍳",
    time: 45,
    baseServings: 4,
    kcalPerServing: 490,
    tags: ["Peixe", "Familiar", "Conforto"],
    ingredients: [
      { name: "Massa de lasanha", quantity: 200, unit: "g", section: "Mercearia" },
      { name: "Atum", quantity: 3, unit: "latas", section: "Mercearia" },
      { name: "Molho bechamel", quantity: 500, unit: "ml", section: "Mercearia" }
    ],
    instructions: ["Forrar um tabuleiro e montar a lasanha: alternando molho, massa e atum.", "Acabar com queijo por cima.", "Levar ao forno a 200ºC."]
  },
  {
    id: "r148",
    name: "Cuscuz com Legumes",
    emoji: "🥗",
    time: 10,
    baseServings: 2,
    kcalPerServing: 280,
    tags: ["Vegan", "Leve", "Rápido"],
    ingredients: [
      { name: "Cuscuz", quantity: 150, unit: "g", section: "Mercearia" },
      { name: "Legumes mistos picados", quantity: 200, unit: "g", section: "Frutas e Legumes" },
      { name: "Azeite", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Hidratar os cuscuz com o dobro de água fervente.", "Saltear os vegetais picadinhos uns dois minutinhos.", "Misturar tudo suavemente."]
  },
  {
    id: "r149",
    name: "Tomate Recheado",
    emoji: "🍅",
    time: 35,
    baseServings: 4,
    kcalPerServing: 290,
    tags: ["Vegetariano", "Especial"],
    ingredients: [
      { name: "Tomate grande", quantity: 4, unit: "un", section: "Frutas e Legumes" },
      { name: "Soja desidratada grossa", quantity: 100, unit: "g", section: "Mercearia" },
      { name: "Queijo para gratinar", quantity: 50, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Rechear metades de tomates retirando as pevides, enchendo com soja hidratada temperada.", "Polvilhar com queijo e ir 20 mins ao forno."]
  },
  {
    id: "r150",
    name: "Sopa Miso Rápida",
    emoji: "🥣",
    time: 10,
    baseServings: 2,
    kcalPerServing: 110,
    tags: ["Vegan", "Leve", "Rápido"],
    ingredients: [
      { name: "Pasta de Miso", quantity: 2, unit: "c. sopa", section: "Mercearia" },
      { name: "Tofu", quantity: 100, unit: "g", section: "Alternativas Vegetais" },
      { name: "Cebolinho", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Ferver três chávenas água pura no tacho.", "Juntar os bocados de tofu e colher de sopa de味噌 mexe-se fora do lume até dissipar.", "Guarnecer com cebolinho picado."]
  }
];

