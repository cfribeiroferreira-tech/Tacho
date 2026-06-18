const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, 'src', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
  let content = fs.readFileSync(path.join(dataDir, f), 'utf8');

  // Regex to match anything with section: "Congelados"
  content = content.replace(/name:\s*"([^"]+)",([^}]+)section:\s*"Congelados"/g, (match, name, middle) => {
    let newSection = "Mercearia";
    let n = name.toLowerCase();
    
    if (n.includes('bacalhau') || n.includes('pescada') || n.includes('marisco') || n.includes('pota') || n.includes('camarão') || n.includes('peixe')) {
        newSection = "Peixaria";
    } else if (n.includes('mistura asiática') || n.includes('favas') || n.includes('frutos vermelhos') || n.includes('ervilhas') || n.includes('macedónia') || n.includes('brócolos')) {
        newSection = "Frutas e Legumes";
    } else if (n.includes('massa quebrada') || n.includes('massa folhada')) {
        newSection = "Mercearia";
    } else if (n.includes('gelo')) {
        newSection = "Bebidas";
    } else {
        console.log("Unmapped frozen item:", name);
        newSection = "Mercearia"; 
    }

    return `name: "${name}",${middle}section: "${newSection}"`;
  });

  fs.writeFileSync(path.join(dataDir, f), content);
});
console.log('Fixed frozen');
