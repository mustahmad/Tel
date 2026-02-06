"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ExerciseFillBlankProps {
  sentence: string; // Contains ___ for the blank
  correctAnswer: string;
  hint?: string;
  language: "en" | "ar" | "fr";
  onComplete: (isCorrect: boolean) => void;
}

export function ExerciseFillBlank({
  sentence,
  correctAnswer,
  hint,
  language,
  onComplete,
}: ExerciseFillBlankProps) {
  const [answer, setAnswer] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const isRtl = language === "ar";
  const isCorrect = answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

  const handleCheck = () => {
    if (!answer.trim()) return;
    setIsChecked(true);
  };

  const handleContinue = () => {
    onComplete(isCorrect);
  };

  // Split sentence by ___
  const parts = sentence.split("___");

  return (
    <div className="space-y-6">
      <div className={cn("text-lg", isRtl && "text-right")} dir={isRtl ? "rtl" : "ltr"}>
        <span className={cn(isRtl && "arabic-text")}>{parts[0]}</span>
        <span
          className={cn(
            "inline-block min-w-[120px] mx-1 px-3 py-1 border-b-2 text-center",
            isChecked && isCorrect && "border-success text-success",
            isChecked && !isCorrect && "border-error text-error",
            !isChecked && "border-foreground"
          )}
        >
          {isChecked ? (isCorrect ? answer : correctAnswer) : answer || "..."}
        </span>
        <span className={cn(isRtl && "arabic-text")}>{parts[1]}</span>
      </div>

      {!isChecked && (
        <div>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={hint || "Введите слово"}
            className={cn("text-center text-lg", isRtl && "text-right")}
            dir={isRtl ? "rtl" : "ltr"}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
        </div>
      )}

      {/* Feedback */}
      {isChecked && (
        <div
          className={cn(
            "p-4 rounded-lg",
            isCorrect ? "bg-success/10 text-success" : "bg-error/10 text-error"
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            {isCorrect ? (
              <>
                <Check className="w-5 h-5" />
                Правильно!
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                Правильный ответ: {correctAnswer}
              </>
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
