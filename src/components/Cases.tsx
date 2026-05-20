import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
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

interface CasesProps {
  items?: any[];
  lang?: 'es' | 'en';
}

export function Cases({ items, lang }: CasesProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  
  const currentLang = lang || language;

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
    <section id="proyectos" className="pt-[250px] pb-24 relative overflow-x-hidden bg-muted/40 font-sans">
      <div className="container mx-auto px-6">
        <div className="mb-16">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-4" />
            <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
        </div>
        <div className="flex flex-col gap-12">
            {[1, 2].map(i => <ProjectCardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );
  return (
    <section id="proyectos" className="pt-[250px] pb-24 relative overflow-x-hidden bg-muted/40">
      <div className="container mx-auto px-6">
        {!items && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex justify-between items-center"
          >
            <div>
              <h2 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-4">{t('cases.eyebrow')}</h2>
              <h3 className="text-4xl md:text-5xl font-serif">{t('cases.title')}</h3>
            </div>
            <button className="footer-gradient-button hidden md:inline-flex items-center gap-2 text-sm font-medium px-8 py-3 rounded-full hover:bg-muted transition-all group/all">
              <span className="relative z-10 flex items-center gap-2">
                {t('cases.viewAll')} <ArrowUpRight size={16} className="group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </motion.div>
        )}

        <div className="flex flex-col gap-12">
          {projects.map((c, i) => {
            const titleValue = tProjectField(c, 'title', currentLang);
            const descValue = tProjectField(c, 'description', currentLang) || tProjectField(c, 'subtitle', currentLang);
            const imageValue = c.cover_url || "";
            const tagsValue = c.tags || [];

            return (
              <motion.div 
                key={c.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                {/* Image Section */}
                <div className="md:col-span-7 overflow-hidden rounded-2xl md:rounded-[32px] bg-muted relative aspect-[4/3] md:aspect-video border border-border/50 shadow-sm">
                  <img 
                    src={imageValue} 
                    alt={titleValue}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-in-out grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </div>

                {/* Content Section */}
                <div className="md:col-span-5 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tagsValue.map(tag => (
                      <span key={tag} className="px-3 py-1 text-xs border border-border rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="text-3xl md:text-4xl font-serif mb-4 group-hover:text-accent transition-colors duration-300">
                    {titleValue}
                  </h4>
                  
                  <p className="text-muted-foreground leading-relaxed font-sans font-light text-sm md:text-base mb-6">
                    {descValue}
                  </p>

                  {tProjectArr(c, 'highlights', currentLang).length > 0 && (
                    <ul className="mb-8 space-y-2">
                      {tProjectArr(c, 'highlights', currentLang).map((h, i) => (
                        <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button className="w-fit flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:text-accent transition-colors">
                    {t('cases.explore')} <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><ArrowUpRight size={16} /></span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {!items && (
          <div className="mt-12 md:hidden">
              <button className="footer-gradient-button w-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted transition-all py-4 rounded-full group/mob">
                <span className="relative z-10 flex items-center gap-2">
                  {t('cases.viewAll')} <ArrowUpRight size={16} className="group-hover/mob:translate-x-0.5 group-hover/mob:-translate-y-0.5 transition-transform" />
                </span>
              </button>
          </div>
        )}
      </div>
    </section>
  );
}
