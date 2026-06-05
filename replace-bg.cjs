const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'Features.tsx',
  'Pricing.tsx',
  'Blog.tsx',
  'Documentation.tsx',
  'FAQ.tsx',
  'Contact.tsx',
  'PrivacyPolicy.tsx',
  'Terms.tsx',
  'CookiePolicy.tsx',
  'Security.tsx'
];

const basePath = path.join('d:', 'AUX-Projects', 'VedTecho - Frontend MVP', 'VedTechno-main', 'src', 'pages');

filesToUpdate.forEach(file => {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace section class
  content = content.replace(/<section className="[^"]*bg-secondary relative overflow-hidden">/, '<section className="relative pt-24 md:pt-32 pb-16 bg-background overflow-hidden">');
  
  // Replace the hero gradient div with the new grid
  const newGrid = `{/* Subtle background grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.4,
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />`;
  content = content.replace(/<div className="absolute inset-0 bg-hero-gradient opacity-80" \/>/, newGrid);

  // Replace text-white with text-foreground specifically in the hero section. 
  // It's safer to only replace text-white in h1 and p tags in the hero.
  // Actually, wait, doing a global replace of text-white in these files might break other sections that need text-white (like primary buttons).
  // Let's use a regex to replace text-white but only around the h1 and p right after the hero.
  content = content.replace(/<h1 className="([^"]*)text-white([^"]*)">/g, '<h1 className="$1text-foreground$2">');
  content = content.replace(/<p className="([^"]*)text-white\/60([^"]*)">/g, '<p className="$1text-muted-foreground$2">');
  content = content.replace(/<p className="([^"]*)text-white\/80([^"]*)">/g, '<p className="$1text-muted-foreground$2">');
  content = content.replace(/<p className="([^"]*)text-white\/90([^"]*)">/g, '<p className="$1text-muted-foreground$2">');

  // Badges
  content = content.replace(/!bg-primary\/20 !text-blue-300 !border-blue-500\/30/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
