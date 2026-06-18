import { Recipe } from "../types";

export const recipesP9: Recipe[] = [
  {
    id: "r151",
    name: "Sandes Mista Clássica",
    emoji: "🥪",
    time: 5,
    baseServings: 1,
    kcalPerServing: 250,
    tags: ["Familiar", "Pequeno-almoço", "Lanche", "Praia"],
    ingredients: [
      { name: "Pão de forma", quantity: 2, unit: "fatias", section: "Padaria" },
      { name: "Fiambre", quantity: 1, unit: "fatia", section: "Laticínios e Ovos" },
      { name: "Queijo Flamengo", quantity: 1, unit: "fatia", section: "Laticínios e Ovos" },
      { name: "Manteiga", quantity: 10, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Barrar o pão com manteiga.", "Colocar o fiambre e o queijo.", "Fechar a sandes."]
  },
  {
    id: "r152",
    name: "Salada Fria de Massa de Laços",
    emoji: "🥗",
    time: 15,
    baseServings: 4,
    kcalPerServing: 350,
    tags: ["Leve", "Praia", "Almoço"],
    ingredients: [
      { name: "Massa Laços (Farfalle)", quantity: 250, unit: "g", section: "Mercearia" },
      { name: "Tomate cereja", quantity: 150, unit: "g", section: "Frutas e Legumes" },
      { name: "Queijo mozzarella fresco", quantity: 1, unit: "un", section: "Laticínios e Ovos" },
      { name: "Azeitonas", quantity: 50, unit: "g", section: "Mercearia" },
      { name: "Azeite", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Cozer a massa e deixar arrefecer.", "Cortar o tomate e o queijo e juntar à massa juntamente com as azeitonas.", "Temperar com azeite e sal."]
  },
  {
    id: "r153",
    name: "Wraps de Salmão Fumado",
    emoji: "🌯",
    time: 10,
    baseServings: 2,
    kcalPerServing: 280,
    tags: ["Praia", "Leve", "Lanche"],
    ingredients: [
      { name: "Wraps", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Salmão fumado", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Queijo creme", quantity: 50, unit: "g", section: "Laticínios e Ovos" },
      { name: "Rúcula", quantity: 50, unit: "g", section: "Frutas e Legumes" }
    ],
    instructions: ["Barrar os wraps com queijo creme.", "Distribuir o salmão fumado e a rúcula.", "Enrolar firmemente e cortar a meio."]
  },
  {
    id: "r154",
    name: "Muffins de Cenoura",
    emoji: "🧁",
    time: 35,
    baseServings: 6,
    kcalPerServing: 180,
    tags: ["Doce", "Lanche", "Praia", "Familiar"],
    ingredients: [
      { name: "Cenoura ralada", quantity: 200, unit: "g", section: "Frutas e Legumes" },
      { name: "Ovos", quantity: 2, unit: "un", section: "Laticínios e Ovos" },
      { name: "Farinha", quantity: 150, unit: "g", section: "Mercearia" },
      { name: "Açúcar", quantity: 100, unit: "g", section: "Mercearia" },
      { name: "Óleo", quantity: 50, unit: "ml", section: "Mercearia" }
    ],
    instructions: ["Misturar ovos, açúcar e óleo.", "Juntar a cenoura e por fim envolver a farinha.", "Distribuir por formas e levar ao forno a 180ºC por 25min."]
  },
  {
    id: "r155",
    name: "Quiche Rápida de Fiambre",
    emoji: "🥧",
    time: 40,
    baseServings: 4,
    kcalPerServing: 320,
    tags: ["Quiche", "Praia", "Familiar"],
    ingredients: [
      { name: "Massa quebrada", quantity: 1, unit: "base", section: "Laticínios e Ovos" },
      { name: "Fiambre", quantity: 150, unit: "g", section: "Laticínios e Ovos" },
      { name: "Queijo ralado", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Natas", quantity: 200, unit: "ml", section: "Laticínios e Ovos" },
      { name: "Ovos", quantity: 3, unit: "un", section: "Laticínios e Ovos" }
    ],
    instructions: ["Forrar a tarteira com a massa.", "Misturar ovos, natas, fiambre em cubos e queijo.", "Verter sobre a massa e assar a 180ºC por 30min."]
  },
  {
    id: "r156",
    name: "Palitos de Cenoura e Húmus",
    emoji: "🥕",
    time: 5,
    baseServings: 2,
    kcalPerServing: 120,
    tags: ["Vegan", "Lanche", "Praia", "Saudável"],
    ingredients: [
      { name: "Cenoura", quantity: 2, unit: "un", section: "Frutas e Legumes" },
      { name: "Húmus", quantity: 1, unit: "embalagem", section: "Laticínios e Ovos" }
    ],
    instructions: ["Descascar as cenouras e cortar em palitos.", "Colocar o húmus numa taça.", "Mergulhar os palitos no húmus ao comer."]
  },
  {
    id: "r157",
    name: "Bolachas de Aveia e Maçã",
    emoji: "🍪",
    time: 25,
    baseServings: 4,
    kcalPerServing: 150,
    tags: ["Doce", "Saudável", "Lanche"],
    ingredients: [
      { name: "Flocos de aveia", quantity: 100, unit: "g", section: "Mercearia" },
      { name: "Puré de maçã", quantity: 100, unit: "g", section: "Mercearia" },
      { name: "Canela", quantity: 1, unit: "c. chá", section: "Mercearia" },
      { name: "Mel", quantity: 1, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Misturar todos os ingredientes.", "Fazer bolinhas e espalmar num tabuleiro.", "Levar ao forno a 180ºC por 15 minutos."]
  },
  {
    id: "r158",
    name: "Ovos Cozidos com Paprika",
    emoji: "🥚",
    time: 15,
    baseServings: 2,
    kcalPerServing: 140,
    tags: ["Lanche", "Praia", "Fit", "Vegetariano"],
    ingredients: [
      { name: "Ovos", quantity: 4, unit: "un", section: "Laticínios e Ovos" },
      { name: "Paprika doce", quantity: 1, unit: "c. café", section: "Mercearia" },
      { name: "Sal", quantity: 1, unit: "q.b.", section: "Mercearia" }
    ],
    instructions: ["Cozer os ovos durante 10 minutos e arrefecer em água fria.", "Descascar e cortar ao meio.", "Polvilhar com sal e paprika antes de guardar na lancheira."]
  },
  {
    id: "r159",
    name: "Tostas com Pasta de Abacate",
    emoji: "🥑",
    time: 10,
    baseServings: 1,
    kcalPerServing: 260,
    tags: ["Vegan", "Pequeno-almoço", "Lanche", "Praia"],
    ingredients: [
      { name: "Pão torrado / Tostas", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Abacate", quantity: 0.5, unit: "un", section: "Frutas e Legumes" },
      { name: "Sumo limão", quantity: 1, unit: "c. chá", section: "Frutas e Legumes" },
      { name: "Sal", quantity: 1, unit: "q.b.", section: "Mercearia" }
    ],
    instructions: ["Esmagar o abacate com um garfo.", "Temperar com limão e sal.", "Barrar as tostas/pão imediatamente antes de embalar."]
  },
  {
    id: "r160",
    name: "Tarteletes de Fruta e Iogurte",
    emoji: "🍓",
    time: 10,
    baseServings: 2,
    kcalPerServing: 180,
    tags: ["Doce", "Lanche", "Vegetariano"],
    ingredients: [
      { name: "Tarteletes prontas", quantity: 4, unit: "un", section: "Padaria" },
      { name: "Iogurte", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Frutos vermelhos", quantity: 50, unit: "g", section: "Frutas e Legumes" },
      { name: "Mel", quantity: 1, unit: "fio", section: "Mercearia" }
    ],
    instructions: ["Preencher as tarteletes com o iogurte grego.", "Colocar os frutos vermelhos no topo.", "Levar no frio, regar com mel antes de comer."]
  },
  {
    id: "r161",
    name: "Mini Pizas Frias",
    emoji: "🍕",
    time: 20,
    baseServings: 4,
    kcalPerServing: 290,
    tags: ["Praia", "Familiar", "Lanche"],
    ingredients: [
      { name: "Massa de mini pizza redonda", quantity: 8, unit: "un", section: "Laticínios e Ovos" },
      { name: "Polpa tomate", quantity: 100, unit: "ml", section: "Mercearia" },
      { name: "Queijo ralado", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Orégãos", quantity: 1, unit: "c. chá", section: "Mercearia" }
    ],
    instructions: ["Espalhar polpa de tomate pelas bases.", "Por o queijo e orégãos e levar ao forno a 180ºC por 10min.", "Deixar arrefecer totalmente e embalar."]
  },
  {
    id: "r162",
    name: "Batido Fresco de Banana e Aveia",
    emoji: "🥤",
    time: 5,
    baseServings: 1,
    kcalPerServing: 220,
    tags: ["Vegetariano", "Lanche", "Bebida"],
    ingredients: [
      { name: "Leite fresco", quantity: 200, unit: "ml", section: "Laticínios e Ovos" },
      { name: "Banana", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Flocos de aveia", quantity: 2, unit: "c. sopa", section: "Mercearia" },
      { name: "Canela", quantity: 1, unit: "pés de pó", section: "Mercearia" }
    ],
    instructions: ["Colocar tudo no liquidificador.", "Triturar na potência máxima até ficar suave.", "Transportar em garrafa térmica bem fria."]
  },
  {
    id: "r163",
    name: "Sandes de Atum e Ovo",
    emoji: "🥪",
    time: 15,
    baseServings: 2,
    kcalPerServing: 350,
    tags: ["Praia", "Almoço", "Rápido"],
    ingredients: [
      { name: "Pão / Baguete", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Atum lata", quantity: 1, unit: "un", section: "Mercearia" },
      { name: "Ovos", quantity: 1, unit: "un", section: "Laticínios e Ovos" },
      { name: "Alface", quantity: 0.25, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Cozer o ovo.", "Fazer uma ligeira mistura com atum escorrido desfeito e rodelas do ovo.", "Encher o pão por cima das folhas de alface."]
  },
  {
    id: "r164",
    name: "Bolinhas de Energia (Tâmaras e Frutos Secos)",
    emoji: "🌰",
    time: 15,
    baseServings: 5,
    kcalPerServing: 110,
    tags: ["Vegan", "Lanche", "Fit", "Doce"],
    ingredients: [
      { name: "Tâmaras sem caroço", quantity: 150, unit: "g", section: "Mercearia" },
      { name: "Nozes ou amêndoas", quantity: 100, unit: "g", section: "Mercearia" },
      { name: "Cacau magro", quantity: 1, unit: "c. sopa", section: "Mercearia" },
      { name: "Coco ralado", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Num processador, moer os frutos secos.", "Juntar tâmaras e cacau, triturar até formar massa pegajosa.", "Fazer bolinhas e passar pelo coco."]
  },
  {
    id: "r165",
    name: "Empanadas de Frango (Forno)",
    emoji: "🥟",
    time: 45,
    baseServings: 4,
    kcalPerServing: 360,
    tags: ["Familiar", "Praia", "Lanche", "Carne"],
    ingredients: [
      { name: "Massa quebrada", quantity: 1, unit: "base", section: "Laticínios e Ovos" },
      { name: "Peito Frango desfiado", quantity: 200, unit: "g", section: "Laticínios e Ovos" },
      { name: "Cebola picada", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Gema", quantity: 1, unit: "un", section: "Laticínios e Ovos" }
    ],
    instructions: ["Fazer um pequeno refogado de frango com cebola.", "Cortar a massa em círculos, rechear e fechar como meias-luas.", "Pincelar com gema e assar a 180ºC por 20min."]
  },
  {
    id: "r166",
    name: "Tigela de Fruta Preparada",
    emoji: "🍉",
    time: 10,
    baseServings: 2,
    kcalPerServing: 90,
    tags: ["Vegan", "Leve", "Praia", "Saudável"],
    ingredients: [
      { name: "Melancia", quantity: 200, unit: "g", section: "Frutas e Legumes" },
      { name: "Morangos", quantity: 100, unit: "g", section: "Frutas e Legumes" },
      { name: "Kiwi", quantity: 2, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Descascar as frutas rigorosamente.", "Cortar em cubos perfeitos de tamanho idêntico.", "Juntar tudo em caixas herméticas e conservar muito frio."]
  },
  {
    id: "r167",
    name: "Bolo de Banana Fácil (Banana Bread)",
    emoji: "🍞",
    time: 50,
    baseServings: 6,
    kcalPerServing: 240,
    tags: ["Familiar", "Doce", "Lanche"],
    ingredients: [
      { name: "Bananas maduras", quantity: 3, unit: "un", section: "Frutas e Legumes" },
      { name: "Farinha", quantity: 200, unit: "g", section: "Mercearia" },
      { name: "Açúcar", quantity: 100, unit: "g", section: "Mercearia" },
      { name: "Ovos", quantity: 2, unit: "un", section: "Laticínios e Ovos" },
      { name: "Manteiga", quantity: 50, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Esmagar as bananas.", "Misturar as bananas esmagadas aos restantes ingredientes até formar massa homogénea.", "Levar ao forno a 180ºC por 40 minutos em forma de bolo inglês."]
  },
  {
    id: "r168",
    name: "Frango Frio com Limão",
    emoji: "🍗",
    time: 35,
    baseServings: 4,
    kcalPerServing: 280,
    tags: ["Praia", "Carne", "Fit", "Almoço"],
    ingredients: [
      { name: "Peito de Frango", quantity: 500, unit: "g", section: "Talho" },
      { name: "Limão", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Azeite", quantity: 2, unit: "c. sopa", section: "Mercearia" },
      { name: "Ervas provence", quantity: 1, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Grelhar o frango em panela ou forno, temperado com muito limão e ervas.", "Deixar arrefecer nas próprias estrias ou cortado em tiras.", "Transportar frio misturado ou em pão."]
  },
  {
    id: "r169",
    name: "Salada de Feijão Frade com Atum",
    emoji: "🥗",
    time: 15,
    baseServings: 2,
    kcalPerServing: 350,
    tags: ["Praia", "Peixe", "Leve"],
    ingredients: [
      { name: "Feijão frade cozido", quantity: 400, unit: "g", section: "Mercearia" },
      { name: "Atum em posta / lata", quantity: 1, unit: "un", section: "Mercearia" },
      { name: "Cebola picada", quantity: 0.5, unit: "un", section: "Frutas e Legumes" },
      { name: "Salsa", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Misturar o feijão com atum bem escorrido, salsa picadinha e cebola num tupperware.", "Fazer um tempero de azeite e vinagre, e levar num frasquinho.", "Juntar no momento antes de comer."]
  },
  {
    id: "r170",
    name: "Croquetes de Atum Forno",
    emoji: "🍘",
    time: 40,
    baseServings: 3,
    kcalPerServing: 290,
    tags: ["Familiar", "Peixe", "Lanche"],
    ingredients: [
      { name: "Batata cozida esmagada", quantity: 300, unit: "g", section: "Frutas e Legumes" },
      { name: "Atum escorrido", quantity: 2, unit: "latas", section: "Mercearia" },
      { name: "Ovos", quantity: 1, unit: "un", section: "Laticínios e Ovos" },
      { name: "Pão Ralado", quantity: 50, unit: "g", section: "Mercearia" }
    ],
    instructions: ["Esmagar atum com a batata e temperar.", "Formar croquetes roliços com as mãos, passar por ovo mexido e pão ralado.", "Colocar papel no forno a 200ºC e assar 20 min."]
  },
  {
    id: "r171",
    name: "Panquecas Frias com Mel",
    emoji: "🥞",
    time: 20,
    baseServings: 2,
    kcalPerServing: 310,
    tags: ["Pequeno-almoço", "Doce", "Lanche", "Familiar"],
    ingredients: [
      { name: "Farinha", quantity: 150, unit: "g", section: "Mercearia" },
      { name: "Leite", quantity: 200, unit: "ml", section: "Laticínios e Ovos" },
      { name: "Ovos", quantity: 1, unit: "un", section: "Laticínios e Ovos" },
      { name: "Mel", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Bater a farinha com ovo e leite.", "Fazer na frigideira pequenas panquecas em lume brando.", "Arrefecer empilhadas e transportar para comer regadas de mel frio."]
  },
  {
    id: "r172",
    name: "Bifes de Peru com Pão",
    emoji: "🥩",
    time: 20,
    baseServings: 2,
    kcalPerServing: 380,
    tags: ["Praia", "Carne", "Sanduíche"],
    ingredients: [
      { name: "Bifes peru finos", quantity: 2, unit: "un", section: "Talho" },
      { name: "Pão de Mafra/Bolo Levedo", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Alho", quantity: 1, unit: "dente", section: "Frutas e Legumes" },
      { name: "Manteiga", quantity: 1, unit: "c. chá", section: "Laticínios e Ovos" }
    ],
    instructions: ["Fritar o bifinho peru depressa na assadeira com dente alho esmagado e a manteiguinha.", "Rechear o pão e embalar bem justo em película.", "São perfeitos servidos frios após um mergulho."]
  },
  {
    id: "r173",
    name: "Trança Doce de Queijo e Fiambre",
    emoji: "🥨",
    time: 35,
    baseServings: 4,
    kcalPerServing: 360,
    tags: ["Lanche", "Praia", "Familiar"],
    ingredients: [
      { name: "Massa Folhada retangular", quantity: 1, unit: "rolo", section: "Laticínios e Ovos" },
      { name: "Queijo fatias", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Fiambre", quantity: 100, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Desenrolar a folhada e rechear a meio com fatias mistas.", "Fazer recortes nas bordas em espinhas ou tiras e tranjar no topo.", "Forno a 190ºC por 25min."]
  },
  {
    id: "r174",
    name: "Pipocas Caseiras Doces",
    emoji: "🍿",
    time: 10,
    baseServings: 2,
    kcalPerServing: 180,
    tags: ["Lanche", "Doce", "Familiar", "Vegan"],
    ingredients: [
      { name: "Milho para pipocas", quantity: 50, unit: "g", section: "Mercearia" },
      { name: "Óleo de girassol", quantity: 1, unit: "c. sopa", section: "Mercearia" },
      { name: "Açúcar", quantity: 2, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Num fio de óleo superquente junta o milho e tapa.", "Quando deixarem de estalar deita-as na bacia.", "Ainda mornas atira o açúcar. Guarda em frasco fecho forte para aguentarem croques."]
  },
  {
    id: "r175",
    name: "Sumo Detox de Maçã e Pepino",
    emoji: "🍏",
    time: 5,
    baseServings: 2,
    kcalPerServing: 60,
    tags: ["Bebida", "Vegan", "Saudável", "Praia"],
    ingredients: [
      { name: "Maçã Verde", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Pepino", quantity: 0.5, unit: "un", section: "Frutas e Legumes" },
      { name: "Gengibre", quantity: 1, unit: "pedaço", section: "Frutas e Legumes" },
      { name: "Água bem gelada", quantity: 500, unit: "ml", section: "Mercearia" }
    ],
    instructions: ["Colocar na misturadora pedaços de maçã com pele, pepino s/ sementes, descasque pequeno gengibre e tritura.", "Juntar água.", "Meter garrafa opaca térmica."]
  }
];
