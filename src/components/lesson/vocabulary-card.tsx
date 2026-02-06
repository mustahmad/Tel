"use client";

import { useState } from "react";
import { Volume2, Star } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Vocabulary } from "@/types";

interface VocabularyCardProps {
  word: Vocabulary;
  language: "en" | "ar" | "fr";
  onMarkDifficult?: (id: string) => void;
}

export function VocabularyCard({ word, language, onMarkDifficult }: VocabularyCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMarked, setIsMarked] = useState(false);

  const playAudio = () => {
    if (word.audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(word.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleMark = () => {
    setIsMarked(!isMarked);
    onMarkDifficult?.(word.id);
  };

  const isRtl = language === "ar";

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className={cn("flex-1", isRtl && "text-right")} dir={isRtl ? "rtl" : "ltr"}>
            <div className={cn("text-2xl font-semibold mb-1", isRtl && "arabic-text")}>
              {word.word}
            </div>
            {word.transcription && (
              <div className="text-sm text-muted mb-2">{word.transcription}</div>
            )}
            <div className="text-lg text-foreground/80">{word.translation}</div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={playAudio}
              disabled={!word.audioUrl}
              className={cn(isPlaying && "text-english")}
            >
              <Volume2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMark}
              className={cn(isMarked && "text-warning")}
            >
              <Star className={cn("w-5 h-5", isMarked && "fill-current")} />
            </Button>
          </div>
        </div>

        {word.exampleSentence && (
          <div className={cn("mt-4 pt-4 border-t border-border", isRtl && "text-right")} dir={isRtl ? "rtl" : "ltr"}>
            <p className={cn("text-sm", isRtl && "arabic-text")}>{word.exampleSentence}</p>
            <p className="text-sm text-muted mt-1">{word.exampleTranslation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
