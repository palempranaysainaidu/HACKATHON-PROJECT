const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/organizer/EventManagement.jsx',
  'src/pages/organizer/CreateEvent.jsx',
  'src/components/organizer/TaskKanban.jsx',
  'src/components/organizer/BudgetTable.jsx',
  'src/components/organizer/VolunteerManager.jsx',
  'src/components/organizer/OrganizerUpdates.jsx',
  'src/pages/volunteer/VolunteerWorkspace.jsx',
  'src/pages/AuthPage.jsx' // Note: Though we have an AuthModal, if the old AuthPage is ever hit it should look decent
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace text colors
  content = content.replace(/\btext-brand-black\b/g, 'text-brand-white');
  content = content.replace(/\btext-brand-dark\b/g, 'text-brand-light');

  // Replace backgrounds
  // We don't want to replace bg-white/5 if it exists in these files, but they don't have it.
  content = content.replace(/\bbg-brand-white\b/g, 'bg-brand-card');
  content = content.replace(/\bbg-white\b/g, 'bg-brand-surface border border-brand-border');

  // Replace old dark buttons with the new btn-gold class (simplification)
  // Old buttons were bg-brand-black hover:bg-black text-white px-X py-Y...
  // For safety, let's just replace the color utility classes individually.
  content = content.replace(/\bbg-brand-black\b/g, 'bg-brand-accent hover:bg-brand-accentHov');
  content = content.replace(/\btext-white\b/g, 'text-brand-bg'); 
  content = content.replace(/\bhover:bg-black\b/g, ''); // strip it since accentHov handles it

  // Border colors
  content = content.replace(/\bborder-brand-black\b/g, 'border-brand-accent');
  content = content.replace(/\bhover:border-brand-black\b/g, 'hover:border-brand-accent');
  content = content.replace(/\bfocus:border-brand-black\b/g, 'focus:border-brand-accent');
  content = content.replace(/\bhover:text-brand-black\b/g, 'hover:text-brand-accent');

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});
