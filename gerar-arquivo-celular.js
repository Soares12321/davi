const fs = require('node:fs');
const path = require('node:path');

const folder = path.join(__dirname, 'dist');
const squares = [];
const addSquare = (x, y) => squares.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
function finder(x, y) {
  for (let dy = 0; dy < 7; dy++) for (let dx = 0; dx < 7; dx++) {
    if (dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)) addSquare(x + dx, y + dy);
  }
}
finder(1, 1); finder(21, 1); finder(1, 21);
for (let y = 1; y < 28; y++) for (let x = 1; x < 28; x++) {
  if ((x <= 8 && y <= 8) || (x >= 20 && y <= 8) || (x <= 8 && y >= 20)) continue;
  if ((x * 17 + y * 23 + x * y * 7) % 11 < 5) addSquare(x, y);
}
fs.writeFileSync(path.join(folder, 'qr-demo.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><rect width="29" height="29" fill="#fff"/><g fill="#000">${squares.join('')}</g></svg>`);
let html = fs.readFileSync(path.join(folder, 'index.html'), 'utf8');
const assets = {
  'foto-davi.jpeg': 'image/jpeg',
  'tree.svg': 'image/svg+xml',
  'logo-uel.svg': 'image/svg+xml',
  'qr-demo.svg': 'image/svg+xml',
};

for (const [file, type] of Object.entries(assets)) {
  const bytes = fs.readFileSync(path.join(folder, file));
  html = html.replaceAll(`src="${file}"`, `src="data:${type};base64,${bytes.toString('base64')}"`);
}
html = html.replace(/\s*<link rel="manifest" href="manifest\.webmanifest">/, '');
fs.writeFileSync(path.join(__dirname, 'portal-davi-celular.html'), html);
console.log('Arquivo para celular criado: portal-davi-celular.html');
