import { ArrowUpRight, Github, Linkedin, Mail, Twitter, ExternalLink } from "lucide-react";
import { useContactChannels } from "../hooks/useContactChannels";
import { useLanguage } from "../i18n/LanguageContext";

export function Footer() {
  const { channels } = useContactChannels();
  const { t } = useLanguage();

  const getEmailChannel = () => channels.find(c => c.type === 'email');
  const socialChannels = channels.filter(c => c.type !== 'email');

  return (
    <footer id="contacto" className="mt-24 relative pt-[2px] bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#ea580c] rounded-t-[2.5rem] overflow-hidden">
      <div className="bg-background text-foreground pt-24 pb-12 rounded-t-[calc(2.5rem-2px)] h-full">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 mb-24">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-none">
                {t('footer.title')}
              </h2>
              <p className="text-muted-foreground max-w-sm font-light text-lg mb-8">
                {t('footer.description')}
              </p>
              <a 
                href={getEmailChannel()?.url || "mailto:contact@jorgenaranjo.pro"}
                className="footer-gradient-button inline-flex items-center gap-3 font-medium text-foreground"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {t('footer.cta')} <ArrowUpRight size={18} />
                </span>
              </a>
            </div>

            <div className="flex flex-col md:items-end justify-between">
              <div className="flex flex-col gap-6 md:items-end text-sm text-muted-foreground">
                {socialChannels.length > 0 ? (
                  socialChannels.map((channel) => (
                    <a 
                      key={channel.id}
                      href={channel.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      {channel.label} <ArrowUpRight size={14} />
                    </a>
                  ))
                ) : (
                  <>
                    <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                      LinkedIn <ArrowUpRight size={14} />
                    </a>
                    <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                      Twitter / X <ArrowUpRight size={14} />
                    </a>
                  </>
                )}
                <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  {t('footer.cv')} <ArrowUpRight size={14} />
                </a>
              </div>
              
              <div className="mt-16 md:mt-0 text-muted-foreground/60 text-xs font-mono">
                <p>{t('footer.worldwide')}</p>
                <p className="mt-2 text-right hidden md:block text-muted-foreground/40">{t('footer.products')}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground/50">
            <p>© {new Date().getFullYear()} {t('footer.rights')}</p>
            <p className="flex items-center gap-1">{t('footer.elevator')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
