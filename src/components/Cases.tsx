import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";

interface Case {
  id: string;
  title: string;
  tags: string[];
  description: string;
  image: string;
}

interface CasesProps {
  items?: any[];
}

export function Cases({ items }: CasesProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items) {
      setCases(items.map(c => ({
          id: c.id,
          title: c.title,
          tags: c.tags || [],
          description: c.subtitle || c.description || "",
          image: c.cover_url || ""
      })));
      setLoading(false);
      return;
    }

    async function fetchCases() {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, title, tags, description, cover_url')
        .eq('visible', true)
        .order('sort_order', { ascending: true });
      
      if (data) {
        setCases(data.map(c => ({
            id: c.id,
            title: c.title,
            tags: c.tags || [],
            description: c.description || "",
            image: c.cover_url || ""
        })));
      }
      setLoading(false);
    }
    fetchCases();
  }, [items]);

  if (loading) return (
    <section id="proyectos" className="py-24 relative overflow-x-hidden bg-muted/40">
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
    <section id="proyectos" className="py-24 relative overflow-x-hidden bg-muted/40">
      <div className="container mx-auto px-6">
        {!items && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex justify-between items-center"
          >
            <div>
              <h2 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-4">Trabajo Reciente</h2>
              <h3 className="text-4xl md:text-5xl font-serif">Proyectos e Impacto</h3>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm font-medium px-6 py-3 border border-border rounded-full hover:bg-muted transition-colors group/all">
              Ver Todos los Proyectos <ArrowUpRight size={16} className="group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}

        <div className="flex flex-col gap-12">
          {cases.map((c, i) => (
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
                  src={c.image} 
                  alt={c.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-in-out grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </div>

              {/* Content Section */}
              <div className="md:col-span-5 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-6">
                  {c.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs border border-border rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h4 className="text-3xl md:text-4xl font-serif mb-4 group-hover:text-accent transition-colors duration-300">
                  {c.title}
                </h4>
                
                <p className="text-muted-foreground leading-relaxed font-sans font-light text-sm md:text-base mb-8">
                  {c.description}
                </p>

                <button className="w-fit flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:text-accent transition-colors">
                  Explorar Proyecto <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><ArrowUpRight size={16} /></span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {!items && (
          <div className="mt-12 md:hidden">
              <button className="w-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted transition-colors py-3 border border-border rounded-full group/mob">
                Ver Todos los Proyectos <ArrowUpRight size={16} className="group-hover/mob:translate-x-0.5 group-hover/mob:-translate-y-0.5 transition-transform" />
              </button>
          </div>
        )}
      </div>
    </section>
  );
}
