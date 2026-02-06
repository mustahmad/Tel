"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ExerciseChoiceProps {
  question: string;
  options: string[];
  correctAnswer: string;
  language: "en" | "ar" | "fr";
  onComplete: (isCorrect: boolean) => void;
}

export function ExerciseChoice({
  question,
  options,
  correctAnswer,
  language,
  onComplete,
}: ExerciseChoiceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const isRtl = language === "ar";
  const isCorrect = selectedAnswer === correctAnswer;

  const handleSelect = (option: string) => {
    if (isChecked) return;
    setSelectedAnswer(option);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setIsChecked(true);
  };

  const handleContinue = () => {
    onComplete(isCorrect);
  };

  return (
    <div className="space-y-6">
      <div className={cn(isRtl && "text-right")} dir={isRtl ? "rtl" : "ltr"}>
        <p className={cn("text-lg font-medium", isRtl && "arabic-text")}>{question}</p>
      </div>

      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === correctAnswer;

          let buttonClass = "justify-start h-auto py-4 px-4 text-left";

          if (isChecked) {
            if (isCorrectOption) {
              buttonClass += " bg-success/20 border-success text-success hover:bg-success/20";
            } else if (isSelected && !isCorrectOption) {
              buttonClass += " bg-error/20 border-error text-error hover:bg-error/20";
            }
          } else if (isSelected) {
            buttonClass += " border-foreground";
          }

          return (
            <Button
              key={option}
              variant="outline"
              className={cn(buttonClass, isRtl && "text-right")}
              onClick={() => handleSelect(option)}
              disabled={isChecked}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    isChecked && isCorrectOption && "bg-success border-success text-white",
                    isChecked && isSelected && !isCorrectOption && "bg-error border-error text-white",
                    !isChecked && isSelected && "border-foreground",
                    !isChecked && !isSelected && "border-border"
                  )}
                >
                  {isChecked && isCorrectOption && <Check className="w-4 h-4" />}
                  {isChecked && isSelected && !isCorrectOption && <X className="w-4 h-4" />}
                </div>
                <span className={cn("flex-1", isRtl && "arabic-text")}>{option}</span>
              </div>
            </Button>
          );
        })}
      </div>

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
                Неправильно. Правильный ответ: {correctAnswer}
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
        disabled={!selectedAnswer}
      >
        {isChecked ? "Продолжить" : "Проверить"}
      </Button>
    </div>
  );
}
