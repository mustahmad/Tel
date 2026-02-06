"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Library, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Главная", href: "/dashboard", icon: Home },
  { name: "Курс", href: "/course", icon: Library },
  { name: "Словарь", href: "/vocabulary", icon: BookOpen },
  { name: "AI", href: "/ai-tutor", icon: MessageSquare },
  { name: "Стата", href: "/stats", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive ? "text-foreground" : "text-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
