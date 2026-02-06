"use client";

import { Card, CardHeader, CardTitle, CardContent, Progress } from "@/components/ui";
import { TrendingUp, BookOpen, Clock, Target, AlertTriangle } from "lucide-react";
import { useUserStore } from "@/stores";
import { LANGUAGES } from "@/lib/utils";

// Mock data
const mockStats = {
  totalStudyTime: 420, // minutes
  totalWords: 87,
  wordsLearned: 42,
  lessonsCompleted: 12,
  currentStreak: 7,
  longestStreak: 14,
  weeklyActivity: [15, 22, 18, 30, 25, 0, 20], // minutes per day
  strongTopics: ["Приветствия", "Числа", "Цвета"],
  weakTopics: ["Глагол to be", "Артикли"],
  commonErrors: [
    { type: "Артикли", count: 23 },
    { type: "Порядок слов", count: 15 },
    { type: "Времена", count: 12 },
  ],
  levelProgress: {
    current: "a1",
    progress: 40,
  },
};

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function StatsPage() {
  const { user } = useUserStore();
  const currentLanguage = user?.currentLanguage || "en";
  const languageConfig = LANGUAGES[currentLanguage];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} мин`;
    return `${hours} ч ${mins} мин`;
  };

  const maxActivity = Math.max(...mockStats.weeklyActivity);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Статистика</h1>
        <p className="text-muted">
          Ваш прогресс в изучении {languageConfig.name.toLowerCase()}
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-english/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-english" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatTime(mockStats.totalStudyTime)}</div>
                <div className="text-sm text-muted">Всего времени</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockStats.wordsLearned}</div>
                <div className="text-sm text-muted">Слов изучено</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockStats.lessonsCompleted}</div>
                <div className="text-sm text-muted">Уроков пройдено</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-french/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-french" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockStats.currentStreak}</div>
                <div className="text-sm text-muted">Дней подряд</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Активность за неделю</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 gap-2">
            {mockStats.weeklyActivity.map((minutes, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${maxActivity ? (minutes / maxActivity) * 100 : 0}%`,
                    minHeight: minutes > 0 ? "4px" : "0",
                    backgroundColor:
                      index === mockStats.weeklyActivity.length - 1
                        ? `var(--color-${languageConfig.color})`
                        : "var(--color-border)",
                  }}
                />
                <div className="text-xs text-muted">{weekDays[index]}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-muted">
            Среднее: {Math.round(mockStats.weeklyActivity.reduce((a, b) => a + b, 0) / 7)} мин/день
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Level progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Прогресс уровня</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {mockStats.levelProgress.current.toUpperCase()}
                </span>
                <span className="text-muted">{mockStats.levelProgress.progress}%</span>
              </div>
              <Progress
                value={mockStats.levelProgress.progress}
                language={currentLanguage}
                className="h-3"
              />
              <p className="text-sm text-muted">
                До уровня A2 осталось {100 - mockStats.levelProgress.progress}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Word stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Словарный запас</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Всего слов</span>
                <span className="font-medium">{mockStats.totalWords}</span>
              </div>
              <div className="flex justify-between">
                <span>Изучено</span>
                <span className="font-medium text-success">{mockStats.wordsLearned}</span>
              </div>
              <div className="flex justify-between">
                <span>В процессе</span>
                <span className="font-medium text-warning">
                  {mockStats.totalWords - mockStats.wordsLearned}
                </span>
              </div>
              <Progress
                value={(mockStats.wordsLearned / mockStats.totalWords) * 100}
                language={currentLanguage}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strong topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Сильные темы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStats.strongTopics.map((topic, index) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-3 bg-success/10 rounded-lg"
                >
                  <span>{topic}</span>
                  <span className="text-success">90%+</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weak topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Требуют внимания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStats.weakTopics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-3 bg-warning/10 rounded-lg"
                >
                  <span>{topic}</span>
                  <span className="text-warning">&lt;70%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common errors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Частые ошибки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.commonErrors.map((error) => (
              <div key={error.type}>
                <div className="flex justify-between mb-1">
                  <span>{error.type}</span>
                  <span className="text-muted">{error.count} ошибок</span>
                </div>
                <Progress
                  value={(error.count / mockStats.commonErrors[0].count) * 100}
                  language={currentLanguage}
                  indicatorClassName="bg-error"
                  className="h-2"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted mt-4">
            Рекомендуем повторить уроки по темам с частыми ошибками
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
