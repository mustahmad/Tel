"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useUserStore } from "@/stores";
import {
  Globe,
  Brain,
  MessageCircle,
  Repeat,
  Sparkles,
  ArrowRight,
  BookOpen,
  Headphones,
  PenTool
} from "lucide-react";

// SVG флаги стран
const FlagUK = () => (
  <svg viewBox="0 0 60 40" className="w-12 h-8 rounded-md shadow-sm">
    <rect fill="#012169" width="60" height="40"/>
    <path fill="#FFF" d="M0,0 L60,40 M60,0 L0,40" stroke="#FFF" strokeWidth="8"/>
    <path fill="#C8102E" d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/>
    <path fill="#FFF" d="M30,0 V40 M0,20 H60" stroke="#FFF" strokeWidth="12"/>
    <path fill="#C8102E" d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const FlagSA = () => (
  <svg viewBox="0 0 60 40" className="w-12 h-8 rounded-md shadow-sm">
    <rect fill="#006C35" width="60" height="40"/>
    <text x="30" y="22" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="10" fontFamily="serif">العربية</text>
  </svg>
);

const FlagFR = () => (
  <svg viewBox="0 0 60 40" className="w-12 h-8 rounded-md shadow-sm">
    <rect fill="#002654" width="20" height="40"/>
    <rect fill="#FFF" x="20" width="20" height="40"/>
    <rect fill="#CE1126" x="40" width="20" height="40"/>
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const { user, _hasHydrated } = useUserStore();

  // Редирект авторизованных пользователей на dashboard
  useEffect(() => {
    if (_hasHydrated && user) {
      router.replace("/dashboard");
    }
  }, [_hasHydrated, user, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-english to-english-dark flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold">Tel</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Начать</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4">
        <div className="py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-english/10 text-english text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Осознанный подход к изучению
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Язык — это система,
              <br />
              <span className="bg-gradient-to-r from-english via-arabic to-french bg-clip-text text-transparent">
                а не набор слов
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted mb-8 leading-relaxed max-w-2xl">
              Понимай структуру, практикуй мышление на языке.
              Никаких бессмысленных очков — только реальный прогресс.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button variant="primary" size="xl" className="w-full sm:w-auto">
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Как это работает
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="py-16 border-t border-border">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-8">
            Доступные языки
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-6 bg-card border border-border rounded-2xl hover:border-english hover:shadow-lg hover:shadow-english/5 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FlagUK />
                <div>
                  <h3 className="text-lg font-semibold">Английский</h3>
                  <p className="text-sm text-muted">English</p>
                </div>
              </div>
              <p className="text-muted mb-4">
                Starter → C1. Структурированный подход к самому востребованному языку.
              </p>
              <div className="flex items-center gap-2 text-english text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>Начать изучение</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="group p-6 bg-card border border-border rounded-2xl hover:border-arabic hover:shadow-lg hover:shadow-arabic/5 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FlagSA />
                <div>
                  <h3 className="text-lg font-semibold">Арабский</h3>
                  <p className="text-sm text-muted">العربية</p>
                </div>
              </div>
              <p className="text-muted mb-4">
                MSA + базовые диалекты. Письмо, чтение, аудирование с нуля.
              </p>
              <div className="flex items-center gap-2 text-arabic text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>Начать изучение</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="group p-6 bg-card border border-border rounded-2xl hover:border-french hover:shadow-lg hover:shadow-french/5 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FlagFR />
                <div>
                  <h3 className="text-lg font-semibold">Французский</h3>
                  <p className="text-sm text-muted">Français</p>
                </div>
              </div>
              <p className="text-muted mb-4">
                От нуля до продвинутого. Фокус на понимании и реальной речи.
              </p>
              <div className="flex items-center gap-2 text-french text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>Начать изучение</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-20 border-t border-border">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Научный подход к изучению, адаптированный для взрослых
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-english/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-english/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-english" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Контекст, не слова в вакууме</h3>
                <p className="text-muted">
                  Каждый урок начинается с реальной ситуации: аэропорт, знакомство, переписка.
                  Учишь то, что сразу можно использовать.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-arabic/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-arabic/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-arabic" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Грамматика без «простыней»</h3>
                <p className="text-muted">
                  Короткое правило → зачем оно нужно → пример. Сложные темы разбиты на части,
                  каждая закрепляется практикой.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-french/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-french/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-french" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">AI-репетитор</h3>
                <p className="text-muted">
                  Диалог с AI в рамках сценария урока. Мгновенные исправления, объяснения ошибок,
                  лучшие варианты фраз.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-warning/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Repeat className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Интервальное повторение</h3>
                <p className="text-muted">
                  Все слова попадают в систему SRS. Повторяй то, что забываешь,
                  а не всё подряд каждый день.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills section */}
        <div className="py-20 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Все навыки в одном месте</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-full bg-english/10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-english" />
              </div>
              <div className="font-semibold">Чтение</div>
              <div className="text-sm text-muted">Тексты и статьи</div>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-full bg-arabic/10 flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-arabic" />
              </div>
              <div className="font-semibold">Аудирование</div>
              <div className="text-sm text-muted">Диалоги и подкасты</div>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-full bg-french/10 flex items-center justify-center mx-auto mb-3">
                <PenTool className="w-6 h-6 text-french" />
              </div>
              <div className="font-semibold">Письмо</div>
              <div className="text-sm text-muted">Эссе и сообщения</div>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-success" />
              </div>
              <div className="font-semibold">Говорение</div>
              <div className="text-sm text-muted">AI-диалоги</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 border-t border-border">
          <div className="text-center bg-gradient-to-br from-english/5 via-arabic/5 to-french/5 rounded-3xl p-12 border border-border">
            <h2 className="text-3xl font-bold mb-4">Начни учить язык осознанно</h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Бесплатный доступ к первым урокам каждого языка. Без карты, без обязательств.
            </p>
            <Link href="/register">
              <Button variant="primary" size="xl">
                Создать аккаунт
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-english to-english-dark flex items-center justify-center">
                <Globe className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-muted">Tel — осознанное изучение языков</span>
            </div>
            <div className="text-sm text-muted">
              © 2024 Tel. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
