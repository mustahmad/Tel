"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, CardTitle, CardContent, Progress } from "@/components/ui";
import { useUserStore } from "@/stores";
import type { Language, Level } from "@/types";

type OnboardingStep = "language" | "level" | "goal";

const languages: Array<{ id: Language; name: string; nameNative: string; color: string }> = [
  { id: "en", name: "Английский", nameNative: "English", color: "english" },
  { id: "ar", name: "Арабский", nameNative: "العربية", color: "arabic" },
  { id: "fr", name: "Французский", nameNative: "Français", color: "french" },
];

const levels: Array<{ id: Level | "beginner"; label: string; description: string }> = [
  { id: "beginner", label: "Никогда не учил", description: "Начну с нуля" },
  { id: "a1", label: "Немного знаю", description: "Знаю базовые фразы" },
  { id: "a2", label: "Учился раньше", description: "Могу поддержать простой разговор" },
];

const goals = [
  { id: "speak", label: "Говорить", description: "Свободно общаться" },
  { id: "read", label: "Читать", description: "Понимать тексты" },
  { id: "work", label: "Для работы", description: "Профессиональное общение" },
  { id: "travel", label: "Для путешествий", description: "Базовое общение в поездках" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setLanguage, setLevel } = useUserStore();

  const [step, setStep] = useState<OnboardingStep>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | "beginner" | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const progress = step === "language" ? 33 : step === "level" ? 66 : 100;

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
    setStep("level");
  };

  const handleLevelSelect = (level: Level | "beginner") => {
    setSelectedLevel(level);
    const actualLevel = level === "beginner" ? "starter" : level;
    setLevel(actualLevel);
    setStep("goal");
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    router.push("/dashboard");
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      english: "border-english bg-english-light hover:border-english-dark",
      arabic: "border-arabic bg-arabic-light hover:border-arabic-dark",
      french: "border-french bg-french-light hover:border-french-dark",
    };
    return colors[color] || "";
  };

  return (
    <div className="space-y-6">
      <Progress value={progress} language={selectedLanguage || "en"} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {step === "language" && "Выберите язык для изучения"}
            {step === "level" && "Какой у вас уровень?"}
            {step === "goal" && "Какая ваша цель?"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "language" && (
            <div className="grid gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageSelect(lang.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${getColorClass(lang.color)}`}
                >
                  <div className="font-semibold">{lang.name}</div>
                  <div className="text-sm text-muted">{lang.nameNative}</div>
                </button>
              ))}
            </div>
          )}

          {step === "level" && (
            <div className="grid gap-4">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(level.id)}
                  className="p-4 border-2 border-border rounded-lg text-left hover:border-foreground/30 transition-all"
                >
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-sm text-muted">{level.description}</div>
                </button>
              ))}
              <Button
                variant="ghost"
                onClick={() => setStep("language")}
                className="mt-2"
              >
                Назад
              </Button>
            </div>
          )}

          {step === "goal" && (
            <div className="grid gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className="p-4 border-2 border-border rounded-lg text-left hover:border-foreground/30 transition-all"
                >
                  <div className="font-semibold">{goal.label}</div>
                  <div className="text-sm text-muted">{goal.description}</div>
                </button>
              ))}
              <Button
                variant="ghost"
                onClick={() => setStep("level")}
                className="mt-2"
              >
                Назад
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
