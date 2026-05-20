import { motion } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";

export function Experience() {
  const { t } = useLanguage();
  
  const roles = t('experience.roles');

  return (
    <section id="experiencia" className="py-24 bg-muted/10 border-t border-border/50">
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

        <div className="space-y-12">
          {roles.map((role: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col md:flex-row md:gap-12 relative group"
            >
              {/* Timeline dot and line */}
              <div className="hidden md:flex flex-col items-center mt-2">
                <div className="w-3 h-3 bg-muted border-2 border-border group-hover:border-accent group-hover:bg-accent transition-colors rounded-full" />
                {i !== roles.length - 1 && <div className="w-px h-full bg-border mt-4" />}
              </div>
              
              <div className="md:w-1/4 mb-4 md:mb-0">
                <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">{role.period}</span>
              </div>
              <div className="md:w-3/4 md:pb-12">
                <h3 className="text-xl md:text-2xl font-serif font-medium mb-1">{role.title}</h3>
                <h4 className="text-sm text-accent mb-4 uppercase tracking-wide font-medium">{role.company}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
