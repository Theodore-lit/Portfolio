import { GitBranch, Database, FileCode } from 'lucide-react'; 
// Note : Remplace les textes par des balises <img> avec tes propres logos SVG à terme !

export default function StackMarquee() {
  const languages = ['JavaScript', 'TypeScript', 'PHP', 'Python', 'SQL', 'HTML', 'CSS'];
  const frameworks = ['Laravel', 'Vue.js', 'React', 'Node.js', 'Express', 'TailwindCSS'];
  const tools = ['Git', 'MongoDB', 'PostgreSQL', 'Supabase', 'Docker', 'VS Code'];

  // Fonction utilitaire pour générer une ligne qui défile
  const MarqueeRow = ({ items, reverse = false }: { items: string[], reverse?: boolean }) => {
    return (
      <div className="w-full overflow-hidden py-2 select-none flex">
        <div className={`flex gap-6 whitespace-nowrap min-w-full animate-[marquee_25s_linear_infinite] ${reverse ? '[animation-direction:reverse]' : ''}`}>
          {/* Bloc 1 */}
          <div className="flex justify-around gap-6 min-w-full">
            {items.map((item, idx) => (
              <div key={`item-1-${idx}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-medium shadow-[var(--shadow-elegant)]">
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Bloc 2 (Doublure exacte pour l'effet infini) */}
          <div className="flex justify-around gap-6 min-w-full" aria-hidden="true">
            {items.map((item, idx) => (
              <div key={`item-2-${idx}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-medium shadow-[var(--shadow-elegant)]">
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-background overflow-hidden relative">
      {/* Effet d'ombrage fondu sur les côtés gauche et droit (comme sur ton image) */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* <div className="max-w-5xl mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Ma Stack Technique</h2>
        <p className="text-muted-foreground mt-2">Les technologies que j'utilise au quotidien</p>
      </div> */}

      <div className="flex flex-col gap-4 max-w-[1200px] mx-auto">
        {/* Ligne 1 : Langages (Défilement normal) */}
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-4 block mb-2">Languages</span>
          <MarqueeRow items={languages} />
        </div>

        {/* Ligne 2 : Frameworks (Défilement inversé pour donner du dynamisme) */}
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
      <style>{`
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
`}</style>
    </section>
  );
}