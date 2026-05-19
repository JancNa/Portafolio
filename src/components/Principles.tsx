import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { ArrowUpRight, Zap, Target, BarChart3, Layers, Sparkles } from "lucide-react";

const principles = [
  {
    num: "01",
    title: "Sistemas Clínicos, no Solo Pantallas",
    text: "El diseño moderno no se trata de hacer pantallas bonitas aisladas, sino de orquestar flujos de usuarios en ecosistemas complejos con restricciones de negocio y técnicas reales.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-purple-500/20 to-indigo-500/20",
    border: "group-hover:border-indigo-500/30",
    shadow: "group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    num: "02",
    title: "IA como Acelerador de Ejecución",
    text: "La IA no reemplaza el criterio crítico, multiplica la eficiencia operativa.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-orange-500/20 to-red-500/20",
    border: "group-hover:border-red-500/30",
    shadow: "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    num: "03",
    title: "Resultados Orientados al Negocio",
    text: "Construyo productos que retienen clientes y escalan con la demanda B2B/B2C.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "group-hover:border-emerald-500/30",
    shadow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
    colSpan: "md:col-span-2 lg:col-span-1",
  },
  {
    num: "04",
    title: "Diseño Sistémico",
    text: "Uniendo puntos desconectados dentro de corporativos y startups.",
    icon: <Layers className="w-6 h-6" />,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-cyan-500/30",
    shadow: "group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]",
    colSpan: "md:col-span-1 lg:col-span-2",
  }
];

export function Principles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="vision" ref={containerRef} className="pt-10 lg:pt-32 pb-4 lg:pb-0 relative text-foreground z-10 overflow-visible flex flex-col lg:block lg:min-h-[600px] w-full">
      {/* Background container for glow effects - clipped to parent to prevent horizontal scroll */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-0 -left-[10%] w-[50vw] h-[50vw] max-w-[640px] max-h-[600px] bg-[#a855f7]/[0.10] dark:bg-[#a855f7]/[0.05] rounded-full blur-[100px] mix-blend-normal" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-0 -right-[10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-[#ea580c]/[0.10] dark:bg-[#ea580c]/[0.05] rounded-full blur-[100px] mix-blend-normal" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl shrink-0 lg:pb-[300px]">
        <div className="flex flex-col gap-6 w-full lg:w-2/3 pt-4 pb-0 lg:py-10 relative z-10">
          <motion.h2 
            className="font-sans text-[40px] md:text-[60px] font-semibold tracking-tight text-foreground mb-4 leading-[1.1] flex flex-wrap max-w-[640px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.2 } }
            }}
          >
            { "Construyo productos que funcionan en el mundo real.".split(" ").map((word, i) => (
                <motion.span 
                  key={i}
                  className="inline-block mr-[0.25em]"
                  variants={{
                    hidden: { opacity: 0, filter: "blur(10px)" },
                    show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                >
                  {word}
                </motion.span>
              ))}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-foreground/80 text-base leading-relaxed font-light lg:max-w-[600px]"
          >
            Paso de ideas borrosas a productos digitales listos para producción. Conecto estrategia, UX, datos y tecnología, usando IA y pensamiento de sistemas para crear plataformas que realmente escalan más allá del prototipo.
          </motion.p>
        </div>
      </div>

      {/* MOBILE / TABLET IMAGE */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:hidden z-0 overflow-hidden pointer-events-none mt-2 md:mt-4">
        <img
          src="https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Vision%20image.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvVmlzaW9uIGltYWdlLnBuZyIsImlhdCI6MTc3OTE1Mjk0NiwiZXhwIjoxNzgwMDE2OTQ2fQ.RCZutxYXm1x-eRNcuPtGTNBULREi4G-DzMdQSSXVers"
          alt="Ecosystem Background"
          className="w-full h-full object-cover object-right"
          referrerPolicy="no-referrer"
          style={{
            maskImage: `
              linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%),
              linear-gradient(to top left, black 75%, transparent 100%)
            `,
            WebkitMaskImage: `
              linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%),
              linear-gradient(to top left, black 75%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'
          }}
        />
      </div>

      {/* DESKTOP IMAGE */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-y-0 right-0 w-[50%] h-full overflow-hidden">
          <img
            src="https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Vision%20image.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvVmlzaW9uIGltYWdlLnBuZyIsImlhdCI6MTc3OTE1Mjk0NiwiZXhwIjoxNzgwMDE2OTQ2fQ.RCZutxYXm1x-eRNcuPtGTNBULREi4G-DzMdQSSXVers"
            alt="Ecosystem Background"
            className="w-full h-full object-cover object-right"
            referrerPolicy="no-referrer"
            style={{
              maskImage: `
                linear-gradient(to right, transparent 0%, transparent 5%, black 15%, black 100%),
                linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%),
                linear-gradient(to top left, black 75%, transparent 100%)
              `,
              WebkitMaskImage: `
                linear-gradient(to right, transparent 0%, transparent 5%, black 15%, black 100%),
                linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%),
                linear-gradient(to top left, black 75%, transparent 100%)
              `,
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
        </div>
      </div>

      {/* Bottom Section: Cards (Centradas en el borde inferior) */}
      <div className="w-full px-6 max-w-7xl absolute bottom-0 left-1/2 -translate-x-1/2 z-20 transform translate-y-1/2">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 rounded-[2rem] border border-border divide-x divide-y md:divide-y-0 md:divide-x divide-border bg-white/5 shadow-2xl overflow-hidden"
        >
          {principles.map((p, i) => (
            <div
              key={p.num}
              className={`relative group p-6 md:p-8 transition-all duration-500 overflow-hidden bg-background/10 backdrop-blur-md
                ${i === 0 ? "rounded-tl-[2rem] md:rounded-l-[2rem]" : ""}
                ${i === 1 ? "rounded-tr-[2rem] md:rounded-none" : ""}
                ${i === 2 ? "rounded-bl-[2rem] md:rounded-none" : ""}
                ${i === 3 ? "rounded-br-[2rem] md:rounded-r-[2rem]" : ""}
              `}
            >
              {/* Spinning gradient for border on hover */}
              <div className="absolute -inset-[1px] rounded-[inherit] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square bg-[conic-gradient(from_0deg,#ea580c,#a855f7,#d946ef,#ea580c)] animate-[spin_3.2s_linear_infinite]" />
                <div className="absolute inset-[1px] bg-background/90 rounded-[inherit]" />
              </div>
              
              <div className="relative z-10 flex flex-col gap-6 text-left h-full">
                <div className="w-10 h-10 rounded-xl bg-background/50 border border-border flex items-center justify-center text-foreground shadow-sm">
                  <div className="scale-75">{p.icon}</div>
                </div>

                <div className="flex-1 flex flex-col justify-start">
                  <h3 className="text-sm md:text-lg font-serif text-foreground mb-1 transition-colors duration-300 font-medium tracking-wide">
                    {p.title}
                  </h3>
                  <p className="text-foreground/70 text-xs md:text-sm leading-relaxed transition-colors font-light line-clamp-2 md:line-clamp-3">
                    {p.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
