"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ExerciseTranslateProps {
  sourceText: string;
  correctTranslation: string;
  acceptableAnswers?: string[];
  sourceLanguage: "ru" | "en" | "ar" | "fr";
  targetLanguage: "ru" | "en" | "ar" | "fr";
  onComplete: (isCorrect: boolean) => void;
}

export function ExerciseTranslate({
  sourceText,
  correctTranslation,
  acceptableAnswers = [],
  sourceLanguage,
  targetLanguage,
  onComplete,
}: ExerciseTranslateProps) {
  const [answer, setAnswer] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const allCorrectAnswers = [correctTranslation, ...acceptableAnswers].map((a) =>
    a.toLowerCase().trim()
  );
  const isCorrect = allCorrectAnswers.includes(answer.toLowerCase().trim());
  const isTargetRtl = targetLanguage === "ar";
  const isSourceRtl = sourceLanguage === "ar";

  const handleCheck = () => {
    if (!answer.trim()) return;
    setIsChecked(true);
  };

  const handleContinue = () => {
    onComplete(isCorrect);
  };

  return (
    <div className="space-y-6">
      {/* Source text */}
      <div
        className={cn(
          "p-4 bg-border/30 rounded-lg",
          isSourceRtl && "text-right"
        )}
        dir={isSourceRtl ? "rtl" : "ltr"}
      >
        <div className="text-xs text-muted uppercase tracking-wide mb-2">
          Переведите
        </div>
        <p className={cn("text-lg font-medium", isSourceRtl && "arabic-text")}>
          {sourceText}
        </p>
      </div>

      {/* Answer input */}
      {!isChecked && (
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Введите перевод..."
            className={cn(
              "w-full p-4 border border-border rounded-lg bg-background resize-none h-24 focus:outline-none focus:ring-2 focus:ring-english",
              isTargetRtl && "text-right arabic-text"
            )}
            dir={isTargetRtl ? "rtl" : "ltr"}
          />
        </div>
      )}

      {/* Show answer after check */}
      {isChecked && (
        <div
          className={cn(
            "p-4 rounded-lg",
            isTargetRtl && "text-right"
          )}
          dir={isTargetRtl ? "rtl" : "ltr"}
        >
          <div className="text-xs text-muted uppercase tracking-wide mb-2">
            Ваш ответ
          </div>
          <p className={cn("text-lg", isTargetRtl && "arabic-text")}>{answer}</p>
        </div>
      )}

      {/* Feedback */}
      {isChecked && (
        <div
          className={cn(
            "p-4 rounded-lg",
            isCorrect ? "bg-success/10 text-success" : "bg-error/10"
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            {isCorrect ? (
              <div className="text-success flex items-center gap-2">
                <Check className="w-5 h-5" />
                Правильно!
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-error flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Неправильно
                </div>
                <div
                  className={cn("text-foreground", isTargetRtl && "text-right")}
                  dir={isTargetRtl ? "rtl" : "ltr"}
                >
                  <span className="text-muted">Правильный ответ: </span>
                  <span className={cn(isTargetRtl && "arabic-text")}>
                    {correctTranslation}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action button */}
      <Button
        variant="primary"
        className="w-full"
        onClick={isChecked ? handleContinue : handleCheck}
        disabled={!answer.trim()}
      >
        {isChecked ? "Продолжить" : "Проверить"}
      </Button>
    </div>
  );
}
