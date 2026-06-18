const fs = require('fs');
const path = require('path');

function processFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Replace types (just in case they are somewhere)
      content = content.replace(/\|\s*"Frescos"/g, '');
      content = content.replace(/\|\s*"Frio"/g, '');
      content = content.replace(/\|\s*"Despensa"/g, '');

      // Sections
      content = content.replace(/section:\s*"Despensa"/g, 'section: "Mercearia"');
      content = content.replace(/section:\s*"Frescos"/g, 'section: "Frutas e Legumes"');
      content = content.replace(/section:\s*"Frio"/g, 'section: "Laticínios e Ovos"');

      // Ingredients
      content = content.replace(/name:\s*"Queijo mozarela"/gi, 'name: "Queijo mozzarella"');
      content = content.replace(/name:\s*"Queijo mozarela light ralado"/gi, 'name: "Queijo mozzarella ralado"');
      content = content.replace(/name:\s*"Queijo Mozzarella Ralado"/gi, 'name: "Queijo mozzarella ralado"');
      content = content.replace(/name:\s*"Mozzarella fresca"/gi, 'name: "Queijo mozzarella fresco"');
      content = content.replace(/name:\s*"Queijo Mozzarella fresco"/gi, 'name: "Queijo mozzarella fresco"');
      content = content.replace(/name:\s*"Ovo"/gi, 'name: "Ovos"');
      content = content.replace(/name:\s*"Ovo cozido"/gi, 'name: "Ovos"');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

// Ensure types.ts is correct
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(/export type Aisle =[\s\S]*?(?=;);/, `export type Aisle =
  | "Frutas e Legumes"
  | "Talho"
  | "Peixaria"
  | "Laticínios e Ovos"
  | "Mercearia"
  | "Congelados"
  | "Padaria";`);
fs.writeFileSync('src/types.ts', types, 'utf8');

processFiles('./src/data');
