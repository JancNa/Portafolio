import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

export function Experience() {
  const { t } = useLanguage();
  const roles = t('experience.roles');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(containerRef.current);
    
    // Also set initial height
    const rect = containerRef.current.getBoundingClientRect();
    setHeight(rect.height);
    
    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 80%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section id="experiencia" className="py-24 bg-background border-t border-border/50 overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">{t('experience.title')}</h2>
          <p className="text-muted-foreground">{t('experience.subtitle')}</p>
        </motion.div>

        {/* Timeline container */}
        <div ref={containerRef} className="relative pb-10">
          {/* Scroll-tracked Vertical Line */}
          <div className="absolute md:left-[30px] left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-800 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-[#a855f7] to-[#ea580c] rounded-full origin-top"
            />
          </div>

          <div className="space-y-16">
            {roles.map((role: any, i: number) => (
              <TimelineItem key={i} role={role} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ role, i }: { role: any; i: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of each individual item to detect when the scroll-progress line reaches its indicator dot
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 52%", "start 20%"],
  });

  const [isActive, setIsActive] = useState(false);

  // When scroll path reaches the dot coordinates, we activate the indicator
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsActive(latest >= 0.85);
  });

  return (
    <motion.div 
      ref={itemRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col md:flex-row gap-3 md:gap-4 relative group"
    >
      {/* Sticky Circle Indicator with Year label on Desktop */}
      <div className="sticky flex flex-row items-center top-32 self-start z-40 md:w-[90px] flex-shrink-0">
        {/* Center-aligned Circle on the Vertical Line path with double-layered perfect border */}
        <div className="h-8 w-8 absolute left-[15px] md:left-[30px] -translate-x-1/2 rounded-full bg-background flex items-center justify-center transition-all duration-300 z-50">
          {/* Default Border (fades out when active or hovered) */}
          <div className={`absolute inset-0 rounded-full border border-neutral-200 dark:border-neutral-800/80 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'group-hover:opacity-0'}`} />
          
          {/* Active / Hover Gradient Border Wrapper with solid background mask in the center */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#a855f7] to-[#ea580c] transition-opacity duration-300 p-[1.5px] pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="w-full h-full rounded-full bg-background" />
          </div>

          {/* Small inner dot that remains neutral gray/dark constant and never changes color or glows */}
          <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-600 z-10 pointer-events-none" />
        </div>
        
        {/* Smaller Year Header on Desktop */}
        <h3 className={`hidden md:block text-xs md:text-sm font-semibold pl-12 tracking-tight transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
          {role.period}
        </h3>
      </div>

      {/* Main Content card (Transparent with line highlights) */}
      <div className="relative pl-12 pr-2 md:pl-0 w-full flex-1">
        {/* Mobile-only Year Header */}
        <h3 className={`md:hidden block text-xs md:text-sm font-semibold mb-2 tracking-tight transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
          {role.period}
        </h3>

        <div className="bg-transparent border-0 rounded-none p-0 transition-all duration-500 relative group/card">
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-1">
            {role.title}
          </h3>
          <h4 className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mb-6 uppercase tracking-wider font-semibold font-mono">
            {role.company}
          </h4>

          <div className="space-y-4">
            {Array.isArray(role.description) ? (
              role.description.map((para: string, idx: number) => (
                <p 
                  key={idx} 
                  className={`text-muted-foreground text-sm md:text-[15px] leading-relaxed font-sans border-l border-border/45 pl-4 transition-colors duration-300 ${isActive ? 'border-neutral-400 dark:border-neutral-500 text-foreground/95' : 'group-hover/card:border-neutral-300 dark:group-hover/card:border-neutral-700'}`}
                >
                  {para}
                </p>
              ))
            ) : (
              <p className={`text-muted-foreground text-sm md:text-[15px] leading-relaxed font-sans border-l border-border/45 pl-4 transition-colors duration-300 ${isActive ? 'border-neutral-400 dark:border-neutral-500 text-foreground/95' : 'group-hover/card:border-neutral-300 dark:group-hover/card:border-neutral-700'}`}>
                {role.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
