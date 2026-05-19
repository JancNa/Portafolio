import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <div className="relative z-50">
        <Navbar />
      </div>
      
      {/* Background container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-background">
        {/* Subtle Side Glows */}
        <div className="absolute top-1/2 -left-1/4 md:-left-[10%] -translate-y-1/2 w-[50vw] h-[50vw] bg-[#a855f7]/[0.10] dark:bg-[#a855f7]/[0.05] rounded-full blur-[100px] md:blur-[140px] mix-blend-normal" />
        <div className="absolute top-1/2 -right-1/4 md:-right-[10%] -translate-y-1/2 w-[45vw] h-[45vw] bg-[#ea580c]/[0.10] dark:bg-[#ea580c]/[0.05] rounded-full blur-[100px] md:blur-[140px] mix-blend-normal" />

        <StarsBackground className="opacity-80" starDensity={0.0004} />
        <ShootingStars minDelay={500} maxDelay={1500} />
        <ShootingStars minDelay={1200} maxDelay={3500} starColor="#fb923c" trailColor="#a855f7" />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 relative z-10 pt-24 md:pt-32">
        <div className="w-full flex flex-col items-center justify-center gap-4 text-center flex-1 md:mt-[150px] mt-0">
            
            {/* Top section: 404 stacked and centered */}
            <div className="relative flex items-center justify-center w-full min-h-[20vh] md:min-h-[28vh] overflow-hidden">
                {/* Giant 404 */}
                <div className="absolute inset-0 flex items-center justify-center font-black italic tracking-tighter leading-none select-none text-[10rem] sm:text-[15rem] md:text-[21rem] lg:text-[27rem] xl:text-[32rem] pointer-events-none z-0">
                    <div className="relative w-full h-full flex items-center justify-center opacity-90 drop-shadow-[0_0_15px_rgba(234,88,12,0.15)] dark:drop-shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                        {/* Stroke text */}
                        <span className="absolute text-stroke-gradient-404 pl-2 pr-12 md:pr-20 pointer-events-none select-none z-0">
                            404
                        </span>
                        {/* Fill text */}
                        <span className="absolute text-background pl-2 pr-12 md:pr-20 pointer-events-none select-none z-10">
                            404
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative z-20 max-w-6xl px-4 -mt-24 sm:-mt-36 md:-mt-44">
                <div className="flex flex-col-reverse md:flex-row items-center md:items-end justify-center gap-8 md:gap-16">
                    <div className="text-center md:text-left max-w-xl">
                        <h3 className="text-[32px] sm:text-[40px] font-serif mb-6 leading-tight font-bold">
                            ¡Ups! Parece que esta página se fue de vacaciones
                        </h3>
                        <p className="text-base text-muted-foreground mb-10">
                            El pequeño amigo parece haber garabateado la dirección. No podemos encontrar la página que buscas.
                        </p>
                        <Link 
                            to="/" 
                            className="footer-gradient-button inline-flex items-center gap-3 font-medium text-foreground py-4 px-10 rounded-full"
                        >
                            <span className="relative z-10 flex items-center gap-3 text-lg">
                              <ArrowLeft size={22} /> Volver al Inicio
                            </span>
                        </Link>
                    </div>
                    
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="relative shrink-0 z-50 md:-ml-20 md:-mb-2"
                    >
                        <img 
                            src="https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Axi404.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvQXhpNDA0LnBuZyIsImlhdCI6MTc3OTE2NDE4NSwiZXhwIjoyMDk0NTI0MTg1fQ.5-42OJpMZ6NzB3hSPjOQa41x-YbuDH62IaiYyr9wKEM" 
                            alt="Axi 404" 
                            className="w-[336px] sm:w-[336px] md:w-[432px] lg:w-[600px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                            referrerPolicy="no-referrer"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
