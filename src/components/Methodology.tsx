import { motion } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";

export function Methodology() {
  const { t } = useLanguage();
  return (
    <section id="metodologia" className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif max-w-2xl mb-6 leading-tight">
            {t('methodology.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl font-light">
            {t('methodology.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-background p-8 md:p-12 lg:p-16 flex flex-col"
          >
            <h3 className="text-xl font-medium font-serif mb-4 text-accent">{t('methodology.m1.title')}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {t('methodology.m1.text')}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-background p-8 md:p-12 lg:p-16 flex flex-col"
          >
            <h3 className="text-xl font-medium font-serif mb-4 text-accent">{t('methodology.m2.title')}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {t('methodology.m2.text')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-background p-8 md:p-12 lg:p-16 flex flex-col"
          >
            <h3 className="text-xl font-medium font-serif mb-4 text-accent">{t('methodology.m3.title')}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {t('methodology.m3.text')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-background p-8 md:p-12 lg:p-16 flex flex-col items-start justify-center relative overflow-hidden"
          >
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-medium font-serif mb-4 text-accent z-10">{t('methodology.m4.title')}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm z-10">
              {t('methodology.m4.text')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
