const fs = require('fs');
const path = require('path');
let parser;
try {
  parser = require('@babel/parser');
} catch (e) {
  console.error('No se encontró @babel/parser en node_modules.');
  process.exit(1);
}
const file = path.resolve(__dirname, '..', 'src', 'screens', 'MissionsScreen.jsx');
const code = fs.readFileSync(file, 'utf8');
try {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'classProperties',
      'optionalChaining',
      'nullishCoalescingOperator',
      'objectRestSpread',
      'decorators-legacy'
    ]
  });
  console.log('Parse OK — No syntax errors detected by @babel/parser');
} catch (err) {
  console.error('Parse Error:', err.message);
  if (err.loc) {
    const lines = code.split(/\r?\n/);
    const L = err.loc.line;
    const start = Math.max(1, L - 5);
    const end = Math.min(lines.length, L + 5);
    console.error('\nContexto (líneas ' + start + '-' + end + '):\n');
    for (let i = start; i <= end; i++) {
      const line = lines[i-1];
      console.error((i === L ? '>> ' : '   ') + i.toString().padStart(4) + ' | ' + line);
    }
  }
  process.exit(2);
}
