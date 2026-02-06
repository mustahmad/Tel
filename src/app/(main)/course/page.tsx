"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { LANGUAGES, LEVELS } from "@/lib/utils";

// Mock data для демонстрации
const mockCourse = {
  levels: [
    {
      id: "starter",
      name: "Starter",
      description: "Нулевой уровень",
      progress: 100,
      isUnlocked: true,
      modules: [
        {
          id: "m1",
          title: "Алфавит и звуки",
          lessons: [
            { id: "l1", title: "Введение в английский", completed: true },
            { id: "l2", title: "Гласные звуки", completed: true },
            { id: "l3", title: "Согласные звуки", completed: true },
          ],
        },
      ],
    },
    {
      id: "a1",
      name: "A1",
      description: "Начальный",
      progress: 40,
      isUnlocked: true,
      modules: [
        {
          id: "m2",
          title: "Знакомство и базовая речь",
          lessons: [
            { id: "l4", title: "Приветствие и представление", completed: true },
            { id: "l5", title: "Личные местоимения", completed: true },
            { id: "l6", title: "Глагол to be", completed: false, current: true },
            { id: "l7", title: "Числа 1-20", completed: false },
          ],
        },
        {
          id: "m3",
          title: "Повседневные фразы",
          lessons: [
            { id: "l8", title: "В кафе", completed: false },
            { id: "l9", title: "В магазине", completed: false },
            { id: "l10", title: "На улице", completed: false },
          ],
        },
      ],
    },
    {
      id: "a2",
      name: "A2",
      description: "Элементарный",
      progress: 0,
      isUnlocked: false,
      modules: [],
    },
    {
      id: "b1",
      name: "B1",
      description: "Средний",
      progress: 0,
      isUnlocked: false,
      modules: [],
    },
  ],
};

export default function CoursePage() {
  const { user } = useUserStore();
  const currentLanguage = user?.currentLanguage || "en";
  const languageConfig = LANGUAGES[currentLanguage];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Карта курса</h1>
        <p className="text-muted">
          {languageConfig.name}: от нуля до продвинутого уровня
        </p>
      </div>

      {/* Levels */}
      <div className="space-y-6">
        {mockCourse.levels.map((level, levelIndex) => (
          <div key={level.id} className="relative">
            {/* Connector line */}
            {levelIndex < mockCourse.levels.length - 1 && (
              <div
                className={cn(
                  "absolute left-6 top-full w-0.5 h-6 -translate-x-1/2",
                  level.isUnlocked ? "bg-border" : "bg-border/50"
                )}
              />
            )}

            <Card
              className={cn(
                "transition-all",
                !level.isUnlocked && "opacity-60"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-bold",
                        level.progress === 100
                          ? "bg-success text-white"
                          : level.isUnlocked
                          ? `bg-${languageConfig.color}-light text-${languageConfig.color}`
                          : "bg-border text-muted"
                      )}
                      style={
                        level.progress === 100
                          ? {}
                          : level.isUnlocked
                          ? {
                              backgroundColor: `var(--color-${languageConfig.color}-light)`,
                              color: `var(--color-${languageConfig.color})`,
                            }
                          : {}
                      }
                    >
                      {level.progress === 100 ? (
                        <Check className="w-6 h-6" />
                      ) : !level.isUnlocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        level.name
                      )}
                    </div>
                    <div>
                      <CardTitle>{level.name}</CardTitle>
                      <p className="text-sm text-muted">{level.description}</p>
                    </div>
                  </div>
                  {level.isUnlocked && level.progress > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-medium">{level.progress}%</div>
                      <Progress
                        value={level.progress}
                        language={currentLanguage}
                        className="w-24 h-1.5 mt-1"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>

              {level.isUnlocked && level.modules.length > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {level.modules.map((module) => (
                      <div key={module.id} className="border-t border-border pt-4">
                        <h3 className="font-medium mb-3">{module.title}</h3>
                        <div className="grid gap-2">
                          {module.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={lesson.completed || (lesson as { current?: boolean }).current ? `/lesson/${lesson.id}` : "#"}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                lesson.completed
                                  ? "bg-success/10 hover:bg-success/20"
                                  : (lesson as { current?: boolean }).current
                                  ? "bg-border hover:bg-border/80"
                                  : "bg-border/50 cursor-not-allowed"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  lesson.completed
                                    ? "bg-success text-white"
                                    : (lesson as { current?: boolean }).current
                                    ? `bg-${languageConfig.color} text-white`
                                    : "bg-muted/30 text-muted"
                                )}
                                style={
                                  (lesson as { current?: boolean }).current
                                    ? { backgroundColor: `var(--color-${languageConfig.color})` }
                                    : {}
                                }
                              >
                                {lesson.completed ? (
                                  <Check className="w-4 h-4" />
                                ) : (lesson as { current?: boolean }).current ? (
                                  <Play className="w-4 h-4" />
                                ) : (
                                  <Lock className="w-3 h-3" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-sm",
                                  !lesson.completed && !(lesson as { current?: boolean }).current && "text-muted"
                                )}
                              >
                                {lesson.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
