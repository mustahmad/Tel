"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, CardTitle, CardContent, Progress } from "@/components/ui";
import { useUserStore } from "@/stores";
import { Sparkles, BookOpen, GraduationCap, MessageCircle, BookText, Briefcase, Plane } from "lucide-react";
import type { Language, Level } from "@/types";

type OnboardingStep = "language" | "level" | "goal";

// SVG флаги стран
const FlagUK = () => (
  <svg viewBox="0 0 60 40" className="w-10 h-7 rounded shadow-sm">
    <rect fill="#012169" width="60" height="40"/>
    <path fill="#FFF" d="M0,0 L60,40 M60,0 L0,40" stroke="#FFF" strokeWidth="8"/>
    <path fill="#C8102E" d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/>
    <path fill="#FFF" d="M30,0 V40 M0,20 H60" stroke="#FFF" strokeWidth="12"/>
    <path fill="#C8102E" d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const FlagSA = () => (
  <svg viewBox="0 0 60 40" className="w-10 h-7 rounded shadow-sm">
    <rect fill="#006C35" width="60" height="40"/>
    <text x="30" y="20" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="8" fontFamily="serif">العربية</text>
    <path fill="#FFF" d="M15,28 L20,25 L25,28 L23,23 L28,20 L22,20 L20,15 L18,20 L12,20 L17,23 Z" transform="scale(0.6) translate(15,20)"/>
  </svg>
);

const FlagFR = () => (
  <svg viewBox="0 0 60 40" className="w-10 h-7 rounded shadow-sm">
    <rect fill="#002654" width="20" height="40"/>
    <rect fill="#FFF" x="20" width="20" height="40"/>
    <rect fill="#CE1126" x="40" width="20" height="40"/>
  </svg>
);

const languages: Array<{ id: Language; name: string; nameNative: string; color: string; flag: React.ReactNode }> = [
  { id: "en", name: "Английский", nameNative: "English", color: "english", flag: <FlagUK /> },
  { id: "ar", name: "Арабский", nameNative: "العربية", color: "arabic", flag: <FlagSA /> },
  { id: "fr", name: "Французский", nameNative: "Français", color: "french", flag: <FlagFR /> },
];

const levels: Array<{ id: Level | "beginner"; label: string; description: string; icon: React.ReactNode }> = [
  { id: "beginner", label: "Никогда не учил", description: "Начну с нуля", icon: <Sparkles className="w-6 h-6 text-amber-500" /> },
  { id: "a1", label: "Немного знаю", description: "Знаю базовые фразы", icon: <BookOpen className="w-6 h-6 text-emerald-500" /> },
  { id: "a2", label: "Учился раньше", description: "Могу поддержать простой разговор", icon: <GraduationCap className="w-6 h-6 text-blue-500" /> },
];

const goals = [
  { id: "speak", label: "Говорить", description: "Свободно общаться", icon: <MessageCircle className="w-6 h-6 text-violet-500" /> },
  { id: "read", label: "Читать", description: "Понимать тексты", icon: <BookText className="w-6 h-6 text-rose-500" /> },
  { id: "work", label: "Для работы", description: "Профессиональное общение", icon: <Briefcase className="w-6 h-6 text-slate-600" /> },
  { id: "travel", label: "Для путешествий", description: "Базовое общение в поездках", icon: <Plane className="w-6 h-6 text-sky-500" /> },
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
                  className={`p-4 border-2 rounded-xl text-left transition-all flex items-center gap-4 ${getColorClass(lang.color)}`}
                >
                  {lang.flag}
                  <div>
                    <div className="font-semibold">{lang.name}</div>
                    <div className="text-sm text-muted">{lang.nameNative}</div>
                  </div>
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
                  className="p-4 border-2 border-border rounded-xl text-left hover:border-foreground/30 hover:bg-background-alt transition-all flex items-center gap-4"
                >
                  <div className="p-2 bg-background-alt rounded-lg">
                    {level.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{level.label}</div>
                    <div className="text-sm text-muted">{level.description}</div>
                  </div>
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
                  className="p-4 border-2 border-border rounded-xl text-left hover:border-foreground/30 hover:bg-background-alt transition-all flex items-center gap-4"
                >
                  <div className="p-2 bg-background-alt rounded-lg">
                    {goal.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{goal.label}</div>
                    <div className="text-sm text-muted">{goal.description}</div>
                  </div>
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
