"use client";

import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { Button, Progress, Card, CardContent } from "@/components/ui";
import { LessonContext } from "./lesson-context";
import { VocabularyCard } from "./vocabulary-card";
import { GrammarBlock } from "./grammar-block";
import { AudioPlayer } from "./audio-player";
import { ExerciseChoice } from "./exercise-choice";
import { ExerciseFillBlank } from "./exercise-fill-blank";
import { ExerciseTranslate } from "./exercise-translate";
import type { Lesson, Vocabulary, GrammarRule, Exercise } from "@/types";

type BlockType = "context" | "vocabulary" | "grammar" | "listening" | "practice" | "consolidation";

interface LessonBlock {
  type: BlockType;
  title: string;
}

interface LessonPlayerProps {
  lesson: Lesson;
  vocabulary: Vocabulary[];
  grammarRules: GrammarRule[];
  exercises: Exercise[];
  language: "en" | "ar" | "fr";
}

const BLOCKS: LessonBlock[] = [
  { type: "context", title: "Контекст" },
  { type: "vocabulary", title: "Лексика" },
  { type: "grammar", title: "Грамматика" },
  { type: "listening", title: "Аудирование" },
  { type: "practice", title: "Практика" },
  { type: "consolidation", title: "Закрепление" },
];

export function LessonPlayer({
  lesson,
  vocabulary,
  grammarRules,
  exercises,
  language,
}: LessonPlayerProps) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [vocabularyIndex, setVocabularyIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentBlock = BLOCKS[currentBlockIndex];
  const progress = ((currentBlockIndex + 1) / BLOCKS.length) * 100;

  const practiceExercises = exercises.filter((e) => e.blockType === "practice");
  const consolidationExercises = exercises.filter((e) => e.blockType === "consolidation");

  const handleNextBlock = () => {
    if (currentBlockIndex < BLOCKS.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
      setCurrentExerciseIndex(0);
      setVocabularyIndex(0);
    }
  };

  const handleExerciseComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
    }

    const currentExercises =
      currentBlock.type === "practice" ? practiceExercises : consolidationExercises;

    if (currentExerciseIndex < currentExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      handleNextBlock();
    }
  };

  const handleVocabularyNext = () => {
    if (vocabularyIndex < vocabulary.length - 1) {
      setVocabularyIndex(vocabularyIndex + 1);
    } else {
      handleNextBlock();
    }
  };

  const renderBlock = () => {
    switch (currentBlock.type) {
      case "context":
        return (
          <div className="space-y-6">
            <LessonContext scenario={lesson.contextScenario} text={lesson.contextText} />
            <Button variant="primary" className="w-full" onClick={handleNextBlock}>
              Продолжить
            </Button>
          </div>
        );

      case "vocabulary":
        if (vocabulary.length === 0) {
          handleNextBlock();
          return null;
        }
        return (
          <div className="space-y-6">
            <div className="text-sm text-muted text-center">
              {vocabularyIndex + 1} / {vocabulary.length}
            </div>
            <VocabularyCard word={vocabulary[vocabularyIndex]} language={language} />
            <Button variant="primary" className="w-full" onClick={handleVocabularyNext}>
              {vocabularyIndex < vocabulary.length - 1 ? "Следующее слово" : "Продолжить"}
            </Button>
          </div>
        );

      case "grammar":
        if (grammarRules.length === 0) {
          handleNextBlock();
          return null;
        }
        return (
          <div className="space-y-6">
            {grammarRules.map((rule) => (
              <GrammarBlock key={rule.id} rule={rule} language={language} />
            ))}
            <Button variant="primary" className="w-full" onClick={handleNextBlock}>
              Продолжить
            </Button>
          </div>
        );

      case "listening":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Аудирование</h2>
            <AudioPlayer
              audioUrl="/audio/sample.mp3"
              transcript="Sample transcript text"
              transcriptTranslation="Пример текста"
              language={language}
            />
            <Button variant="primary" className="w-full" onClick={handleNextBlock}>
              Продолжить
            </Button>
          </div>
        );

      case "practice":
      case "consolidation": {
        const currentExercises =
          currentBlock.type === "practice" ? practiceExercises : consolidationExercises;

        if (currentExercises.length === 0) {
          handleNextBlock();
          return null;
        }

        const exercise = currentExercises[currentExerciseIndex];
        if (!exercise) return null;

        return (
          <div className="space-y-6">
            <div className="text-sm text-muted text-center">
              {currentBlock.title}: {currentExerciseIndex + 1} / {currentExercises.length}
            </div>

            {exercise.exerciseType === "choice" && (
              <ExerciseChoice
                question={exercise.question as unknown as string}
                options={exercise.options || []}
                correctAnswer={exercise.correctAnswer as string}
                language={language}
                onComplete={handleExerciseComplete}
              />
            )}

            {exercise.exerciseType === "fill_blank" && (
              <ExerciseFillBlank
                sentence={exercise.question as unknown as string}
                correctAnswer={exercise.correctAnswer as string}
                language={language}
                onComplete={handleExerciseComplete}
              />
            )}

            {(exercise.exerciseType === "translate" ||
              exercise.exerciseType === "translate_reverse") && (
              <ExerciseTranslate
                sourceText={exercise.question as unknown as string}
                correctTranslation={exercise.correctAnswer as string}
                sourceLanguage={exercise.exerciseType === "translate" ? "ru" : language}
                targetLanguage={exercise.exerciseType === "translate" ? language : "ru"}
                onComplete={handleExerciseComplete}
              />
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Lesson complete
  if (currentBlockIndex >= BLOCKS.length) {
    const totalExercises = practiceExercises.length + consolidationExercises.length;
    const percentage = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 100;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-6">
            <div className="text-5xl mb-4">
              {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
            </div>
            <h2 className="text-2xl font-bold mb-2">Урок завершён!</h2>
            <p className="text-muted mb-6">
              Вы ответили правильно на {correctAnswers} из {totalExercises} вопросов ({percentage}%)
            </p>
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button variant="primary" className="w-full">
                  Вернуться к обучению
                </Button>
              </Link>
              <Link href="/course" className="block">
                <Button variant="outline" className="w-full">
                  К карте курса
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <Link href="/course">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1 mx-4">
              <Progress value={progress} language={language} className="h-2" />
            </div>
            <Link href="/course">
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="text-sm text-muted mb-1">{currentBlock.title}</div>
          <h1 className="text-xl font-semibold">{lesson.title}</h1>
        </div>

        {renderBlock()}
      </main>
    </div>
  );
}
