const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'features', 'dashboard');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Dashboard.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace flex items-center justify-between to be responsive
  content = content.replace(/className="flex items-center justify-between"/g, 'className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} headers`);
});
