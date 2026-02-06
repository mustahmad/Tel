import Link from "next/link";
import { Button } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-semibold">Tel</div>
          <div className="flex gap-4">
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
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Язык — это система,
            <br />
            <span className="text-muted">а не набор слов</span>
          </h1>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            Осознанное изучение языков для взрослых. Понимай структуру,
            практикуй мышление на языке, а не заучивай ради очков.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <Button variant="primary" size="xl">
                Начать бесплатно
              </Button>
            </Link>
          </div>
        </div>

        {/* Languages */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-border rounded-lg hover:border-english transition-colors">
            <div className="w-3 h-3 rounded-full bg-english mb-4" />
            <h3 className="text-lg font-semibold mb-2">Английский</h3>
            <p className="text-sm text-muted">
              Starter → C1. Структурированный подход к самому востребованному языку.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg hover:border-arabic transition-colors">
            <div className="w-3 h-3 rounded-full bg-arabic mb-4" />
            <h3 className="text-lg font-semibold mb-2">Арабский</h3>
            <p className="text-sm text-muted">
              MSA + базовые элементы живого языка. Письмо, чтение, аудирование.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg hover:border-french transition-colors">
            <div className="w-3 h-3 rounded-full bg-french mb-4" />
            <h3 className="text-lg font-semibold mb-2">Французский</h3>
            <p className="text-sm text-muted">
              От нуля до продвинутого. Фокус на понимании и реальной речи.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold mb-12">Как это работает</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="text-sm font-medium text-english mb-2">01</div>
              <h3 className="text-lg font-semibold mb-2">Контекст, не слова в вакууме</h3>
              <p className="text-muted">
                Каждый урок начинается с реальной ситуации. Ты в аэропорту,
                знакомишься с человеком, пишешь сообщение.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-english mb-2">02</div>
              <h3 className="text-lg font-semibold mb-2">Грамматика без «простыней»</h3>
              <p className="text-muted">
                Короткое правило → зачем оно нужно → пример. Сложные темы
                разбиваются на несколько уроков.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-english mb-2">03</div>
              <h3 className="text-lg font-semibold mb-2">AI-репетитор</h3>
              <p className="text-muted">
                Диалог с AI в рамках сценария урока. Исправления, объяснения,
                лучшие варианты фраз.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-english mb-2">04</div>
              <h3 className="text-lg font-semibold mb-2">Интервальное повторение</h3>
              <p className="text-muted">
                Все слова попадают в личную систему SRS. Повторяй то, что
                забываешь, а не всё подряд.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-sm text-muted">
            Tel — осознанное изучение языков
          </div>
        </div>
      </footer>
    </div>
  );
}
