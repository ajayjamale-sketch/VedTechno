const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'AUX-Projects', 'VedTecho - Frontend MVP', 'VedTechno-main', 'src', 'components', 'features', 'dashboard');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Dashboard.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace grid-cols-2 without sm:
  content = content.replace(/className="grid grid-cols-2 lg:grid-cols-4/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
  content = content.replace(/className="grid grid-cols-2 gap-3/g, 'className="grid grid-cols-1 sm:grid-cols-2 gap-3');
  content = content.replace(/className="grid grid-cols-2 gap-4/g, 'className="grid grid-cols-1 sm:grid-cols-2 gap-4');
  content = content.replace(/className="grid grid-cols-3 gap-3/g, 'className="grid grid-cols-1 sm:grid-cols-3 gap-3');
  content = content.replace(/className="grid grid-cols-2 gap-5/g, 'className="grid grid-cols-1 sm:grid-cols-2 gap-5');
  
  // Replace flex items-center justify-between to be responsive
  content = content.replace(/className="flex items-center justify-between mb-4"/g, 'className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"');
  content = content.replace(/className="flex items-center justify-between mb-6"/g, 'className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"');
  content = content.replace(/className="flex items-center justify-between mb-5"/g, 'className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Dashboards updated to be fully responsive.');
