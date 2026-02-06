"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquare, RotateCcw } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Progress } from "@/components/ui";
import { useUserStore } from "@/stores";
import { LANGUAGES } from "@/lib/utils";

// Mock data для демонстрации
const mockCurrentLesson = {
  id: "lesson-1",
  title: "Приветствие и представление",
  moduleName: "Знакомство и базовая речь",
  progress: 40,
  examplePhrase: "Hello, my name is...",
};

const mockStats = {
  wordsLearning: 24,
  wordsReview: 8,
  lessonsCompleted: 3,
  totalLessons: 12,
};

export default function DashboardPage() {
  const { user } = useUserStore();
  const currentLanguage = user?.currentLanguage || "en";
  const languageConfig = LANGUAGES[currentLanguage];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Добро пожаловать</h1>
        <p className="text-muted">
          Продолжай изучать {languageConfig.name.toLowerCase()}. Сегодня отличный день для практики.
        </p>
      </div>

      {/* Continue Lesson */}
      <Card className="relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-1 transition-all"
          style={{
            width: `${mockCurrentLesson.progress}%`,
            backgroundColor: `var(--color-${languageConfig.color})`,
          }}
        />
        <CardHeader>
          <div className="text-sm text-muted mb-1">{mockCurrentLesson.moduleName}</div>
          <CardTitle>{mockCurrentLesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted mb-4 italic">&quot;{mockCurrentLesson.examplePhrase}&quot;</p>
          <Link href={`/lesson/${mockCurrentLesson.id}`}>
            <Button variant={languageConfig.color as "english" | "arabic" | "french"} className="w-full md:w-auto">
              Продолжить урок
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/vocabulary">
          <Card className="hover:border-foreground/20 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Повторение</div>
                  <div className="text-sm text-muted">{mockStats.wordsReview} слов к повторению</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ai-tutor">
          <Card className="hover:border-foreground/20 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">AI-диалог</div>
                  <div className="text-sm text-muted">Практика общения</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/course">
          <Card className="hover:border-foreground/20 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Все уроки</div>
                  <div className="text-sm text-muted">{mockStats.lessonsCompleted}/{mockStats.totalLessons} пройдено</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Прогресс</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Уровень {user?.currentLevel?.toUpperCase() || "A1"}</span>
                <span className="text-muted">25%</span>
              </div>
              <Progress value={25} language={currentLanguage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Слов изучено</span>
                <span className="text-muted">{mockStats.wordsLearning}</span>
              </div>
              <Progress value={mockStats.wordsLearning * 2} language={currentLanguage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Words to Review */}
      {mockStats.wordsReview > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Пора повторить слова</div>
                <div className="text-sm text-muted">
                  {mockStats.wordsReview} слов готовы к повторению
                </div>
              </div>
              <Link href="/vocabulary?filter=review">
                <Button variant="outline">Повторить</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
