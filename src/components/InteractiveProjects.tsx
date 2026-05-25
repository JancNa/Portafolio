import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ArrowUpRight, Play, Pause, RotateCcw } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabase";
import { patchProjects } from "../lib/projectUtils";
import { useTheme } from "../ThemeContext";

export interface InteractiveProject {
  id: string;
  slug: string;
  category: string;
  tags: string[];
  cover_url: string;
  demo_url: string | null;
  case_url: string | null;
  technologies: string[];
  year: number;
  title: string;
  subtitle: string;
  description: string;
  title_en?: string;
  subtitle_en?: string;
  description_en?: string;
}

const FALLBACK_PROJECTS: InteractiveProject[] = [
  {
    id: "whatsapp",
    slug: "whatsapp",
    category: "B2B / SaaS",
    tags: ["B2B", "WhatsApp", "AI", "SaaS"],
    year: 2026,
    cover_url: "",
    demo_url: "#",
    case_url: "#",
    technologies: ["React", "NodeJS", "AI Engine", "Systemic Design"],
    title: "Ecosistema Conversacional WhatsApp B2B",
    subtitle: "Automatización de ventas para retail",
    description: "Orquestación de flujos transaccionales y soporte masivo integrando IA para automatizar la atención a más de 50,000 usuarios diarios.",
    title_en: "WhatsApp B2B Conversational Ecosystem",
    subtitle_en: "Conversational retail automation",
    description_en: "Orchestration of transactional flows and mass support integrating AI to automate customer care for over 50,000 daily active users."
  },
  {
    id: "lealtad",
    slug: "lealtad",
    category: "Gamification / FinTech",
    tags: ["Loyalty", "Gamification", "UX"],
    year: 2026,
    cover_url: "",
    demo_url: "#",
    case_url: "#",
    technologies: ["NextJS", "Framer Motion", "TailwindCSS", "Behavioral design"],
    title: "Plataforma de Fidelización Gamificada",
    subtitle: "Rediseño de lealtad digital",
    description: "Plataforma gamificada con mecánicas de juego aplicadas para startups de alto crecimiento, logrando un +28% de retención de clientes.",
    title_en: "Gamified Loyalty Platform",
    subtitle_en: "Digital loyalty redesign",
    description_en: "Gamified platform with game-thinking mechanics for high-growth startups, achieving a +28% customer retention boost."
  },
  {
    id: "segmentacion",
    slug: "segmentacion",
    category: "Big Data / AI",
    tags: ["Big Data", "Predictive", "Automation"],
    year: 2025,
    cover_url: "",
    demo_url: "#",
    case_url: "#",
    technologies: ["Python", "AWS", "Framer Motion", "Data Visualization"],
    title: "Motor de Segmentación Predictiva",
    subtitle: "Machine learning para marketing B2C",
    description: "Arquitectura analítica para procesar millones de eventos de comportamiento, optimizando campañas de conversión con modelos predictivos.",
    title_en: "Predictive Segmentation Engine",
    subtitle_en: "Machine learning for B2C marketing",
    description_en: "Analytical architecture processing millions of events, optimizing conversion campaigns with predictive pipelines."
  },
  {
    id: "spatial-vr",
    slug: "spatial-vr",
    category: "Spatial Design / VR",
    tags: ["VR", "Vision Pro", "Spatial UI"],
    year: 2025,
    cover_url: "",
    demo_url: "#",
    case_url: "#",
    technologies: ["Three.js", "WebXR", "Spatial UI", "Interactivity"],
    title: "Visualizador de Datos Inmersivo VR",
    subtitle: "Diseño espacial de interfaces",
    description: "Conceptualización y prototipado de interfaces tridimensionales para análisis financiero en tiempo real usando Apple Vision Pro.",
    title_en: "VR Immersive Data Visualizer",
    subtitle_en: "Spatial interface design",
    description_en: "Conceptualization and prototyping of three-dimensional interfaces for real-time financial analysis on Apple Vision Pro."
  },
  {
    id: "multicloud-saas",
    slug: "multicloud-saas",
    category: "SaaS / Design System",
    tags: ["SaaS", "D3.js", "Design System"],
    year: 2026,
    cover_url: "",
    demo_url: "#",
    case_url: "#",
    technologies: ["TypeScript", "D3.js", "Design System", "Cloud Architecture"],
    title: "SaaS de Analítica Multicloud",
    subtitle: "Monitoreo de infraestructura",
    description: "Rediseño completo de consola de monitoreo en la nube B2B, destilando miles de métricas en tableros intuitivos, elegantes y limpios.",
    title_en: "Multicloud Analytics SaaS",
    subtitle_en: "Infrastructure monitoring dashboard",
    description_en: "Complete cloud monitoring console redesign, distilling thousands of metrics into intuitive, elegant and clean dashboards."
  },
  {
    id: "generative-art",
    slug: "generative-art",
    category: "Generative Art",
    tags: ["Generative Design", "Canvas API", "Math Brand"],
    year: 2025,
    cover_url: "",
    demo_url: "#",
    case_url: "#",
    technologies: ["Canvas API", "Svelte", "Visual Identity", "SVG Math"],
    title: "Diseño de Identidad Digital Generativa",
    subtitle: "Arte algorítmico y marca",
    description: "Desarrollo de un sistema de marca adaptativo con logotipos e iconografía cambiantes generadas mediante código matemático en tiempo real.",
    title_en: "Generative Digital Identity Design",
    subtitle_en: "Algorithmic art & branding",
    description_en: "Development of an adaptive brand identity system with logos and iconography generated using real-time mathematical code."
  }
];

type AnimationState = "entrance" | "aligning" | "zooming" | "zoomed";

// Calculates custom non-linear delays and eager zoom triggers for the grid
const getGridDelaysAndZoomTrigger = (activeIndex: number) => {
  // Grid organization entry animation duration slowed down to be ultra-smooth (2.4 seconds)
  const itemDuration = 2.4;

  // Non-linear decaying spacing within each vertical column:
  // Decaying gap intervals scaled to be wider and more graceful
  // rowDelay indices 0, 1, 2, 3 represent rows starting first to last in that specific column (5x4 grid)
  const rowDelays = [0, 0.96, 1.52, 1.84];

  const delays = Array.from({ length: 20 }, (_, idx) => {
    const colIndex = idx % 5;
    const actualRow = Math.floor(idx / 5);
    const isEvenCol = colIndex % 2 === 0;

    // Inverted columns entry delay sequence:
    // Even columns now enter from below (heading up), meaning top-most rows start first (actualRow).
    // Odd columns now enter from above (heading down), meaning bottom-most rows start first (3 - actualRow).
    const rowSequence = isEvenCol ? actualRow : (3 - actualRow);

    // Column offset is set to 0 to ensure all columns start moving at the same time
    const colOffset = 0;
    const rowDelay = rowDelays[rowSequence];

    return colOffset + rowDelay;
  });

  // Center image index is 12 (column 2, row 2)
  const activeDelay = delays[activeIndex] !== undefined ? delays[activeIndex] : delays[12];

  // The ease-out transition [0.25, 1, 0.45, 1] means the center image is visually centered very early.
  // Zoom begins precisely when the center image locks into the middle, instead of waiting for the rest of the grid.
  const arrivalTime = activeDelay + (itemDuration * 0.20);

  return {
    delays,
    itemDuration,
    zoomTriggerDelay: arrivalTime
  };
};

export function InteractiveProjects() {
  const [projects, setProjects] = useState<InteractiveProject[]>(FALLBACK_PROJECTS);
  const [displayGrid, setDisplayGrid] = useState<InteractiveProject[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(12); // Center of 5x5 grid is index 12
  const [direction, setDirection] = useState<number>(0);
  const [animationState, setAnimationState] = useState<AnimationState>("entrance");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDesktop, setIsDesktop] = useState(true);

  const { delays, itemDuration, zoomTriggerDelay } = getGridDelaysAndZoomTrigger(12);

  const { language } = useLanguage();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkDark = () => {
      if (theme === 'system') {
        return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    };
    setIsDark(checkDark());

    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setIsDark(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailsRowRef = useRef<HTMLDivElement>(null);
  
  const AUTOPLAY_TIME_MS = 12000;
  const INTERVAL_TICK_MS = 100;

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("portfolio_projects")
          .select("id, slug, category, tags, cover_url, demo_url, case_url, technologies, year, title, subtitle, description, title_en, subtitle_en, description_en")
          .eq("visible", true)
          .order("sort_order", { ascending: true });

        let loadedProjects = patchProjects(FALLBACK_PROJECTS);
        if (data && data.length > 0) {
          const patched = patchProjects(data) as any[];
          loadedProjects = patched.map(p => ({
            id: p.id,
            slug: p.slug,
            category: p.category || "Design",
            tags: p.tags || [],
            cover_url: p.cover_url || FALLBACK_PROJECTS[0].cover_url,
            demo_url: p.demo_url,
            case_url: p.case_url,
            technologies: p.technologies || [],
            year: p.year || 2200,
            title: p.title || "",
            subtitle: p.subtitle || "",
            description: p.description || "",
            title_en: p.title_en || p.title,
            subtitle_en: p.subtitle_en || p.subtitle,
            description_en: p.description_en || p.description,
          }));
        }

        // We want the 'segmentacion' project (or default) to be at index 12 of the displayGrid.
        // displayGrid[12] corresponds to rotatedProjects[12 % len].
        const len = loadedProjects.length;
        const targetProjIndex = Math.max(0, loadedProjects.findIndex(p => p.id === "segmentacion" || p.title.toLowerCase().includes("segment")));
        const desiredIndex = 12 % len;
        const shift = (targetProjIndex - desiredIndex + len) % len;
        
        const rotatedProjects = [];
        for (let i = 0; i < len; i++) {
          rotatedProjects.push(loadedProjects[(i + shift) % len]);
        }

        setProjects(rotatedProjects);
        
        // Build 5x4 grid (20 items) mapped from the available projects
        const padded: InteractiveProject[] = [];
        for (let i = 0; i < 20; i++) {
          padded.push(rotatedProjects[i % len]);
        }
        setDisplayGrid(padded);
        // Start in the exact center (index 12)
        setActiveIndex(12);

      } catch (err) {
        console.error("Supabase error fetching for interactive section:", err);
        const padded: InteractiveProject[] = [];
        for (let i = 0; i < 20; i++) {
          padded.push(FALLBACK_PROJECTS[i % FALLBACK_PROJECTS.length]);
        }
        setDisplayGrid(padded);
        setActiveIndex(12);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const startSequence = () => {
    setAnimationState("entrance");
    setProgress(0);
    
    const alignTimer = setTimeout(() => {
      setAnimationState("aligning");
    }, 150);

    const zoomingTimer = setTimeout(() => {
      setAnimationState("zooming");
    }, zoomTriggerDelay * 1000);

    const zoomedTimer = setTimeout(() => {
      setAnimationState("zoomed");
    }, (zoomTriggerDelay + 3) * 1000);

    return () => {
      clearTimeout(alignTimer);
      clearTimeout(zoomingTimer);
      clearTimeout(zoomedTimer);
    };
  };

  useEffect(() => {
    let cleanupSequence: (() => void) | undefined;

    if (!loading && displayGrid.length === 20 && isInView) {
      const delayTimer = setTimeout(() => {
        cleanupSequence = startSequence();
      }, 550); // 550ms buffer after entering section before beginning entrance animation
      
      return () => {
        clearTimeout(delayTimer);
        if (cleanupSequence) cleanupSequence();
      };
    }
  }, [loading, displayGrid.length, isInView]);

  useEffect(() => {
    if (animationState !== "zoomed" || !isPlaying) return;

    const tickInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(tickInterval);
          handleNextProject();
          return 0;
        }
        return prev + (INTERVAL_TICK_MS / AUTOPLAY_TIME_MS) * 100;
      });
    }, INTERVAL_TICK_MS);

    return () => clearInterval(tickInterval);
  }, [animationState, activeIndex, isPlaying, projects.length]);

  const handleNextProject = () => {
    const nextIdx = (activeIndex + 1) % 20;
    transitionToProject(nextIdx);
  };

  const transitionToProject = (targetIdx: number) => {
    if (animationState !== "zoomed") return;
    setDirection(targetIdx > activeIndex ? 1 : -1);
    setProgress(0);
    setActiveIndex(targetIdx);
  };

  const isInitialScroll = useRef(true);

  // Scroll active thumbnail to center on mobile devices
  useEffect(() => {
    if (projects.length === 0) return;
    const activeThumbIndex = activeIndex % projects.length;
    const activeThumb = thumbRefs.current[activeThumbIndex];
    const container = thumbnailsRowRef.current;
    if (activeThumb && container) {
      const containerWidth = container.clientWidth;
      const thumbLeft = activeThumb.offsetLeft;
      const thumbWidth = activeThumb.clientWidth;
      const targetScrollLeft = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
      
      container.scrollTo({
        left: targetScrollLeft,
        behavior: isInitialScroll.current ? "auto" : "smooth"
      });
      isInitialScroll.current = false;
    }
  }, [activeIndex, projects.length, animationState]);

  const handleResetIntro = () => {
    setDirection(0);
    setActiveIndex(12); // reset to center
    startSequence();
  };

  const activeProject = displayGrid[activeIndex] || FALLBACK_PROJECTS[0];

  const getT = (proj: InteractiveProject, field: "title" | "subtitle" | "description") => {
    if (language === "en") {
      const val = proj[`${field}_en` as keyof InteractiveProject];
      if (val && typeof val === "string" && val.trim() !== "") return val;
    }
    return proj[field] || "";
  };

  const targetOriginY = isDesktop ? "36.51vw" : "calc(75vh + 2.76vw)";

  return (
    <section 
      ref={sectionRef} 
      className={`relative w-full h-[100vh] overflow-hidden font-sans flex items-center justify-center transition-colors duration-500 ${
        animationState === "zoomed" ? (isDark ? "bg-black" : "bg-white") : "bg-transparent"
      }`}
      id="interactive-projects"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 1%, black 3%, black 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 1%, black 3%, black 100%)'
      }}
    >
      
      {/* ------------------------------------------------------------- */}
      {/* 1. GRID ENTRANCE & ALIGNMENT VIEW (Background Grid) */}
      {/* ------------------------------------------------------------- */}
      {loading && (
        <div className="absolute inset-0 w-full h-full z-10 animate-pulse">
            
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
      )}
      
      {!loading && (
        <motion.div 
          initial={{ scale: 1, opacity: 1, x: "-50%", y: `calc(-1 * (${targetOriginY}))` }}
          animate={{ 
            scale: (animationState === "zooming" || animationState === "zoomed") ? 4.5 : 1,
            opacity: animationState === "zoomed" ? 0 : 1,
            x: "-50%",
            y: `calc(-1 * (${targetOriginY}))`
          }}
          transition={{ 
            scale: {
              duration: (animationState === "zooming" || animationState === "zoomed") ? 3 : 1.7, 
              ease: "easeInOut"
            },
            opacity: {
              duration: 0
            }
          }}
          style={{ 
            transformOrigin: `50% ${targetOriginY}`,
            width: "125.52vw",
            gap: "1.38vw",
            willChange: "transform, opacity"
          }}
          className="absolute top-1/2 left-1/2 z-10 grid grid-cols-5"
        >
          {displayGrid.map((proj, idx) => {
            const colIndex = idx % 5;
            const actualRow = Math.floor(idx / 5);
            const isEvenCol = colIndex % 2 === 0;
            
            // Start completely outside bounding box
            const startY = isEvenCol ? 150 : -150; 
            
            let animateY = 0;
            let opacity = 1;

            if (animationState === "entrance") {
              animateY = startY;
              opacity = 0;
            } else if (animationState === "aligning") {
              animateY = 0;
              opacity = 1;
            }

            // Visual layering
            const isCenter = idx === 12;
            const zIndex = isCenter ? 20 : 10;
            
            const currentDelay = delays[idx] !== undefined ? delays[idx] : 0;

            return (
              <motion.div
                key={`grid-item-${idx}`}
                initial={{ y: `${startY}vh`, opacity: 0 }}
                animate={{ y: `${animateY}vh`, opacity: opacity }}
                transition={{
                  duration: itemDuration,
                  ease: [0.25, 1, 0.45, 1],
                  delay: currentDelay
                }}
                style={{ zIndex, width: "24vw", willChange: "transform, opacity" }}
                className="relative rounded-none h-[30vh] md:h-[50vh] md:aspect-auto lg:h-auto lg:aspect-[16/9]"
              >
                {isCenter ? (
                  <motion.div 
                    className="w-full h-full overflow-hidden group"
                    animate={{
                      clipPath: (animationState === "zooming" || animationState === "zoomed") 
                        ? "inset(0% 0% 0% 0%)" 
                        : "inset(12% 12% 12% 12%)",
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut"
                    }}
                    style={{ transformOrigin: "center center", willChange: "clip-path, transform" }}
                  >
                    <motion.img
                      src={proj.cover_url}
                      alt=""
                      animate={{
                        scale: (animationState === "zooming" || animationState === "zoomed") ? 1.0 : 1.25,
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut"
                      }}
                      style={{ transformOrigin: "center center", willChange: "transform" }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ) : (
                  <div 
                    className={`w-full h-full overflow-hidden group transition-transform duration-1000 ${
                      !isEvenCol ? "translate-y-[15vh] lg:translate-y-[6.75vw]" : "translate-y-0"
                    }`}
                  >
                    <img
                      src={proj.cover_url}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}



      {/* ------------------------------------------------------------- */}
      {/* 2. ZOOMED ACTIVE PROJECT OVERLAYS (THE EXPLORATION VIEW) */}
      {/* ------------------------------------------------------------- */}
      {/* Carousel Full Screen Images */}
      {!loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: animationState === "zoomed" ? 1 : 0 
          }}
          transition={{ duration: 0 }}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        >
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={`carousel-${activeProject.id}`}
                src={activeProject.cover_url}
                custom={direction}
                initial={((d: number) => ({
                  x: d === 0 ? "0vw" : (d > 0 ? "100vw" : "-100vw")
                })) as any}
                animate={{ x: "0vw" }}
                exit={((d: number) => ({
                  x: d === 0 ? "0vw" : (d > 0 ? "-100vw" : "100vw")
                })) as any}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute object-cover max-w-none w-[108vw] h-[135vh] lg:w-[108vw] lg:h-auto lg:aspect-video"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {!loading && animationState === "zoomed" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          >
            {/* Master gradients overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-between"
            >
              <div className="w-full h-[35vh] md:h-[40vh] bg-gradient-to-b from-black/95 via-black/60 md:from-black/80 md:via-black/25 to-transparent" />
              <div className="w-full h-[90vh] md:h-[60vh] bg-gradient-to-t from-black/80 via-black/60 md:from-black/90 md:via-black/40 to-transparent" />
            </motion.div>

            {/* Header overlay for navigation inside the section (absolutely anchored) */}
            <div className="absolute top-0 inset-x-0 z-30 w-full px-6 md:px-12 pb-6 md:pb-12 pt-[72px] flex flex-col md:flex-row justify-between items-start pointer-events-auto gap-6 md:gap-8">
              <div className="relative z-10 min-h-[4rem] flex items-end">
                <AnimatePresence mode="wait">
                  <motion.h2 
                    key={`title-${activeIndex}`}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[48px] leading-[60px] font-display font-semibold tracking-tight transition-colors duration-500 max-w-3xl text-white drop-shadow-xl"
                  >
                    {getT(activeProject, "title")}
                  </motion.h2>
                </AnimatePresence>
              </div>

              {/* Tags side */}
              <div className="relative z-10 flex flex-col items-start md:items-end min-h-[4rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tags-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-start md:items-end"
                  >
                    <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 mb-2">
                      <span className="text-[10px] font-mono border backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-widest font-semibold transition-colors duration-500 text-white/90 border-white/20 bg-black/40">
                        {activeProject.category}
                      </span>
                      <span className="text-xs font-mono transition-colors duration-500 text-white/60 drop-shadow">
                        • {activeProject.year}
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-start md:justify-end gap-2">
                      {activeProject.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="text-[10px] md:text-xs font-mono px-2 py-0.5 rounded backdrop-blur-sm transition-colors duration-500 text-white/80 bg-black/40 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Content Reveal - absolutely anchored to prevent jumping when content changes or height is calculated */}
            <div className="absolute bottom-0 inset-x-0 z-30 w-full pb-2 md:pb-12 flex flex-col justify-end pointer-events-auto md:px-12">
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-2 px-6 md:px-0">
                
                {/* Left side text info */}
                <div className="w-full md:max-w-2xl min-h-[5.5rem] pt-4">
                  {/* Description */}
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={`desc-${activeIndex}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-base md:text-lg font-light leading-relaxed max-w-xl text-white/95 text-shadow transition-colors duration-500"
                    >
                      {getT(activeProject, "description")}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Right side CTA & Controls */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                  className="flex flex-row md:flex-col md:items-end items-center justify-end"
                >
                  <a
                    href={activeProject.demo_url || activeProject.case_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-gradient-button inline-flex items-center gap-2 text-foreground group/explore w-fit"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-sm font-sans">
                      {language === "es" ? "Explorar proyecto" : "Explore project"}
                      <ArrowUpRight size={16} className="group-hover/explore:translate-x-0.5 group-hover/explore:-translate-y-0.5 transition-transform" />
                    </span>
                  </a>
                </motion.div>
              </div>

              {/* Thumbnails row */}
              <motion.div 
                ref={thumbnailsRowRef}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.06,
                      delayChildren: 0.15
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full flex items-center md:justify-end gap-3 overflow-x-auto pt-4 scrollbar-none transition-colors duration-500 snap-x snap-mandatory"
              >
                {/* Space hack on mobile so the first active thumb can align centered without jumping to edge */}
                <div className="w-[50vw] shrink-0 md:hidden pointer-events-none" />
                
                {/* We map the actual distinct projects for the thumbnails, not the 25 padded ones */}
                {projects.map((proj, pIdx) => {
                  // Find the index of this project in the displayGrid that is closest to activeIndex or just use the first match
                  // For simplicity, clicking thumbnail i jumps to index `i` in the grid
                  const isThumbActive = activeProject.id === proj.id;
                  
                  return (
                    <motion.button
                      key={`thumb-${proj.id}-${pIdx}`}
                      ref={(el) => {
                        thumbRefs.current[pIdx] = el;
                      }}
                      onClick={() => transitionToProject(pIdx)} // Jump to the pIdx in the grid
                      variants={{
                        hidden: { y: 40, opacity: 0 },
                        visible: { 
                          y: 0, 
                          opacity: 1,
                          transition: {
                            type: "tween",
                            ease: [0.16, 1, 0.3, 1],
                            duration: 0.65
                          }
                        }
                      }}
                      className={`relative flex-shrink-0 snap-center aspect-[2/1] h-8 md:h-[42px] w-auto rounded-none overflow-hidden transition-opacity duration-300 cursor-pointer ${
                        isThumbActive 
                          ? "opacity-100 shadow-md scale-105" 
                          : "opacity-45 hover:opacity-100"
                      }`}
                    >
                      <img 
                        src={proj.cover_url} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      {isThumbActive && (
                        <div className={`absolute inset-x-0 bottom-0 h-[1.5px] ${
                          isDark ? "bg-black/50" : "bg-white/50"
                        }`}>
                          <motion.div 
                            style={{ width: `${progress}%` }}
                            className={`h-full ${isDark ? "bg-white" : "bg-slate-900"}`}
                            transition={{ ease: "linear" }}
                          />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
                
                {/* Right side spacer for proper centering of last item on mobile */}
                <div className="w-[50vw] shrink-0 md:hidden pointer-events-none" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
