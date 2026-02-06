"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, BookOpen, BarChart3, MessageSquare, Library, ChevronDown, Plus, LogOut, Settings, Globe, Crown } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { LANGUAGES } from "@/lib/utils";
import { Progress } from "@/components/ui";
import type { Language } from "@/types";

const navigation = [
  { name: "Обучение", href: "/dashboard", icon: BookOpen },
  { name: "Курс", href: "/course", icon: Library },
  { name: "Словарь", href: "/vocabulary", icon: BookOpen },
  { name: "AI-репетитор", href: "/ai-tutor", icon: MessageSquare },
  { name: "Статистика", href: "/stats", icon: BarChart3 },
];

// SVG флаги (маленькие)
const FlagUK = () => (
  <svg viewBox="0 0 60 40" className="w-5 h-3.5 rounded-sm">
    <rect fill="#012169" width="60" height="40"/>
    <path fill="#FFF" d="M0,0 L60,40 M60,0 L0,40" stroke="#FFF" strokeWidth="8"/>
    <path fill="#C8102E" d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/>
    <path fill="#FFF" d="M30,0 V40 M0,20 H60" stroke="#FFF" strokeWidth="12"/>
    <path fill="#C8102E" d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const FlagSA = () => (
  <svg viewBox="0 0 60 40" className="w-5 h-3.5 rounded-sm">
    <rect fill="#006C35" width="60" height="40"/>
  </svg>
);

const FlagFR = () => (
  <svg viewBox="0 0 60 40" className="w-5 h-3.5 rounded-sm">
    <rect fill="#002654" width="20" height="40"/>
    <rect fill="#FFF" x="20" width="20" height="40"/>
    <rect fill="#CE1126" x="40" width="20" height="40"/>
  </svg>
);

const FLAGS: Record<Language, React.ReactNode> = {
  en: <FlagUK />,
  ar: <FlagSA />,
  fr: <FlagFR />,
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchLanguage, logout } = useUserStore();

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentLanguage = user?.currentLanguage || "en";
  const languageConfig = LANGUAGES[currentLanguage];
  const userLanguages = user?.languages || [];

  // Закрытие dropdowns при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo and language switcher */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-english to-english-dark flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold hidden sm:block">Tel</span>
            </Link>

            {/* Language Switcher */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-background-alt transition-colors"
              >
                {FLAGS[currentLanguage]}
                <span className="text-sm font-medium hidden sm:block">
                  {languageConfig.name}
                </span>
                <span className="text-xs text-muted">
                  {user?.currentLevel?.toUpperCase() || "A1"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-medium text-muted uppercase">
                    Мои языки
                  </div>
                  {userLanguages.length > 0 ? (
                    userLanguages.map((lang) => (
                      <button
                        key={lang.language}
                        onClick={() => {
                          switchLanguage(lang.language);
                          setShowLanguageDropdown(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 hover:bg-background-alt transition-colors",
                          currentLanguage === lang.language && "bg-background-alt"
                        )}
                      >
                        {FLAGS[lang.language]}
                        <span className="flex-1 text-left text-sm">
                          {LANGUAGES[lang.language].name}
                        </span>
                        <span className="text-xs text-muted">
                          {lang.level.toUpperCase()}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
                      {FLAGS[currentLanguage]}
                      <span>{languageConfig.name}</span>
                    </div>
                  )}
                  <div className="border-t border-border mt-2 pt-2">
                    <Link
                      href="/account?tab=languages"
                      onClick={() => setShowLanguageDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-english hover:bg-background-alt transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить язык
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-border text-foreground"
                      : "text-muted hover:text-foreground hover:bg-border/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="flex items-center gap-4">
            {/* Upgrade button */}
            {user?.subscriptionTier !== "premium" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/pricing")}
                className="hidden sm:flex items-center gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden md:inline">Улучшить</span>
              </Button>
            )}

            <div className="hidden md:block text-right">
              <div className="text-xs text-muted">Дней подряд</div>
              <div className="font-semibold">{user?.streakDays || 0}</div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-9 h-9 rounded-full bg-border flex items-center justify-center hover:bg-border/80 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>

              {showProfileDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="font-medium truncate">
                      {user?.displayName || user?.email?.split("@")[0]}
                    </div>
                    <div className="text-sm text-muted truncate">
                      {user?.email}
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-background-alt transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Настройки
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-background-alt transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily progress */}
        <div className="pb-3">
          <div className="flex items-center gap-3">
            <Progress
              value={35}
              language={currentLanguage}
              className="flex-1 h-1.5"
            />
            <span className="text-xs text-muted">7/20 мин</span>
          </div>
        </div>
      </div>
    </header>
  );
}
