import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  tags?: string[];
  key?: string;
  className?: string;
  isChatDetail?: boolean;
}

export function ProjectCard({ 
  title, 
  description, 
  image, 
  link, 
  tags = [], 
  className = "",
  isChatDetail = false
}: Project) {
  return (
    <motion.a
      href={link}
      whileHover={{ y: -5 }}
      className={cn(
        "relative flex flex-col justify-between group overflow-hidden rounded-2xl bg-black border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300",
        isChatDetail 
          ? "w-full max-w-[320px] aspect-[4/5] md:max-w-[620px] md:aspect-[1.85/1] md:min-h-[285px]" 
          : "min-h-[380px] h-full",
        className
      )}
    >
      {/* Background Image with Hover Zoom & Gradient Overlays */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-500 text-xs">
            {title}
          </div>
        )}
        {/* Dark Gradient: Top-oriented on mobile, Left-oriented on desktop for pristine text readability */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-300 z-10",
            isChatDetail 
              ? "bg-gradient-to-t from-black/95 via-black/80 to-transparent md:bg-gradient-to-r md:from-black/95 md:via-black/75 md:to-transparent" 
              : "bg-gradient-to-t from-black/95 via-black/40 to-transparent"
          )} 
        />
      </div>

      {/* Main Container structuring tags and text contents */}
      <div className={cn(
        "relative z-20 h-full w-full flex flex-col justify-between",
        isChatDetail && "p-1"
      )}>
        {/* Top Section - Tags container */}
        <div className={cn(
          "flex justify-start items-start",
          isChatDetail ? "p-4 pb-0" : "p-5"
        )}>
          <div className="flex flex-wrap gap-1.5">
            {tags.length > 0 ? (
              tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 text-[10px] border border-white/10 rounded-full font-medium text-white/90 bg-black/40 backdrop-blur-md whitespace-nowrap"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="px-2.5 py-1 text-[10px] border border-white/10 rounded-full font-medium text-white/90 bg-black/40 backdrop-blur-md whitespace-nowrap uppercase tracking-wider">
                Producto
              </span>
            )}
          </div>
        </div>

        {/* Bottom Section - Title, arrow action button, and custom text */}
        <div className={cn(
          "flex flex-col mt-auto",
          isChatDetail 
            ? "p-4 pt-10 md:p-6 md:pb-8 md:pt-16 md:max-w-[70%]" 
            : "p-5 pt-12"
        )}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-[20px] leading-[26px] font-sans font-semibold text-white tracking-tight group-hover:text-neutral-200 transition-colors duration-300">
              {title}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className={cn(
            "text-xs leading-relaxed font-sans text-white/80",
            isChatDetail ? "line-clamp-none mt-1" : "line-clamp-2"
          )}>
            {description}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

