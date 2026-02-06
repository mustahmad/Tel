"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Header, MobileNav } from "@/components/shared";
import { useUserStore } from "@/stores";

// Страницы, доступные без авторизации
const PUBLIC_PAGES = ["/pricing"];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  // Проверяем авторизацию после гидратации
  useEffect(() => {
    if (!hasHydrated) return;

    // Публичные страницы доступны всем
    if (PUBLIC_PAGES.includes(pathname)) return;

    // Если нет пользователя - редирект на логин
    if (!user) {
      router.replace("/login");
    }
  }, [hasHydrated, user, pathname, router]);

  // Ждём гидратации
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-english border-t-transparent rounded-full mx-auto animate-spin" />
          <p className="text-muted text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Нет пользователя и не публичная страница - идёт редирект
  if (!user && !PUBLIC_PAGES.includes(pathname)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-english border-t-transparent rounded-full mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
