import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

import { patchProjects } from "../lib/projectUtils";
import { InteractiveProjects } from "./InteractiveProjects";

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
    <section id="proyectos" className="pt-[300px] md:pt-[250px] pb-0 relative overflow-x-hidden bg-muted/40 font-sans">
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
        
        {/* Carousel Skeleton */}
        <div className="w-full h-[550px] md:h-[680px] lg:h-[720px] relative rounded-3xl animate-pulse flex items-center justify-center overflow-hidden">
            {/* Header Overlay Placeholder */}
            <div className="absolute top-0 inset-x-0 z-30 w-full p-6 md:p-12">
               <div className="h-16 w-3/4 bg-neutral-600/50 rounded-lg mb-4" />
               <div className="flex gap-2">
                 <div className="h-6 w-24 bg-neutral-600/50 rounded-full" />
                 <div className="h-6 w-24 bg-neutral-600/50 rounded-full" />
               </div>
            </div>
            
            {/* Footer Placeholder */}
            <div className="absolute bottom-0 inset-x-0 z-30 w-full p-6 md:p-12">
               <div className="h-24 w-full md:w-1/2 bg-neutral-600/50 rounded-lg mb-8" />
               <div className="flex gap-3 mt-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 w-20 bg-neutral-600/50 rounded" />
                  ))}
               </div>
            </div>
        </div>
      </div>
    </section>
  );

  return (
    <section id="proyectos" className="pt-[300px] md:pt-[250px] pb-0 relative overflow-x-hidden bg-muted/40">
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

          </motion.div>
        )}
      </div>

      <div className="w-full">
        <InteractiveProjects />
      </div>



    </section>
  );
}

