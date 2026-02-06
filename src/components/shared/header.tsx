"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, BookOpen, BarChart3, MessageSquare, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { LANGUAGES } from "@/lib/utils";
import { Progress } from "@/components/ui";

const navigation = [
  { name: "Обучение", href: "/dashboard", icon: BookOpen },
  { name: "Курс", href: "/course", icon: Library },
  { name: "Словарь", href: "/vocabulary", icon: BookOpen },
  { name: "AI-репетитор", href: "/ai-tutor", icon: MessageSquare },
  { name: "Статистика", href: "/stats", icon: BarChart3 },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useUserStore();

  const currentLanguage = user?.currentLanguage || "en";
  const languageConfig = LANGUAGES[currentLanguage];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo and language */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-semibold">
              Lingua
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  `bg-${languageConfig.color}`
                )}
                style={{ backgroundColor: `var(--color-${languageConfig.color})` }}
              />
              <span className="text-muted">
                {languageConfig.name} · {user?.currentLevel?.toUpperCase() || "A1"}
              </span>
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
            <div className="hidden md:block text-right">
              <div className="text-xs text-muted">Дней подряд</div>
              <div className="font-semibold">{user?.streakDays || 0}</div>
            </div>
            <button className="w-9 h-9 rounded-full bg-border flex items-center justify-center">
              <User className="w-4 h-4" />
            </button>
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
