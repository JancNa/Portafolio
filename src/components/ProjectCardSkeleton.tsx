import { motion } from "motion/react";

export function ProjectCardSkeleton() {
    return (
        <div className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center animate-pulse">
          {/* Image Placeholder */}
          <div className="md:col-span-7 aspect-[4/3] md:aspect-video rounded-2xl md:rounded-[32px] bg-gray-200 dark:bg-gray-800" />
          
          {/* Content Placeholder */}
          <div className="md:col-span-5 flex flex-col justify-center gap-4">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
              <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
    );
}
