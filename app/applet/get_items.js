const fs = require('fs');
const files = fs.readdirSync('./src/data');
let aisles = {};
let names = new Set();
files.forEach(f => {
  if (f.endsWith('.ts')) {
    const text = fs.readFileSync('./src/data/' + f, 'utf8');
    let m;
    const re = /section:\s*"([^"]+)"/g;
    while(m = re.exec(text)) {
      aisles[m[1]] = (aisles[m[1]] || 0) + 1;
    }
    
    let m2;
    const re2 = /name:\s*"([^"]+)"/g;
    while((m2 = re2.exec(text))) { names.add(m2[1]); }
  }
});
console.log("AISLES:", aisles);
console.log("Mozzarella/Queijo/Ovos matches:");
Array.from(names).filter(n => n.toLowerCase().includes('moza') || n.toLowerCase().includes('mozz') || n.toLowerCase().includes('queijo') || n.toLowerCase().includes('ovo') || n.toLowerCase().includes('fiambre')).forEach(n => console.log(n));
