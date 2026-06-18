import { Recipe } from "../types";

export const recipesP10: Recipe[] = [
  {
    id: "r176",
    name: "Ovos Rotos Frios com Batata Doce",
    emoji: "🍳",
    time: 25,
    baseServings: 2,
    kcalPerServing: 280,
    tags: ["Vegetariano", "Lanche", "Praia"],
    ingredients: [
      { name: "Batata doce", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Ovos", quantity: 3, unit: "un", section: "Laticínios e Ovos" },
      { name: "Azeite", quantity: 1, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Cortar a batata doce em palitos finos e assar no forno.", "Fritar ligeiramente os ovos.", "Misturar num recipiente para levar para a praia."]
  },
  {
    id: "r177",
    name: "Bolinhos de Bacalhau Rápidos (Forno)",
    emoji: "🐟",
    time: 40,
    baseServings: 4,
    kcalPerServing: 210,
    tags: ["Peixe", "Praia", "Familiar"],
    ingredients: [
      { name: "Postas de bacalhau", quantity: 2, unit: "un", section: "Peixaria" },
      { name: "Puré de batata em floco", quantity: 1, unit: "emb", section: "Mercearia" },
      { name: "Salsa", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Ovos", quantity: 2, unit: "un", section: "Laticínios e Ovos" }
    ],
    instructions: ["Preparar o puré. Cozer, desofiar e limpar espinhas ao bacalhau.", "Misturar ovos e salsa.", "Formar rolinhos e assar no forno 15 min de cada lado."]
  },
  {
    id: "r178",
    name: "Sanduíches de Ovo Mexido e Bacon",
    emoji: "🥪",
    time: 15,
    baseServings: 2,
    kcalPerServing: 420,
    tags: ["Lanche", "Carne", "Praia"],
    ingredients: [
      { name: "Pão de mistura", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Ovos", quantity: 3, unit: "un", section: "Laticínios e Ovos" },
      { name: "Bacon em tiras", quantity: 50, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Tostar o bacon na frigideira seca até estalar.", "Numa tigela bater os ovos com uma pinga de leite e misturar o bacon, fazer mexidos na sertã.", "Rechear os pães e embrulhar."]
  },
  {
    id: "r179",
    name: "Melancia em Palitos",
    emoji: "🍉",
    time: 5,
    baseServings: 4,
    kcalPerServing: 50,
    tags: ["Vegan", "Leve", "Praia", "Saudável"],
    ingredients: [
      { name: "Melancia", quantity: 0.5, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Cortar a melancia em fatias e depois retirar a casca grossa em palitos grossos como se fossem gelados de gelo.", "Guardar muito frios e ir mordendo."]
  },
  {
    id: "r180",
    name: "Tarteletes Salgadas de Queijo",
    emoji: "🧀",
    time: 30,
    baseServings: 6,
    kcalPerServing: 220,
    tags: ["Lanche", "Familiar", "Vegetariano"],
    ingredients: [
      { name: "Massa quebrada", quantity: 1, unit: "base", section: "Laticínios e Ovos" },
      { name: "Queijo creme", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Queijo Emmental picado", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Tomate cereja", quantity: 50, unit: "g", section: "Frutas e Legumes" }
    ],
    instructions: ["Recortar massa e moldar forminhas.", "Rechear com os dois queijos. Colocar meia cerejinha topo.", "Forno a 180ºC 20 min. Comer depois de frio."]
  },
  {
    id: "r181",
    name: "Bolachas de Arroz com Manteiga de Amendoim",
    emoji: "🍘",
    time: 5,
    baseServings: 1,
    kcalPerServing: 180,
    tags: ["Vegan", "Saudável", "Lanche", "Fit"],
    ingredients: [
      { name: "Bolachas de Arroz suflado", quantity: 3, unit: "un", section: "Mercearia" },
      { name: "Manteiga Amendoim", quantity: 1, unit: "c. sopa", section: "Mercearia" },
      { name: "Fruta ou sementes", quantity: 1, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Barrar as bolachas logo num prato na toalha da praia.", "Comer para repor energia."]
  },
  {
    id: "r182",
    name: "Croquetes de Grão de Bico (Falafel Básico)",
    emoji: "🧆",
    time: 40,
    baseServings: 4,
    kcalPerServing: 250,
    tags: ["Vegan", "Lanche", "Saudável"],
    ingredients: [
      { name: "Grão de Bico Cozido", quantity: 1, unit: "lata gigante", section: "Mercearia" },
      { name: "Cebola", quantity: 0.5, unit: "un", section: "Frutas e Legumes" },
      { name: "Pão Ralado", quantity: 2, unit: "c. sopa", section: "Mercearia" },
      { name: "Cominhos", quantity: 1, unit: "c. café", section: "Mercearia" }
    ],
    instructions: ["Bater o grão bem seco num processador com todos os ingredientes.", "Fazer esferas achatadas.", "Pincelar azeite e levar ao forno por 20 minutos 200 graus."]
  },
  {
    id: "r183",
    name: "Massa Fria com Pesto e Frango",
    emoji: "🍝",
    time: 20,
    baseServings: 3,
    kcalPerServing: 410,
    tags: ["Praia", "Almoço", "Carne"],
    ingredients: [
      { name: "Massa Curta Espirais", quantity: 250, unit: "g", section: "Mercearia" },
      { name: "Sobras de Frango Assado", quantity: 150, unit: "g", section: "Laticínios e Ovos" },
      { name: "Molho Pesto", quantity: 3, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Cozer espirais num pingo de azeite e escorrer. Juntar gelo para estancar.", "Escorrer à exaustão.", "Envolver no tupperware da praia com as rodelas e bocados de frango, e as valentes colheradas de pesto perfeito."]
  },
  {
    id: "r184",
    name: "Espetadas de Fruta Veranil",
    emoji: "🍢",
    time: 15,
    baseServings: 2,
    kcalPerServing: 80,
    tags: ["Vegan", "Lanche", "Doce", "Saudável", "Praia"],
    ingredients: [
      { name: "Uvas", quantity: 12, unit: "un", section: "Frutas e Legumes" },
      { name: "Meloa", quantity: 2, unit: "fatias", section: "Frutas e Legumes" },
      { name: "Morangos", quantity: 6, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Tudo muito lavado.", "Usando paus pequeninos enfia peças das várias frutas formando um arco-íris.", "Fresco, sem açúcares e perfeito para manter miúdos calados."]
  },
  {
    id: "r185",
    name: "Wrap Grego de Queijo Feta",
    emoji: "🥙",
    time: 10,
    baseServings: 2,
    kcalPerServing: 320,
    tags: ["Vegetariano", "Lanche", "Praia"],
    ingredients: [
      { name: "Wrap Tortilla", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Queijo Feta", quantity: 100, unit: "g", section: "Laticínios e Ovos" },
      { name: "Tomate", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Azeitonas prestas sem caroço", quantity: 15, unit: "un", section: "Mercearia" }
    ],
    instructions: ["Amassar numa tigela o feta com tomate triturado grosseiro rústico e pedaços de carne macia de azeitona.", "Fechar num embrulho cego na hóstia tortilla.", "Grelhar tosteira e arrefecer ou comer simples logo cru."]
  },
  {
    id: "r186",
    name: "Empadão Frio de Atum",
    emoji: "🥧",
    time: 50,
    baseServings: 4,
    kcalPerServing: 420,
    tags: ["Peixe", "Familiar", "Praia", "Almoço"],
    ingredients: [
      { name: "Batata cozida", quantity: 5, unit: "un", section: "Frutas e Legumes" },
      { name: "Atum óleo/azite", quantity: 3, unit: "latas", section: "Mercearia" },
      { name: "Cebola", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Azeitonas", quantity: 3, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Amassar uma base sólida tipo betão de batata.", "Rechear espessa e brutal mistura da cebola com azeite de lata atum e as azeitonas que fazem o truque mar salgado.", "Assar aspeto tostadinho no cimo com garfo desenhado (35m forno) e solidifica maravilhosamente frio."]
  },
  {
    id: "r187",
    name: "Triângulos de Pão Árabe e Queijo Ervas",
    emoji: "🧀",
    time: 10,
    baseServings: 2,
    kcalPerServing: 240,
    tags: ["Vegetariano", "Lanche"],
    ingredients: [
      { name: "Pão Pita Árabe", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Queijo Creme de Ervas", quantity: 1, unit: "pacote pequeno", section: "Laticínios e Ovos" }
    ],
    instructions: ["Torrar ligeiramente pão de miolo vago e balão.", "Espetacular barramento na interior base.", "Tapar e cortar fatias soltas tipo de pizza triângulos para snack."]
  },
  {
    id: "r188",
    name: "Mistos e Fios Crocantes Batata Doce",
    emoji: "🍟",
    time: 30,
    baseServings: 2,
    kcalPerServing: 190,
    tags: ["Vegan", "Praia", "Lanche", "Saudável"],
    ingredients: [
      { name: "Batata doce", quantity: 2, unit: "un", section: "Frutas e Legumes" },
      { name: "Ervas secas", quantity: 1, unit: "c. sopa", section: "Mercearia" }
    ],
    instructions: ["Cortar quase transparente batata e imergir água.", "Enxaguar pano seco prato.", "Grelhar forno ventilador 180 muito quente para enrugar crocantes chips 20min."]
  },
  {
    id: "r189",
    name: "Iogurte Proteico Caseiro de Aveia e Compota",
    emoji: "🍦",
    time: 5,
    baseServings: 1,
    kcalPerServing: 250,
    tags: ["Doce", "Saudável", "Pequeno-almoço", "Lanche"],
    ingredients: [
      { name: "Iogurte", quantity: 1, unit: "un", section: "Laticínios e Ovos" },
      { name: "Flocos de Aveia", quantity: 2, unit: "c. sopa", section: "Mercearia" },
      { name: "Compota", quantity: 1, unit: "c. chá", section: "Mercearia" }
    ],
    instructions: ["Dispor à vez camadas dentro frasco hermético limpo e vedado.", "Iogurte, linha de doce compota que finge base recheada.", "E finalmente por cima a aveia que adoçará em molhado para amanhã na toalha estar fofíssima papinha."]
  },
  {
    id: "r190",
    name: "Aperol e Sumo de Limão Gelo Picado",
    emoji: "🍹",
    time: 5,
    baseServings: 2,
    kcalPerServing: 110,
    tags: ["Fim de Semana", "Bebida", "Praia"],
    ingredients: [
      { name: "Aperitivo Laranja", quantity: 4, unit: "medidas copo", section: "Bebidas" },
      { name: "Água com Gás", quantity: 1, unit: "garrafa", section: "Mercearia" },
      { name: "Limão", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["Muito gelo no copo.", "Junta proporções maravilha para festa com os pés nas ondas, uma parte aperitivo duas água escura gás borbotar.", "Meia dúzia de espremidelas ácidas topo citrico amarelo doente limão."]
  },
  {
    id: "r191",
    name: "Sanduíches de Atum em Bolo do Caco",
    emoji: "🍔",
    time: 15,
    baseServings: 2,
    kcalPerServing: 350,
    tags: ["Praia", "Almoço", "Peixe", "Conforto"],
    ingredients: [
      { name: "Bolo do Caco", quantity: 2, unit: "un", section: "Padaria" },
      { name: "Pasta de Atum (comum)", quantity: 2, unit: "c. sopa", section: "Laticínios e Ovos" },
      { name: "Rúcula", quantity: 50, unit: "g", section: "Frutas e Legumes" }
    ],
    instructions: ["Torrar ligeiramente o bolo do caco na sertã com uma linha de alho manteiga invisível leve.", "Pressionar e entufar sem do nem piedade barriga enorme de peixe de lata untuoso atum de maionese.", "Aconchegar a salada folha pontaguda rúcula verde para mastigar croque."]
  },
  {
    id: "r192",
    name: "Cenouras Baby e Azeitonas Retrato Andaluz Snack",
    emoji: "🫒",
    time: 5,
    baseServings: 2,
    kcalPerServing: 130,
    tags: ["Praia", "Lanche", "Vegan"],
    ingredients: [
      { name: "Cenouras baby", quantity: 1, unit: "emb", section: "Frutas e Legumes" },
      { name: "Azeitonas", quantity: 100, unit: "g", section: "Mercearia" }
    ],
    instructions: ["Abrir tampa tupperware mar." , "Ouvir estralos croch e caroços voadores.", "Genuíno não cozinhas."]
  },
  {
    id: "r193",
    name: "Feijoada Morna Leve de Búzios do Pobre (Chocos)",
    emoji: "🦑",
    time: 50,
    baseServings: 4,
    kcalPerServing: 420,
    tags: ["Peixe", "Praia", "Almoço", "Especial"],
    ingredients: [
      { name: "Chocos", quantity: 500, unit: "g", section: "Peixaria" },
      { name: "Feijão Branco", quantity: 1, unit: "lata gigante", section: "Mercearia" },
      { name: "Cenoura", quantity: 2, unit: "un", section: "Frutas e Legumes" },
      { name: "Polpa de tomate", quantity: 100, unit: "ml", section: "Mercearia" }
    ],
    instructions: ["Alourar refogado em chama grossa, meter a fera de choco que murcha.", "Deixar criar molho preto grosso do sabor forte choco. Cenouras nadam para adocicar mar bravio por 20m.", "Feijão ferve fim só na caldeira unindo forças numa pasta estufada e deliciosa morna toalha estendida."]
  },
  {
    id: "r194",
    name: "Tortilha de Batata Grossa à Espanhola",
    emoji: "🍳",
    time: 40,
    baseServings: 6,
    kcalPerServing: 280,
    tags: ["Vegetariano", "Lanche", "Praia", "Familiar"],
    ingredients: [
      { name: "Ovos", quantity: 5, unit: "un", section: "Laticínios e Ovos" },
      { name: "Batata para fritar", quantity: 300, unit: "g", section: "Frutas e Legumes" },
      { name: "Cebola", quantity: 1, unit: "un", section: "Frutas e Legumes" }
    ],
    instructions: ["A batata deve ser confitada muito devagar fogo brando óleo azeite para amaciar mole. A cebola idem.", "Mexe se a banha gordurosa mas sem fritos do ovo bruto salgado.", "Despeja sertã inteira até criar rolhão amarelado tortilha. Virar ao ar tacho prato destemida cambalhota de rei."]
  },
  {
    id: "r195",
    name: "Batido Rosa de Melancia e Iogurte",
    emoji: "🧋",
    time: 5,
    baseServings: 2,
    kcalPerServing: 110,
    tags: ["Vegan", "Bebida", "Doce"],
    ingredients: [
      { name: "Melancia", quantity: 300, unit: "g", section: "Frutas e Legumes" },
      { name: "Iogurte de soja baunilha", quantity: 1, unit: "un", section: "Laticínios e Ovos" },
      { name: "Gelo", quantity: 5, unit: "pedras", section: "Bebidas" }
    ],
    instructions: ["Triturar a melancia sozinha em líquido puro.", "Enfornar o copo e as pedras de gelo. Sorver rápido gelado e ficar vermelho bigode iogurte no beiço."]
  },
  {
    id: "r196",
    name: "Bolo Salgado Rápido",
    emoji: "🍞",
    time: 50,
    baseServings: 8,
    kcalPerServing: 260,
    tags: ["Lanche", "Familiar", "Especial"],
    ingredients: [
      { name: "Farinha", quantity: 200, unit: "g", section: "Mercearia" },
      { name: "Ovos", quantity: 4, unit: "un", section: "Laticínios e Ovos" },
      { name: "Óleo", quantity: 100, unit: "ml", section: "Mercearia" },
      { name: "Mistura fiambre/queijo/azeitonas", quantity: 150, unit: "g", section: "Laticínios e Ovos" }
    ],
    instructions: ["Numa tigela misturar os ingredientes molhados, depois farinha, por fim a miscelânia picadinha de enchidos fiambres.", "Enfornar em forma quadrada estilo pão ou broa rectângulo.", "Assar a 180ºC até espeto palito vir seco no ar sem massas."]
  },
  {
    id: "r197",
    name: "Sandes Aberta de Tomate e Atum",
    emoji: "🥪",
    time: 5,
    baseServings: 1,
    kcalPerServing: 240,
    tags: ["Peixe", "Praia", "Lanche"],
    ingredients: [
      { name: "Pão de mistura", quantity: 1, unit: "fatias", section: "Padaria" },
      { name: "Tomate", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Atum", quantity: 0.5, unit: "latas", section: "Mercearia" }
    ],
    instructions: ["Sujar e humedecer o escroto cimo do pão forte rijo para não rasgar húmido.", "Verter tomates e óleo seco e peixe atum por tudo. Comido simples ao sabor natural solares de verao doirado e luso quente vento calmo na areia fina portuguesa."]
  },
  {
    id: "r198",
    name: "Tiras de Pepino Frio Crocante com Limão e Sal",
    emoji: "🥒",
    time: 5,
    baseServings: 2,
    kcalPerServing: 20,
    tags: ["Praia", "Vegan", "Leve", "Saudável"],
    ingredients: [
      { name: "Pepino", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Limão", quantity: 0.5, unit: "un", section: "Frutas e Legumes" },
      { name: "Sal fino", quantity: 1, unit: "pitada", section: "Mercearia" }
    ],
    instructions: ["Descascar deixando ligeiras listras verdes bonitas ver.', 'Cortar compridos espadachins fortes e compridos tipo pilar palito ou batata mcdonalds gordo de pepino rijo húmido.' , 'Temperar antes morder espremendo limão forte ácido pingo ardor leve salgado seco."]
  },
  {
    id: "r199",
    name: "Massa Fria com Cogumelos e Milho",
    emoji: "🌽",
    time: 20,
    baseServings: 2,
    kcalPerServing: 350,
    tags: ["Vegetariano", "Lanche", "Praia"],
    ingredients: [
      { name: "Massa", quantity: 150, unit: "g", section: "Mercearia" },
      { name: "Milho", quantity: 1, unit: "lata", section: "Mercearia" },
      { name: "Cogumelos Laminados Frescos", quantity: 100, unit: "g", section: "Frutas e Legumes" }
    ],
    instructions: ["Cozer massa espesso e esvaziar da tumba a ferver tacho. Saltear os fresquíssimos chapéus cogumelas. Envolver e carregar marmita tupperware.", "Ideal comer já gelada praia morna e ventosa ou duna resguarda tarde caindo calor de sol sol e bronze."]
  },
  {
    id: "r200",
    name: "Pézinhos Bolachas de Maçã Simples Rápidas",
    emoji: "🍏",
    time: 25,
    baseServings: 4,
    kcalPerServing: 160,
    tags: ["Lanche", "Vegan", "Doce"],
    ingredients: [
      { name: "Maçã madura", quantity: 1, unit: "un", section: "Frutas e Legumes" },
      { name: "Flocos de aveia", quantity: 8, unit: "c. sopa", section: "Mercearia" },
      { name: "Canela", quantity: 1, unit: "c. chá", section: "Mercearia" }
    ],
    instructions: ["Amassar sem piedade mação para liquido pardo e espesso nojento sem asco puro sabor doce frutose mel maçãzeiro podre e velha", "Pudim esfarela e amassa a dura aveia criando massas betão colante unindo montanhas fortes canela pó madeira pó cheirosa especiaria oriente.", "Formar pequenos mamilos dezenas assar na bandeja metal placa tabuleiro sol negro ferro formo forte 180 ate ressequido em biscoito."]
  }
];
