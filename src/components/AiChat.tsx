import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, X, ChevronLeft, ChevronRight, Check, Clock } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import { ContactForm } from "./ContactForm";
import { ProjectCard } from "./ProjectCard";
import { supabase } from "../lib/supabase";
import { patchProject, patchProjects } from "../lib/projectUtils";
import { useLanguage } from "../i18n/LanguageContext";
import { tProjectField, type PortfolioProject } from "./Cases";

// --- Tipos ---
type Message = {
  id: string;
  role: "user" | "model";
  text: string;
  type?: 'text' | 'projects' | 'contact' | 'project_detail' | 'component';
  component?: 'contact' | 'cases.tsx';
  items?: PortfolioProject[];
  item?: PortfolioProject;
  form?: any;
  project?: PortfolioProject;
  modelUsed?: string;
  lang?: 'es' | 'en';
};

// --- Helpers de comunicación ---
const sendChatMessage = async (
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  model: string = "default"
) => {
  const res = await fetch(
    "https://fmigvcjlgrhgicyawiyq.supabase.co/functions/v1/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory.slice(-6),
        model
      })
    }
  )

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 429 && data.session_blocked) {
      return data;
    }
    throw new Error(`Chat error ${res.status}: ${JSON.stringify(data)}`);
  }

  return data;
}

const updateHistory = (
  currentHistory: Array<{ role: string; content: string }>,
  userMessage: string,
  assistantResponse: { message: string }
) => {
  return [
    ...currentHistory,
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantResponse.message }
  ].slice(-6)
}

const boxVariants: Variants = {
  hidden: { clipPath: "inset(49.5% 50% 49.5% 50% round 16px)", opacity: 0 },
  visible: { 
    clipPath: [
      "inset(49.5% 50% 49.5% 50% round 16px)", 
      "inset(49.5% 0% 49.5% 0% round 16px)", 
      "inset(-400px -100px -100px -100px round 16px)"
    ],
    opacity: [0, 1, 1],
    transition: {
      clipPath: { times: [0, 0.6, 1], duration: 2.6, delay: 0.5, ease: "easeInOut" },
      opacity: { duration: 1.2, delay: 0.5, ease: "easeInOut" }
    }
  },
  idle: { clipPath: "inset(-400px -100px -100px -100px round 16px)", opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  expanded: { clipPath: "inset(-400px -100px -100px -100px round 16px)", opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }
};

const borderVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 2.9, duration: 1.2, ease: "easeInOut" } },
  idle: { opacity: 1 },
  expanded: { opacity: 1 }
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 3.1, duration: 1.0, ease: "easeInOut" } },
  idle: { opacity: 1 },
  expanded: { opacity: 1 }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 3.6 } },
  idle: { opacity: 1 },
  expanded: { opacity: 1 }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  idle: { opacity: 1, y: 0 },
  expanded: { opacity: 1, y: 0 }
};

const OpenAIIcon = ({ className }: { className?: string }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A6.0651 6.0651 0 0 0 19.022 19.818a5.9847 5.9847 0 0 0 3.9977-2.9001 6.0462 6.0462 0 0 0-.7378-7.0966zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829V3.6468a.0804.0804 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66 4.4708 4.4708 0 0 1-.5346.9014l-.142-.0852-4.783-2.7582a.7712.7712 0 0 0-.7806 0l-5.8428 3.3685v2.3324l2.02-1.1686a.0757.0757 0 0 1 .071 0l4.8303 2.7865a.0757.0757 0 0 1 .0331.0615v.0947zM8.5285 4.4346a4.485 4.485 0 0 1 4.731-.9156v5.6729a.7664.7664 0 0 0-.3879.6765L7.0572 13.2227l-2.02-1.1686a.071.071 0 0 1-.038-.052V6.4195a4.504 4.504 0 0 1 3.5293-1.9849zM12 14.8211l-3.4755-2.0069V8.8004L12 6.7935l3.4755 2.0069v4.0138z"/>
  </svg>
)

const GeminiIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 2.5a.5.5 0 01.46.336l1.321 3.52c.866 2.308 2.36 3.803 4.67 4.67l3.52 1.321a.5.5 0 010 .937l-3.52 1.321c-2.31.867-3.804 2.362-4.67 4.67l-1.321 3.52a.5.5 0 01-.92 0l-1.321-3.52c-.866-2.308-2.36-3.803-4.67-4.67l-3.52-1.321a.5.5 0 010-.937l3.52-1.321c2.31-.867 3.804-2.362 4.67-4.67l1.321-3.52A.5.5 0 0112 2.5z" />
  </svg>
);

const DEFAULT_MODEL_OPTIONS = [
  { value: "gpt-5.4-nano",          label: "GPT-5.4 Nano",          provider: "openai",  badge: "OpenAI" },
  { value: "gpt-5.4-mini",          label: "GPT-5.4 Mini",          provider: "openai",  badge: "OpenAI" },
  { value: "gpt-5.5-instant",       label: "GPT-5.5 Instant",       provider: "openai",  badge: "OpenAI" },
  { value: "gpt-5.5",               label: "GPT-5.5",               provider: "openai",  badge: "OpenAI" },
  { value: "o4-mini",               label: "o4-mini",               provider: "openai",  badge: "OpenAI" },
  { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite", provider: "gemini",  badge: "Google" },
  { value: "gemini-3-flash",        label: "Gemini 3 Flash",        provider: "gemini",  badge: "Google" },
  { value: "gemini-3.1-pro",        label: "Gemini 3.1 Pro",        provider: "gemini",  badge: "Google" },
];

interface AiChatProps {
  isExpanded?: boolean;
  onChatStart?: () => void;
  onChatClose?: () => void;
  onLangChange?: (lang: 'es' | 'en') => void;
}

// --- Componentes Internos ---
function ProjectCarousel({ items, lang = 'es' }: { items: any[]; lang?: 'es' | 'en' }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.7;
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel w-full">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all -ml-2 hover:bg-accent hover:text-white hover:scale-110 active:scale-95"
        aria-label="Anterior"
      >
        <ChevronLeft size={16} />
      </button>
      
      <div 
        ref={carouselRef}
        className="flex gap-4 mt-2 overflow-x-auto pb-4 scrollbar-hide snap-x touch-pan-x -mx-1 px-1 w-full items-stretch"
      >
        {items.map((p: any) => {
          const title = tProjectField(p as PortfolioProject, 'title', lang);
          const description = tProjectField(p as PortfolioProject, 'subtitle', lang) || tProjectField(p as PortfolioProject, 'description', lang);
          return (
            <div key={p.slug} className="min-w-[212px] md:min-w-[246px] max-w-[212px] md:max-w-[246px] snap-start flex">
              <ProjectCard
                title={title}
                description={description}
                image={p.cover_url}
                link={`/cases/${p.slug}`}
                tags={p.tags}
                className="mt-3 ml-0"
              />
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all -mr-2 hover:bg-accent hover:text-white hover:scale-110 active:scale-95"
        aria-label="Siguiente"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export function AiChat({ isExpanded, onChatStart, onChatClose, onLangChange }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<'es' | 'en'>('es');
  const [lastClickedPrompt, setLastClickedPrompt] = useState<string | null>(null);
  const [playSpin, setPlaySpin] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t, language, setLanguage } = useLanguage();
  
  const currentLang = chatLanguage !== 'es' ? chatLanguage : language;

  const QUICK_PROMPTS = t('chat.prompts');

  const AI_AVATAR_URL = "https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Axi%20pensando.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvQXhpIHBlbnNhbmRvLnBuZyIsImlhdCI6MTc3OTE2MzM4OSwiZXhwIjoyMDk0NTIzMzg5fQ.LNo-7N9wWMAurHPF4IDwrEfYkzwy9NRs1SOSNgwlZZo";

  const FUNCTIONS_URL = 'https://fmigvcjlgrhgicyawiyq.supabase.co/functions/v1/chat';

  // Preload avatar
  useEffect(() => {
    const img = new Image();
    img.src = AI_AVATAR_URL;
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input, isExpanded]);

  useEffect(() => {
    const handleUnload = () => {
      const sid = sessionIdRef.current;
      if (!sid) return;

      navigator.sendBeacon(
        `${FUNCTIONS_URL}/end-session`,
        JSON.stringify({ session_id: sid })
      );
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      
      // Cleanup on unmount
      const sid = sessionIdRef.current;
      if (sid) {
        fetch(`${FUNCTIONS_URL}/end-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sid }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, []);

  const [modelOptions, setModelOptions] = useState<any[]>(DEFAULT_MODEL_OPTIONS);
  const [selectedModel, setSelectedModel] = useState("default");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isModelInteracted, setIsModelInteracted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [blockInfo, setBlockInfo] = useState<{ isBlocked: boolean; blockedUntil: string | null; remainingMinutes: number; remainingSeconds: number }>({
    isBlocked: false,
    blockedUntil: null,
    remainingMinutes: 0,
    remainingSeconds: 0
  });

  useEffect(() => {
    if (!blockInfo.isBlocked || !blockInfo.blockedUntil) return;

    const interval = setInterval(() => {
      const now = new Date();
      const blockedDate = new Date(blockInfo.blockedUntil!);
      const diffMs = blockedDate.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setBlockInfo(prev => ({ ...prev, isBlocked: false, remainingMinutes: 0, remainingSeconds: 0 }));
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diffMs / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);
        setBlockInfo(prev => ({ ...prev, remainingMinutes: minutes, remainingSeconds: seconds }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockInfo.isBlocked, blockInfo.blockedUntil]);

  useEffect(() => {
    fetch("https://fmigvcjlgrhgicyawiyq.supabase.co/functions/v1/chat/models")
      .then(res => res.json())
      .then(data => {
        if (data && data.models) {
          setModelOptions(data.models);
        }
      })
      .catch(err => console.error("Error fetching models:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    if (isModelDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModelDropdownOpen]);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setPlaySpin(true);
      setIsIntroDone(true);
    }, 4000); 
    const stopTimer = setTimeout(() => setPlaySpin(false), 10500); 
    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, []);
  
  const animateState = isExpanded ? "expanded" : (isIntroDone ? "idle" : "visible");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading, blockInfo.isBlocked]);

  const addAssistantBubble = (text: string, data?: any, modelUsed?: string) => {
    const modelIdentifier = modelUsed || selectedModel;
    const modelOption = modelOptions.find(m => m.value === modelIdentifier);
    const displayedModel = modelIdentifier === 'default' 
      ? t('chat.automaticModel')
      : (modelOption?.label || modelIdentifier);

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text,
      ...data,
      modelUsed: displayedModel
    }]);
  }

  const handleChatResponse = async (data: any, userMessage: string) => {
    if (data.session_id) sessionIdRef.current = data.session_id;

    if (data.lang) {
      const detectedLang = data.lang === 'en' ? 'en' : 'es';
      if (detectedLang !== chatLanguage) {
        setChatLanguage(detectedLang);
        onLangChange?.(detectedLang);
      }
      if (detectedLang !== language) {
        setLanguage(detectedLang);
      }
    }

    if (data.type === "contact" && data.component === "contact.tsx") {
      // Regla de UX: no duplicar el componente de contacto si ya existe
      const hasContactForm = messages.some(m => m.role === 'model' && m.type === 'component' && m.component === 'contact');
      
      if (!hasContactForm) {
        addAssistantBubble(data.message, {
          type: 'component',
          component: 'contact'
        }, data.model_used);
      } else {
        // Si ya existe, solo añadimos el mensaje de texto para no saturar con forms
        addAssistantBubble(data.message, { type: 'text' }, data.model_used);
      }
      
      setHistory(prev => updateHistory(prev, userMessage, data));
      return;
    }

    // Refactored message addition for projects to ensure correct subsequent update
    const newMsgId = Date.now().toString();
    const modelIdentifier = data.model_used || selectedModel;
    const modelOption = modelOptions.find(m => m.value === modelIdentifier);
    const displayedModel = modelIdentifier === 'default' 
      ? t('chat.automaticModel')
      : (modelOption?.label || modelIdentifier);

    // Combine setting initial message to avoid race conditions
    setMessages(prev => [...prev, {
      id: newMsgId,
      role: 'model',
      text: data.message,
      ...data,
      modelUsed: displayedModel,
      items: (data.type === 'projects' || data.component === 'cases.tsx') ? null : undefined // marker for loading
    }]);

    if ((data.type === "projects" || data.component === "cases.tsx")) {
        let query = supabase
        .from("portfolio_projects")
        .select(`id, slug, category, tags, cover_url, demo_url, case_url, technologies, year, featured, visible, sort_order, title, subtitle, description, highlights, title_en, subtitle_en, description_en, highlights_en`)
        .eq("visible", true)
        .order("sort_order", { ascending: true })

        const category = data.frontend_action?.filters?.category

        if (category) {
            query = query.eq("category", category)
        }

        const { data: projects, error } = await query
        if (error) {
            console.error("Error loading projects:", error);
            setMessages(prev => prev.map(msg => msg.id === newMsgId ? {...msg, items: []} : msg));
        } else {
            const patchedProjects = patchProjects(projects);
            // Functional update ensures we work with the most recent messages
            setMessages(prev => prev.map(msg => msg.id === newMsgId ? {...msg, items: patchedProjects} : msg));
        }
    }
    
    if (data.type === "project_detail" && data.item_identifier?.slug) {
        const { data: project } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("slug", data.item_identifier.slug)
        .single()
        
        if (project) {
            const patchedProject = patchProject(project);
            setMessages(prev => prev.map(msg => msg.id === newMsgId ? {...msg, item: patchedProject} : msg))
        }
    }
    
    setHistory(prev => updateHistory(prev, userMessage, data));
  }
  
  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() && !input.trim()) return;
    
    if (QUICK_PROMPTS.includes(messageText)) setLastClickedPrompt(messageText);
    
    if (!isExpanded) onChatStart?.();
    
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", text: textToSend }]);
    setInput("");
    setIsLoading(true);

    try {
        const data = await sendChatMessage(textToSend, history, selectedModel);
        if (data.session_blocked) {
          setBlockInfo({
            isBlocked: true,
            blockedUntil: data.blocked_until || null,
            remainingMinutes: data.remaining_minutes || 15,
            remainingSeconds: 0
          });
        } else {
          await handleChatResponse(data, textToSend);
        }
    } catch (err: any) {
        console.error("Error sending message:", err.message);
        addAssistantBubble(t('chat.error'));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <motion.div 
      layout
      transition={{ layout: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(
        "w-full mx-auto",
        isExpanded 
          ? "h-full w-full bg-transparent border-t border-transparent shadow-none flex flex-col" 
          : "h-auto max-w-3xl bg-transparent"
      )}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="px-6 py-4 border-b border-border/50 bg-transparent flex items-center justify-center z-10 shrink-0"
          >
            <div className="w-[90%] flex items-center justify-between relative">
              <div className="flex items-center gap-3 invisible"><div className="w-3 h-3" /></div>
              <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-bold whitespace-nowrap">
                  {t('chat.title')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ delay: 0.7, duration: 0.8 }}
            ref={scrollRef} 
            className="flex-1 overflow-y-auto w-full scroll-smooth min-h-0 relative flex flex-col scrollbar-hide"
          >
            <div className={cn("w-[90%] mx-auto py-6 px-0 space-y-8 flex-1 flex flex-col justify-end transition-all duration-300", blockInfo.isBlocked ? "pb-16" : "pb-6")}>
              <div className="flex-1" /> 
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-start gap-4",
                      message.role === "user" ? "ml-auto flex-row-reverse max-w-[85%]" : "max-w-[95%]"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 avatar-gradient-border shadow-sm overflow-hidden",
                      "bg-white dark:bg-black"
                    )}>
                      {message.role === "user" ? (
                        <User size={14} className="text-foreground relative z-10" />
                      ) : (
                        <img 
                          src={AI_AVATAR_URL} 
                          alt="AI Avatar" 
                          className="w-full h-full object-cover scale-[0.95] rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div className={cn(
                      "px-5 py-3 text-base leading-relaxed tracking-tight max-w-full",
                      message.role === "user" 
                        ? "user-chat-bubble shadow-sm" 
                        : "bg-background/40 backdrop-blur-md rounded-2xl rounded-tl-sm border border-border/50 shadow-sm flex flex-col gap-4 pb-2"
                    )}>
                      {message.text && (
                        <div className="break-words prose prose-sm dark:prose-invert max-w-none py-3 px-1 -mx-1 my-0">
                          <ReactMarkdown
                            components={{
                              a: ({ ...props }) => (
                                <a
                                  {...props}
                                  className="text-accent underline hover:text-accent/80 transition-colors font-medium"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              ),
                              p: ({ ...props }) => <p {...props} className="m-0 mb-2 last:mb-0" />,
                              ul: ({ ...props }) => <ul {...props} className="list-disc pl-5 my-2 space-y-1 brand-bullets marker:text-foreground/90" />,
                              ol: ({ ...props }) => <ol {...props} className="list-decimal pl-5 my-2 space-y-1 brand-bullets marker:text-foreground/90" />,
                              li: ({ ...props }) => <li {...props} className="pl-0 mt-0" />,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )}
                      {message.type === 'projects' && (
                        <div className="mt-0">
                          {message.items ? (
                            <ProjectCarousel items={message.items} lang={message.lang || currentLang} />
                          ) : (
                            <div className="text-[13px] text-muted-foreground animate-pulse">{t('chat.loadingProjects')}</div>
                          )}
                        </div>
                      )}
                      {message.type === 'component' && message.component === 'contact' && (
                        <div className="mt-2 w-full">
                          <ContactForm />
                        </div>
                      )}
                      {message.modelUsed && (
                        <div className="text-[10px] text-muted-foreground/60 font-mono mt-1 pt-2 border-t border-border/20">
                          {t('chat.generatedBy')} {message.modelUsed}
                        </div>
                      )}
                      {message.form && (
                        <ContactForm 
                          initialEmail={message.form.email} 
                          initialMessage={message.form.message} 
                        />
                      )}
                      {(message.project || message.item) && (
                        <div className="max-h-[600px] mt-0 pt-0 pb-2 h-full">
                          <ProjectCard 
                              title={tProjectField(message.project || message.item, 'title', message.lang || currentLang)}
                              description={tProjectField(message.project || message.item, 'description', message.lang || currentLang) || tProjectField(message.project || message.item, 'subtitle', message.lang || currentLang)}
                              image={message.project?.cover_url || message.item?.cover_url}
                              link={`/cases/${message.project?.slug || message.item?.slug}`}
                              className="mt-3"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4 max-w-[95%]"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-black avatar-gradient-border flex items-center justify-center mt-1 shadow-sm relative overflow-visible">
                      <div className="ai-loader-spinner z-10"><div className="ai-loader-spinner-in"></div></div>
                      <img 
                        src={AI_AVATAR_URL} 
                        alt="AI Avatar" 
                        className="w-full h-full object-cover scale-[0.95] rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isExpanded && !isInputFocused && !input.trim() && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="z-[100] relative w-full"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
                      {QUICK_PROMPTS.filter(p => p !== lastClickedPrompt).map((prompt: string) => (
                        <motion.button
                          key={prompt}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSend(prompt)}
                          disabled={isLoading}
                          className="cursor-pointer disabled:cursor-not-allowed text-[0.75rem] px-3.5 py-2 glass-panel bg-background/95 backdrop-blur-xl hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors select-none whitespace-nowrap shadow-xl border border-border/50"
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        transition={{ layout: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
        className={cn("w-full relative", isExpanded ? "border-t border-border/50 bg-transparent z-[200] shrink-0 flex flex-col items-center pt-12 pb-6 px-6 justify-center" : "border-t border-transparent z-[200] px-4")}
      >
        <motion.div 
          layout
          transition={{ layout: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
          variants={boxVariants}
          initial={!isExpanded ? "hidden" : "expanded"}
          animate={animateState}
          className={cn("ur-poda mx-auto shadow-2xl group", isExpanded ? "w-[90%]" : "max-w-3xl w-full")}
        >
          <motion.div 
            variants={borderVariants}
            initial={!isExpanded ? "hidden" : "expanded"}
            animate={animateState}
            className={cn("absolute inset-0 z-[-1] rounded-[inherit] pointer-events-none", playSpin && "play-intro-spin")}
          >
            <div className="ur-glow"></div>
            <div className="ur-darkBorderBg"></div>
            <div className="ur-white"></div>
            <div className="ur-border"></div>
          </motion.div>

          <AnimatePresence>
            {blockInfo.isBlocked && (
              <motion.div
                initial={{ opacity: 0, y: "0%" }}
                animate={{ opacity: 1, y: "calc(-100% + 20px)" }}
                exit={{ opacity: 0, y: "0%" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute left-0 right-0 top-[16px] -z-[2] bg-background/80 backdrop-blur-xl shadow-2xl border border-border/50 rounded-t-[20px] flex items-start gap-3 pt-[10px] px-5 pb-[42px] mx-0 overflow-hidden"
              >
                  <div className="absolute inset-0 bg-destructive/10 pointer-events-none" />
                  <div className="bg-destructive/20 p-2 rounded-full relative shrink-0">
                    <Clock size={16} className="text-destructive" />
                  </div>
                  <div className="flex-1 flex gap-4 items-center">
                    <div className="space-y-1.5 relative">
                       <p className="text-[13px] font-medium leading-tight text-foreground">{t('chat.blocked.title')}</p>
                       <p className="text-[11px] font-mono font-semibold tracking-wider text-destructive uppercase flex items-center gap-1.5 mb-[10px] opacity-50">
                          <span>{blockInfo.remainingMinutes.toString().padStart(2, '0')}:{blockInfo.remainingSeconds.toString().padStart(2, '0')}</span> 
                          <span className="text-destructive/70">{t('chat.blocked.remaining')}</span>
                       </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setBlockInfo(prev => ({ ...prev, isBlocked: false }))}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted/50 z-10"
                  >
                    <X size={14} />
                  </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="ur-main relative w-full min-h-[60px] flex flex-col md:flex-row items-center bg-background backdrop-blur-md">
            <motion.div 
              variants={contentVariants}
              initial={!isExpanded ? "hidden" : "expanded"}
              animate={animateState}
              className="w-full flex items-center relative min-h-[60px] px-1 sm:px-2"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                className={cn(
                  "flex-1 bg-transparent focus:outline-none transition-colors text-foreground resize-none pl-4 pr-[100px] sm:pr-[140px] py-[18px] max-h-[160px] scrollbar-hide block leading-relaxed placeholder:text-muted-foreground/70 placeholder:transition-colors min-w-0",
                  isExpanded ? "text-sm" : "text-base"
                )}
                placeholder={t('chat.placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                onFocus={() => {
                  setIsInputFocused(true);
                  if (messages.length > 0 && !isExpanded) onChatStart?.();
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                  }
                }}
                onBlur={() => setIsInputFocused(false)}
                disabled={isLoading || blockInfo.isBlocked}
              />

              <div className={cn("absolute top-1/2 -translate-y-1/2 z-50 flex-shrink-0", isExpanded ? "right-[50px]" : "right-[54px]")} ref={dropdownRef}>
                <button
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 cursor-pointer bg-muted/30 hover:bg-muted/60 text-muted-foreground dark:bg-muted/10 dark:hover:bg-muted/30 border border-border/30 rounded-[10px] transition-colors text-[13px] font-medium mr-[5px]"
                >
                  <div className="sm:hidden flex items-center mr-1">
                    {(() => {
                      if (!isModelInteracted || selectedModel === "default") return <Bot size={14} className="shrink-0" />;
                      const m = modelOptions.find(opt => opt.value === selectedModel);
                      if (m?.provider === "openai") return <OpenAIIcon className="w-3.5 h-3.5 shrink-0" />;
                      if (m?.provider === "gemini") return <GeminiIcon className="w-3.5 h-3.5 shrink-0" />;
                      return <Bot size={14} className="shrink-0" />;
                    })()}
                  </div>
                  <span className="hidden sm:inline">
                    {!isModelInteracted ? t('chat.automaticModel') : (modelOptions.find(m => m.value === selectedModel)?.label || "Mejor")}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("transition-transform duration-200 shrink-0 opacity-70 ml-0.5", isModelDropdownOpen ? "rotate-180" : "rotate-0")}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <AnimatePresence>
                  {isModelDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute bottom-[calc(100%+12px)] right-0 w-[220px] bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl overflow-hidden py-1.5"
                    >
                      <button
                        onClick={() => {
                          setSelectedModel("default");
                          setIsModelInteracted(true);
                          localStorage.setItem("portfolio_chat_model", "default");
                          setIsModelDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted/50 flex items-center justify-between transition-colors font-medium text-foreground"
                        title={t('chat.automaticModel')}
                      >
                        <span className="truncate">{t('chat.automaticModel')}</span>
                        {selectedModel === "default" && <Check size={14} className="text-accent shrink-0 ml-2" />}
                      </button>

                      {modelOptions.length > 0 && <div className="h-px bg-border/50 my-1.5 mx-2" />}

                      <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        OpenAI
                      </div>
                      {modelOptions.filter(m => m.badge === 'OpenAI').map(model => (
                        <button
                          key={model.value}
                          onClick={() => {
                            setSelectedModel(model.value);
                            setIsModelInteracted(true);
                            localStorage.setItem("portfolio_chat_model", model.value);
                            setIsModelDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted/50 flex items-center justify-between transition-colors"
                          title={model.label || model.value}
                        >
                          <span className="truncate">{model.label || model.value}</span>
                          {selectedModel === model.value && <Check size={14} className="text-accent shrink-0 ml-2" />}
                        </button>
                      ))}

                      {modelOptions.filter(m => m.badge === 'OpenAI').length > 0 && modelOptions.filter(m => m.badge === 'Google').length > 0 && (
                        <div className="h-px bg-border/50 my-1.5 mx-2" />
                      )}

                      <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Google
                      </div>
                      {modelOptions.filter(m => m.badge === 'Google').map(model => (
                        <button
                          key={model.value}
                          onClick={() => {
                            setSelectedModel(model.value);
                            setIsModelInteracted(true);
                            localStorage.setItem("portfolio_chat_model", model.value);
                            setIsModelDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted/50 flex items-center justify-between transition-colors"
                          title={model.label || model.value}
                        >
                          <span className="truncate">{model.label || model.value}</span>
                          {selectedModel === model.value && <Check size={14} className="text-accent shrink-0 ml-2" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading || blockInfo.isBlocked}
                className={cn(
                  "cursor-pointer disabled:cursor-not-allowed absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center bg-gradient-to-br from-[#a855f7] to-[#ea580c] text-white rounded-[8px] hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-md",
                  isExpanded ? "w-10 h-10" : "w-[44px] h-[44px]"
                )}
              >
                <Send size={18} />
              </button>
            </motion.div>
          </div>
        </motion.div>
        {!isExpanded && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={animateState}
            className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-2xl mx-auto transition-all duration-500"
          >
            {QUICK_PROMPTS.map((prompt: string, i: number) => (
              <motion.button
                key={i}
                variants={itemVariants}
                onClick={() => handleSend(prompt)}
                disabled={isLoading || blockInfo.isBlocked}
                className="cursor-pointer disabled:cursor-not-allowed text-[0.75rem] px-3.5 py-2 glass-panel hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors select-none whitespace-nowrap"
              >
                {prompt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
