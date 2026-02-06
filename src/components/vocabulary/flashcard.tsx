"use client";

import { useState } from "react";
import { Volume2, RotateCcw } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getNextIntervalPreview } from "@/lib/srs";
import type { Vocabulary, UserVocabulary } from "@/types";

interface FlashcardProps {
  word: Vocabulary;
  userVocabulary?: UserVocabulary;
  language: "en" | "ar" | "fr";
  onReview: (response: "again" | "hard" | "good" | "easy") => void;
}

export function Flashcard({ word, userVocabulary, language, onReview }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const isRtl = language === "ar";

  const playAudio = () => {
    if (word.audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(word.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const srsData = userVocabulary
    ? {
        easeFactor: userVocabulary.easeFactor,
        interval: userVocabulary.interval,
        repetitions: userVocabulary.repetitions,
      }
    : {};

  const responses: Array<{ key: "again" | "hard" | "good" | "easy"; label: string; color: string }> = [
    { key: "again", label: "Повторить", color: "text-error" },
    { key: "hard", label: "Сложно", color: "text-warning" },
    { key: "good", label: "Хорошо", color: "text-success" },
    { key: "easy", label: "Легко", color: "text-english" },
  ];

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "min-h-[300px] cursor-pointer transition-all hover:shadow-md",
          !isFlipped && "hover:border-foreground/20"
        )}
        onClick={!isFlipped ? handleFlip : undefined}
      >
        <CardContent className="pt-8 pb-6 flex flex-col items-center justify-center min-h-[300px]">
          {!isFlipped ? (
            // Front side - Translation (question)
            <div className="text-center space-y-4">
              <div className="text-2xl font-medium">{word.translation}</div>
              <div className="text-sm text-muted">Нажмите, чтобы увидеть ответ</div>
            </div>
          ) : (
            // Back side - Word (answer)
            <div className={cn("text-center space-y-4", isRtl && "arabic-text")} dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex items-center justify-center gap-3">
                <div className={cn("text-3xl font-semibold", isRtl && "leading-loose")}>
                  {word.word}
                </div>
                {word.audioUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio();
                    }}
                    className={cn(isPlaying && "text-english")}
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
              {word.transcription && (
                <div className="text-muted">{word.transcription}</div>
              )}
              <div className="text-lg text-foreground/80">{word.translation}</div>
              {word.exampleSentence && (
                <div className="pt-4 border-t border-border">
                  <p className={cn("text-sm", isRtl && "leading-loose")}>{word.exampleSentence}</p>
                  <p className="text-sm text-muted mt-1">{word.exampleTranslation}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review buttons */}
      {isFlipped && (
        <div className="grid grid-cols-4 gap-2">
          {responses.map((response) => (
            <Button
              key={response.key}
              variant="outline"
              className="flex flex-col h-auto py-3"
              onClick={() => onReview(response.key)}
            >
              <span className={cn("font-medium", response.color)}>{response.label}</span>
              <span className="text-xs text-muted mt-1">
                {getNextIntervalPreview(srsData, response.key)}
              </span>
            </Button>
          ))}
        </div>
      )}

      {/* Reset button when showing answer */}
      {isFlipped && (
        <Button
          variant="ghost"
          className="w-full text-muted"
          onClick={() => setIsFlipped(false)}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Показать вопрос
        </Button>
      )}
    </div>
  );
}
