import { GitBranch, Database, FileCode } from 'lucide-react'; 
// Note : Remplace les textes par des balises <img> avec tes propres logos SVG à terme !

export default function StackMarquee() {
  // Tableaux mis à jour avec les URL des logos SVG officiels (Devicon & Simple Icons)
  const languages = [
    { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'PHP', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'SQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' }, // Logo MySQL/SQL
    { name: 'HTML', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  ];

  const frameworks = [
    { name: 'Laravel', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
    { name: 'Vue.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { name: 'React', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'TailwindCSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  ];

  const tools = [
    { name: 'Git/Github', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'MongoDB', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'PostgreSQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Supabase', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/supabase.svg' }, // SVG officiel vert de Supabase
    { name: 'Renger', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/render.svg' }, // Correspond à Render.com
    { name: 'VS Code', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  ];

  // Définition du type pour les éléments de la stack
  interface StackItem {
    name: string;
    iconUrl: string;
  }

  // Fonction utilitaire pour générer une ligne qui défile (Inchangée à part l'intégration de la balise img)
  const MarqueeRow = ({ items, reverse = false }: { items: StackItem[], reverse?: boolean }) => {
    return (
      <div className="w-full overflow-hidden py-2 select-none flex">
        <div className={`flex md:gap-6 gap-60 whitespace-nowrap min-w-full animate-marquee hover:pause ${reverse ? 'direction-reverse' : ''}`}>
          
          {/* Bloc 1 */}
          <div className="flex justify-around gap-5 min-w-full">
            {items.map((item, idx) => (
              <div key={`item-1-${idx}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-medium shadow-(--shadow-elegant)">
                <img 
                  src={item.iconUrl} 
                  alt={`${item.name} logo`}
                  className="w-5 h-5 object-contain" 
                  loading="lazy"
                />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Bloc 2 (Doublure exacte pour l'effet infini) */}
          <div className="flex justify-around gap-5 min-w-full" aria-hidden="true">
            {items.map((item, idx) => (
              <div key={`item-2-${idx}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-medium shadow-(--shadow-elegant)">
                <img 
                  src={item.iconUrl} 
                  alt={`${item.name} logo`} 
                  className="w-5 h-5 object-contain" 
                  loading="lazy"
                />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-background overflow-hidden relative">
      {/* Effet d'ombrage fondu sur les côtés gauche et droit */}
      <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-4 max-w-[1200px] mx-auto">
        {/* Ligne 1 : Langages (Défilement normal) */}
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-4 block mb-2">Languages</span>
          <MarqueeRow items={languages} />
        </div>

        {/* Ligne 2 : Frameworks (Défilement inversé) */}
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-4 block mb-2">Frameworks & Librairies</span>
          <MarqueeRow items={frameworks} reverse={true} />
        </div>

        {/* Ligne 3 : Outils (Défilement normal) */}
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-4 block mb-2">Outils & Databases</span>
          <MarqueeRow items={tools} />
        </div>
      </div>
    </section>
  );
}