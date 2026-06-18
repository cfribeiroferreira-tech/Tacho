const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, 'src', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

const replacements = {
  'Meloa rodelas': { name: 'Meloa', unit: 'fatias' },
  'Tomate cherry': { name: 'Tomate cereja' },
  'Tomate Picado': { name: 'Tomate', unit: 'un' },
  'Azeitona às rodelas': { name: 'Azeitonas' },
  'Batata Doce': { name: 'Batata doce', unit: 'un' },
  'Ervas Secas': { name: 'Ervas secas', unit: 'c. sopa' },
  'Saco cenouras baby lanche': { name: 'Cenouras baby', unit: 'emb' },
  'Azeitonas gordas castanhas temperadas': { name: 'Azeitonas' },
  'Chocos Congelados': { name: 'Chocos', section: 'Peixaria' },
  'Cenouras rodelas doces finas': { name: 'Cenoura', unit: 'un' },
  'Polpa de Tomate caseira': { name: 'Polpa de tomate' },
  'Polpa de Tomate': { name: 'Polpa de tomate' },
  'Polpa de tomate com óregãos': { name: 'Polpa de tomate' },
  'Ovos XXL campo': { name: 'Ovos', unit: 'un' },
  'Batata Frita palito óleo sol': { name: 'Batata', unit: 'un', quantity: 3 },
  'Cebola Suada caramelizada e doida doce': { name: 'Cebola', unit: 'un' },
  'Melancia doce sementes extirpadas': { name: 'Melancia' },
  'Iogurte Soja sabor baunilha pó': { name: 'Iogurte de soja baunilha', unit: 'un' },
  'Gelo Calhau': { name: 'Gelo', unit: 'pedras' },
  'Fiambre, queijo e azeitonas picadas miscelânia': { name: 'Fiambre, queijo e azeitonas' },
  'Fatia pão grossa': { name: 'Pão de mistura', unit: 'fatias' },
  'Tomate Maduro esmagado sumo gotejante vermelho e vivo sol': { name: 'Tomate', unit: 'un' },
  'Atum desfeito migalha seca': { name: 'Atum', unit: 'latas' },
  'Pepino fresquíssimo frigorífico': { name: 'Pepino', unit: 'un' },
  'Sal Fino': { name: 'Sal fino', unit: 'pitada' },
  'Massa Laços ou Búzios grande gigante': { name: 'Massa' },
  'Milho Doce Lata': { name: 'Milho', unit: 'lata' },
  'Maçã madura e podre amolecer velha fruteira esquecida mosquitos': { name: 'Maçã madura', unit: 'un' },
  'Canela em abundância montanhas': { name: 'Canela', unit: 'c. chá' },
  'Tomate em rodelas': { name: 'Tomate', unit: 'un' },
  'Rodelas de tomate': { name: 'Tomate', unit: 'un' },
  'Tofu': { section: 'Alternativas Vegetais' },
  'Tofu firme': { section: 'Alternativas Vegetais' },
  'Camarão': { section: 'Peixaria' },
  'Camarão congelado': { name: 'Camarão', section: 'Peixaria' },
  'Ervilhas': { section: 'Frutas e Legumes' },
  'Ervilhas congeladas': { name: 'Ervilhas', section: 'Frutas e Legumes' },
  'Cebola picada refugada': { name: 'Cebola', unit: 'un' },
  'Tris de bacon': { name: 'Bacon em tiras' },
  'Aperitivo Laranja Famoso': { name: 'Aperitivo Laranja' }
};

const regexQuantityUnit = /(name:\s*)"([^"]+)"(,\s*quantity:\s*)([^,]+)(,\s*unit:\s*)"([^"]+)"(,\s*section:\s*)"([^"]+)"/g;

files.forEach(f => {
  let content = fs.readFileSync(path.join(dataDir, f), 'utf8');

  // Replace full ingredient objects
  content = content.replace(regexQuantityUnit, (match, p1, name, p3, qty, p5, unit, p7, section) => {
    let newName = name;
    let newQty = qty;
    let newUnit = unit;
    let newSection = section;

    const repl = replacements[name] || {};
    if (repl.name) newName = repl.name;
    if (repl.unit) newUnit = repl.unit;
    if (repl.quantity) newQty = repl.quantity;
    if (repl.section) newSection = repl.section;

    if (newName.toLowerCase() === 'tofu' || newName.toLowerCase() === 'tofu firme') {
      newSection = 'Alternativas Vegetais';
    }
    if (newName.toLowerCase() === 'camarão' || newName.toLowerCase().includes('camarão congelado')) {
      newName = 'Camarão';
      newSection = 'Peixaria';
    }
    if (newName.toLowerCase() === 'ervilhas' || newName.toLowerCase().includes('ervilha')) {
      newName = 'Ervilhas';
      newSection = 'Frutas e Legumes';
    }
    if (newName.toLowerCase().includes('tomate') && newName.toLowerCase().includes('rodelas')) {
       newName = 'Tomate';
       newUnit = 'un';
    }

    return `${p1}"${newName}"${p3}${newQty}${p5}"${newUnit}"${p7}"${newSection}"`;
  });

  fs.writeFileSync(path.join(dataDir, f), content);
});
