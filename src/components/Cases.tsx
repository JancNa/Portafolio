import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

import { patchProjects } from "../lib/projectUtils";

export type PortfolioProject = {
  id: string;
  slug: string;
  category: string;
  tags: string[];
  cover_url: string | null;
  demo_url: string | null;
  case_url: string | null;
  technologies: string[];
  year: number | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  // ES
  title: string;
  subtitle: string | null;
  description: string;
  highlights: string[];
  // EN
  title_en: string | null;
  subtitle_en: string | null;
  description_en: string | null;
  highlights_en: string[] | null;
};

type Lang = 'es' | 'en';

export function tProjectField(project: PortfolioProject, field: 'title' | 'subtitle' | 'description', lang: Lang): string {
  if (lang === 'en') {
    const val = project[`${field}_en`];
    if (val && val.trim() !== '') return val;
  }
  return project[field] ?? '';
}

export function tProjectArr(project: PortfolioProject, field: 'highlights', lang: Lang): string[] {
  if (lang === 'en') {
    const val = project[`${field}_en`];
    if (val && val.length > 0) return val;
  }
  return project[field] ?? [];
}

import { DraggableCardContainer, DraggableCardBody } from "./ui/draggable-card";

const scatterPositions = [
  { left: "4%", top: "6%", rotate: -6 },
  { left: "34%", top: "4%", rotate: 5 },
  { left: "64%", top: "8%", rotate: -4 },
  { left: "10%", top: "42%", rotate: 8 },
  { left: "38%", top: "35%", rotate: -5 },
  { left: "62%", top: "44%", rotate: 6 },
  { left: "76%", top: "18%", rotate: -8 },
];

interface CasesProps {
  items?: any[];
  lang?: 'es' | 'en';
}

export function Cases({ items, lang }: CasesProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const sandboxRef = useRef<HTMLDivElement>(null);
  
  const currentLang = lang || language;

  // Shared transition configuration for standardizing Framer Motion layouts
  const sharedLayoutTransition = {
    type: "spring" as const,
    damping: 32,
    stiffness: 180,
    mass: 0.9
  };

  useEffect(() => {
    if (items) {
      setProjects(patchProjects(items));
      setLoading(false);
      return;
    }

    async function fetchCases() {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, slug, category, tags, cover_url, demo_url, case_url, technologies, year, featured, visible, sort_order, title, subtitle, description, highlights, title_en, subtitle_en, description_en, highlights_en')
        .eq('visible', true)
        .order('sort_order', { ascending: true });
      
      if (data) {
        const patchedData = patchProjects(data);
        setProjects(patchedData);
      }
      setLoading(false);
    }
    fetchCases();
  }, [items]);

  if (loading) return (
    <section id="proyectos" className="pt-[300px] md:pt-[250px] pb-24 relative overflow-x-hidden bg-muted/40 font-sans">
      <div className="w-full lg:max-w-[90%] mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded mb-3" />
            <div className="h-12 w-64 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            <div className="mt-3 space-y-2 max-w-xl">
              <div className="h-4 w-full bg-neutral-200/80 dark:bg-neutral-800/80 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-neutral-200/80 dark:bg-neutral-800/80 animate-pulse rounded" />
            </div>
          </div>
          <div className="h-11 w-44 bg-neutral-200 dark:bg-neutral-800/60 animate-pulse rounded-[12px] hidden md:block" />
        </div>
        <div className="w-full h-[550px] md:h-[680px] lg:h-[720px] relative rounded-3xl bg-muted/5 flex items-center justify-center select-none cursor-default overflow-hidden">
          {/* Ambient Gray Logo in Background */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08] dark:opacity-[0.035] select-none filter grayscale contrast-75 saturate-0">
            <img 
              src="https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Logo%20navbar.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvTG9nbyBuYXZiYXIucG5nIiwiaWF0IjoxNzc2NzM5ODQxLCJleHAiOjE4MDgyNzU4NDF9.OkKJucAe4EDknoq8qH5lM8kmK5e6vYGa0XdVjsSF8PM" 
              alt="Logo" 
              className="h-24 md:h-36 lg:h-44 w-auto object-contain select-none opacity-60"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Draggable Sandbox Mock Cards */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Mock Card 1 - Left angled */}
            <div 
              className="absolute bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg animate-pulse"
              style={{
                width: "180px",
                height: "240px",
                top: "22%",
                left: "15%",
                transform: "rotate(-6deg)",
              }}
            >
              <div className="w-full h-[70%] bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-3" />
              <div className="space-y-2 px-2">
                <div className="h-3 w-3/4 bg-neutral-240 dark:bg-neutral-700 rounded" />
                <div className="h-3 w-1/2 bg-neutral-240 dark:bg-neutral-700 rounded" />
              </div>
            </div>

            {/* Mock Card 2 - Center stacked */}
            <div 
              className="absolute bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl animate-pulse"
              style={{
                width: "200px",
                height: "260px",
                top: "35%",
                left: "45%",
                transform: "rotate(4deg)",
              }}
            >
              <div className="w-full h-[70%] bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-3" />
              <div className="space-y-2 px-2">
                <div className="h-3.5 w-5/6 bg-neutral-240 dark:bg-neutral-700 rounded" />
                <div className="h-3 w-3/5 bg-neutral-240 dark:bg-neutral-700 rounded" />
              </div>
            </div>

            {/* Mock Card 3 - Right angled high */}
            <div 
              className="absolute bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg animate-pulse"
              style={{
                width: "185px",
                height: "245px",
                top: "18%",
                right: "12%",
                transform: "rotate(-12deg)",
              }}
            >
              <div className="w-full h-[70%] bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-3" />
              <div className="space-y-2 px-2">
                <div className="h-3 w-4/5 bg-neutral-240 dark:bg-neutral-700 rounded" />
                <div className="h-3 w-1/2 bg-neutral-240 dark:bg-neutral-700 rounded" />
              </div>
            </div>

            {/* Mock Card 4 - Right bottom */}
            <div 
              className="absolute bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg animate-pulse hidden md:block"
              style={{
                width: "175px",
                height: "235px",
                bottom: "15%",
                right: "25%",
                transform: "rotate(8deg)",
              }}
            >
              <div className="w-full h-[70%] bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-2" />
              <div className="space-y-2 px-2">
                <div className="h-3 w-2/3 bg-neutral-240 dark:bg-neutral-700 rounded" />
                <div className="h-3 w-1/3 bg-neutral-240 dark:bg-neutral-700 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* View all (loading placeholder) on mobile - centered below workspace */}
        <div className="flex justify-center mt-8 md:hidden">
          <div className="h-11 w-44 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-[12px]" />
        </div>
      </div>
    </section>
  );

  return (
    <section id="proyectos" className="pt-[300px] md:pt-[250px] pb-24 relative overflow-x-hidden bg-muted/40">
      <div className="w-full lg:max-w-[90%] mx-auto px-6">
        {!items && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6"
          >
            <div>
              <h2 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-3">{t('cases.eyebrow')}</h2>
              <h3 className="text-4xl md:text-5xl font-serif">{t('cases.title')}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-3 max-w-xl font-light">
                {currentLang === 'es' 
                  ? 'Arrastra, sacude, rota y apila las portadas de los proyectos libremente sobre la pizarra. Haz click en cualquier tarjeta para explorarla.' 
                  : 'Drag, flick, rotate, and stack project covers freely inside the board. Click on any card to explore further.'}
              </p>
            </div>
            <button className="footer-gradient-button hidden md:inline-flex items-center gap-2 text-foreground group/all self-start md:self-auto w-fit">
              <span className="relative z-10 flex items-center gap-2 text-sm">
                {t('cases.viewAll') || (currentLang === 'es' ? 'Ver todos los proyectos' : 'View all projects')} <ArrowUpRight size={16} className="group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </motion.div>
        )}

        {/* Draggable Playground workspace */}
        <div 
          ref={sandboxRef} 
          className="w-full h-[550px] md:h-[680px] lg:h-[720px] relative rounded-3xl bg-muted/5 overflow-visible flex items-center justify-center select-none cursor-default"
          style={{
            backgroundImage: 'radial-gradient(ellipse at center, rgba(var(--accent-rgb), 0.03) 0%, transparent 70%)',
          }}
        >
          {/* Ambient pattern grid or instruction text: Gray logo */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08] dark:opacity-[0.035] select-none filter grayscale contrast-75 saturate-0">
            <img 
              src="https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Logo%20navbar.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvTG9nbyBuYXZiYXIucG5nIiwiaWF0IjoxNzc2NzM5ODQxLCJleHAiOjE4MDgyNzU4NDF9.OkKJucAe4EDknoq8qH5lM8kmK5e6vYGa0XdVjsSF8PM" 
              alt="Logo" 
              className="h-24 md:h-36 lg:h-44 w-auto object-contain select-none opacity-60"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="pointer-events-none absolute bottom-4 text-center text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            {currentLang === 'es' ? '← Sostén y arrastra con el cursor o el dedo | Click para abrir →' : '← Click & Drag to throw | Click to open →'}
          </div>

          <DraggableCardContainer className="absolute inset-0 w-full h-full overflow-visible">
            {projects.map((project, idx) => {
              const pos = scatterPositions[idx % scatterPositions.length];
              return (
                <DraggableCardBody
                  key={`sandbox-${project.id}`}
                  layoutId={`sandbox-card-${project.id}`}
                  transitionProp={sharedLayoutTransition}
                  dragConstraints={sandboxRef}
                  onClick={() => {
                    setSelectedProject(project);
                  }}
                  style={{
                    left: pos.left,
                    top: pos.top,
                  }}
                  className="absolute w-[180px] h-[240px] md:w-[280px] md:h-[370px] lg:w-[320px] lg:h-[420px] cursor-grab active:cursor-grabbing rounded-[12px] overflow-hidden border border-zinc-800 bg-background/40 backdrop-blur-md shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:shadow-2xl transition-[border-color,box-shadow,background-color] duration-300 flex flex-col z-10 group"
                >
                  {/* Purple/Orange gradient diagonal borders on hover */}
                  <div className="absolute inset-0 rounded-[12px] border border-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />
                  <div className="absolute inset-0 rounded-[12px] border border-orange-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 [clip-path:polygon(0_100%,_100%_100%,_100%_0)]" />

                  {/* Cover image (approx 70% height) with rounded corners in 4 corners */}
                  <motion.div 
                    layoutId={`sandbox-cover-${project.id}`}
                    transition={sharedLayoutTransition}
                    className="w-full h-[70%] bg-zinc-900 relative overflow-hidden rounded-[12px] shadow-inner shadow-black/40"
                  >
                    <img
                      src={project.cover_url || ""}
                      alt={tProjectField(project, "title", currentLang)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none pointer-events-none rounded-[12px]"
                    />
                    {/* Inner shadow overlay for premium depth on the image */}
                    <div className="absolute inset-0 pointer-events-none rounded-[12px] shadow-[inset_0_2px_12px_rgba(0,0,0,0.35)]" />
                  </motion.div>
                  
                  {/* Footnote details */}
                  <div className="h-[30%] w-full bg-transparent px-4 py-3 flex flex-col justify-center text-left border-t border-border/15">
                    <div className="flex justify-between items-center text-[8px] md:text-xs font-mono text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground/90 uppercase tracking-widest">{project.category}</span>
                      <span>{project.year || '2026'}</span>
                    </div>
                    <h5 className="font-serif text-[11px] md:text-base font-semibold text-foreground line-clamp-1">
                      {tProjectField(project, "title", currentLang)}
                    </h5>
                    {project.subtitle && (
                      <span className="text-[9px] md:text-xs text-muted-foreground font-light tracking-wide line-clamp-1 mt-0.5">
                        {tProjectField(project, "subtitle", currentLang)}
                      </span>
                    )}
                  </div>
                </DraggableCardBody>
              );
            })}
          </DraggableCardContainer>
        </div>

        {/* Centered button under the sandbox on mobile only */}
        <div className="flex justify-center mt-8 md:hidden">
          <button className="footer-gradient-button inline-flex items-center gap-2 text-foreground group/all w-fit">
            <span className="relative z-10 flex items-center gap-2 text-sm">
              {t('cases.viewAll') || (currentLang === 'es' ? 'Ver todos los proyectos' : 'View all projects')} <ArrowUpRight size={16} className="group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>

               {/* Modal animado para detalles interactivos del proyecto */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                layoutId={`sandbox-card-${selectedProject.id}`}
                transition={sharedLayoutTransition}
                className="relative w-full max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] md:max-h-[85vh] bg-background/40 backdrop-blur-xl border border-border/45 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] flex flex-col md:flex-row text-left origin-center overflow-y-auto md:overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors hover:scale-110"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
 
                {/* Left Column: Cover Image & Floating Details */}
                <motion.div 
                  layoutId={`sandbox-cover-${selectedProject.id}`}
                  transition={sharedLayoutTransition}
                  className="md:w-1/2 h-[220px] md:h-auto min-h-[200px] md:min-h-[450px] bg-zinc-900 border-b md:border-b-0 md:border-r border-border/15 relative overflow-hidden flex-shrink-0"
                >
                  <img
                    src={selectedProject.cover_url || ""}
                    alt={tProjectField(selectedProject, "title", currentLang)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/90 via-background/40 to-transparent mix-blend-multiply opacity-80" />
                  
                  {/* Floating details badge */}
                  <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
                    <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-foreground font-semibold px-2.5 py-1 bg-background/50 border border-border/80 backdrop-blur-sm rounded-full w-fit">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground ml-1">
                      {selectedProject.year || "2026"}
                    </span>
                  </div>
                </motion.div>
 
                {/* Right Column: Project descriptive text & interactive section with Glassmorphism */}
                <motion.div 
                  variants={{
                    initial: { opacity: 0, x: 15 },
                    animate: { opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.35 } },
                    exit: { opacity: 0, x: 15, transition: { duration: 0.15 } }
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto"
                >
                  <div className="space-y-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags?.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 text-[10px] md:text-xs border border-border bg-muted/40 dark:bg-white/5 rounded-full font-medium text-foreground/80">
                          {tag}
                        </span>
                      ))}
                    </div>
 
                    {/* Title */}
                    <div>
                      <h4 className="text-2xl md:text-3xl font-serif text-foreground leading-tight">
                        {tProjectField(selectedProject, "title", currentLang)}
                      </h4>
                      {selectedProject.subtitle && (
                        <p className="text-xs font-mono text-zinc-300 mt-1 tracking-wider uppercase">
                          {tProjectField(selectedProject, "subtitle", currentLang)}
                        </p>
                      )}
                    </div>
 
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed font-sans font-light text-sm">
                      {tProjectField(selectedProject, "description", currentLang)}
                    </p>
 
                    {/* Technologies list */}
                    {selectedProject.technologies?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                          {currentLang === 'es' ? 'Tecnologías Clave:' : 'Key Technologies:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.technologies.map((tech) => (
                            <span key={tech} className="text-[10px] md:text-xs font-mono text-foreground/90 bg-muted/65 dark:bg-white/5 px-2 py-0.5 rounded border border-border dark:border-white/10">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
 
                    {/* Highlights */}
                    {tProjectArr(selectedProject, 'highlights', currentLang).length > 0 && (
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                          {currentLang === 'es' ? 'Aspectos Destacados:' : 'Key Highlights:'}
                        </span>
                        <ul className="space-y-2">
                           {tProjectArr(selectedProject, 'highlights', currentLang).map((h, i) => (
                            <li key={i} className="text-xs text-foreground/85 flex items-start gap-2.5">
                              <span className="text-zinc-400 mt-1 flex-shrink-0">•</span>
                              <span className="font-light">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
 
                  {/* Explore Link buttons with footer-gradient-button style */}
                  <div className="mt-8 pt-6 border-t border-border/10 flex items-center justify-between">
                    <a 
                      href={selectedProject.demo_url || selectedProject.case_url || "#"}
                      target={selectedProject.demo_url || selectedProject.case_url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="footer-gradient-button w-full inline-flex items-center justify-center gap-2 text-foreground text-center group"
                    >
                      <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
                        {t('cases.explore') || (currentLang === 'es' ? 'Explorar Proyecto' : 'Explore Project')} 
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

