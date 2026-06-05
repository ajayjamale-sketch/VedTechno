const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx,css}');

let totalReplaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/\bbg-blue-600\b/g, 'bg-primary')
    .replace(/\btext-blue-600\b/g, 'text-primary')
    .replace(/\bborder-blue-600\b/g, 'border-primary')
    .replace(/\bbg-blue-700\b/g, 'bg-primary/90')
    .replace(/\bhover:bg-blue-700\b/g, 'hover:bg-primary/90')
    .replace(/\bhover:bg-blue-50\b/g, 'hover:bg-primary/10')
    .replace(/\bhover:text-blue-600\b/g, 'hover:text-primary')
    .replace(/\bshadow-blue-600\b/g, 'shadow-primary')
    .replace(/\btext-blue-400\b/g, 'text-primary/80')
    .replace(/\bdark:text-blue-400\b/g, 'dark:text-primary/80')
    
    .replace(/\bbg-emerald-600\b/g, 'bg-accent')
    .replace(/\btext-emerald-600\b/g, 'text-accent')
    .replace(/\bborder-emerald-600\b/g, 'border-accent')
    .replace(/\bbg-emerald-700\b/g, 'bg-accent/90')
    .replace(/\bhover:bg-emerald-700\b/g, 'hover:bg-accent/90')
    .replace(/\bhover:bg-emerald-50\b/g, 'hover:bg-accent/10')
    .replace(/\bhover:text-emerald-600\b/g, 'hover:text-accent')
    .replace(/\bshadow-emerald-600\b/g, 'shadow-accent')
    .replace(/\btext-emerald-500\b/g, 'text-accent')
    .replace(/\bbg-emerald-500\b/g, 'bg-accent')
    
    // Convert role colors in Dashboard to primary/accent
    .replace(/\bbg-indigo-600\b/g, 'bg-primary')
    .replace(/\bbg-orange-600\b/g, 'bg-accent')
    .replace(/\bbg-violet-600\b/g, 'bg-primary')
    .replace(/\bbg-pink-600\b/g, 'bg-accent')
    .replace(/\bbg-red-600\b/g, 'bg-primary');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    totalReplaced++;
  }
});

console.log(`Replaced colors in ${totalReplaced} files.`);
