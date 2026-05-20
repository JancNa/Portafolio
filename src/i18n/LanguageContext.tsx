import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from './translations';

type Language = 'es' | 'en';

type TranslationKey = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: TranslationKey) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    if (saved === 'es' || saved === 'en') return saved as Language;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'es'; // Default to Spanish unless English
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (path: string): any => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Spanish if something is missing in English
        let fallback: any = translations['es'];
        for (const fKey of keys) {
           if (fallback && typeof fallback === 'object' && fKey in fallback) {
             fallback = fallback[fKey];
           } else {
             return path;
           }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
