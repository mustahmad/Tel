"use client";

import { useState } from "react";
import { Search, Filter, Play } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Progress } from "@/components/ui";
import { Flashcard } from "@/components/vocabulary";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { LANGUAGES } from "@/lib/utils";
import type { Vocabulary, UserVocabulary } from "@/types";

type FilterType = "all" | "new" | "learning" | "review" | "difficult";
type ViewMode = "list" | "review";

// Mock data
const mockVocabulary: Array<Vocabulary & { userVocabulary?: UserVocabulary }> = [
  {
    id: "v1",
    lessonId: "l6",
    word: "I am",
    transcription: "/aɪ æm/",
    translation: "Я есть / Я",
    exampleSentence: "I am a student.",
    exampleTranslation: "Я студент.",
    audioUrl: null,
    wordType: "phrase",
    userVocabulary: {
      id: "uv1",
      userId: "u1",
      vocabularyId: "v1",
      status: "learning",
      easeFactor: 2.5,
      interval: 3,
      repetitions: 2,
      nextReview: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  },
  {
    id: "v2",
    lessonId: "l6",
    word: "You are",
    transcription: "/juː ɑːr/",
    translation: "Ты есть / Вы есть",
    exampleSentence: "You are very kind.",
    exampleTranslation: "Ты очень добрый.",
    audioUrl: null,
    wordType: "phrase",
    userVocabulary: {
      id: "uv2",
      userId: "u1",
      vocabularyId: "v2",
      status: "known",
      easeFactor: 2.8,
      interval: 14,
      repetitions: 5,
      nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  },
  {
    id: "v3",
    lessonId: "l6",
    word: "He is",
    transcription: "/hiː ɪz/",
    translation: "Он есть",
    exampleSentence: "He is a doctor.",
    exampleTranslation: "Он врач.",
    audioUrl: null,
    wordType: "phrase",
    userVocabulary: {
      id: "uv3",
      userId: "u1",
      vocabularyId: "v3",
      status: "difficult",
      easeFactor: 1.8,
      interval: 1,
      repetitions: 1,
      nextReview: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  },
  {
    id: "v4",
    lessonId: "l6",
    word: "She is",
    transcription: "/ʃiː ɪz/",
    translation: "Она есть",
    exampleSentence: "She is a teacher.",
    exampleTranslation: "Она учитель.",
    audioUrl: null,
    wordType: "phrase",
  },
  {
    id: "v5",
    lessonId: "l6",
    word: "We are",
    transcription: "/wiː ɑːr/",
    translation: "Мы есть",
    exampleSentence: "We are friends.",
    exampleTranslation: "Мы друзья.",
    audioUrl: null,
    wordType: "phrase",
  },
];

export default function VocabularyPage() {
  const { user } = useUserStore();
  const currentLanguage = user?.currentLanguage || "en";
  const languageConfig = LANGUAGES[currentLanguage];

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const dueForReview = mockVocabulary.filter((v) => {
    if (!v.userVocabulary?.nextReview) return false;
    return new Date(v.userVocabulary.nextReview) <= new Date();
  });

  const filteredVocabulary = mockVocabulary.filter((v) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !v.word.toLowerCase().includes(searchLower) &&
        !v.translation.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    switch (filter) {
      case "new":
        return !v.userVocabulary;
      case "learning":
        return v.userVocabulary?.status === "learning";
      case "review":
        return (
          v.userVocabulary?.nextReview &&
          new Date(v.userVocabulary.nextReview) <= new Date()
        );
      case "difficult":
        return v.userVocabulary?.status === "difficult";
      default:
        return true;
    }
  });

  const handleReview = (_response: "again" | "hard" | "good" | "easy") => {
    // In real app, this would update the SRS data via Supabase
    if (currentReviewIndex < dueForReview.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setViewMode("list");
      setCurrentReviewIndex(0);
    }
  };

  // Review mode
  if (viewMode === "review" && dueForReview.length > 0) {
    const currentWord = dueForReview[currentReviewIndex];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Повторение</h1>
            <p className="text-muted">
              {currentReviewIndex + 1} / {dueForReview.length}
            </p>
          </div>
          <Button variant="outline" onClick={() => setViewMode("list")}>
            Выйти
          </Button>
        </div>

        <Progress
          value={((currentReviewIndex + 1) / dueForReview.length) * 100}
          language={currentLanguage}
          className="h-2"
        />

        <Flashcard
          word={currentWord}
          userVocabulary={currentWord.userVocabulary}
          language={currentLanguage}
          onReview={handleReview}
        />
      </div>
    );
  }

  const filters: Array<{ key: FilterType; label: string; count?: number }> = [
    { key: "all", label: "Все", count: mockVocabulary.length },
    { key: "review", label: "К повторению", count: dueForReview.length },
    {
      key: "learning",
      label: "Изучаю",
      count: mockVocabulary.filter((v) => v.userVocabulary?.status === "learning").length,
    },
    {
      key: "difficult",
      label: "Сложные",
      count: mockVocabulary.filter((v) => v.userVocabulary?.status === "difficult").length,
    },
    { key: "new", label: "Новые", count: mockVocabulary.filter((v) => !v.userVocabulary).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Личный словарь</h1>
          <p className="text-muted">{mockVocabulary.length} слов</p>
        </div>
        {dueForReview.length > 0 && (
          <Button
            variant={languageConfig.color as "english" | "arabic" | "french"}
            onClick={() => setViewMode("review")}
          >
            <Play className="w-4 h-4 mr-2" />
            Повторить ({dueForReview.length})
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск слов..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.count !== undefined && (
                <span className="ml-1.5 text-xs opacity-70">({f.count})</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Word list */}
      <div className="space-y-3">
        {filteredVocabulary.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <Filter className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted">Слова не найдены</p>
            </CardContent>
          </Card>
        ) : (
          filteredVocabulary.map((word) => (
            <Card key={word.id} className="hover:border-foreground/20 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-lg font-medium",
                          currentLanguage === "ar" && "arabic-text"
                        )}
                      >
                        {word.word}
                      </span>
                      {word.transcription && (
                        <span className="text-sm text-muted">{word.transcription}</span>
                      )}
                    </div>
                    <div className="text-muted">{word.translation}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {word.userVocabulary && (
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          word.userVocabulary.status === "known" && "bg-success/20 text-success",
                          word.userVocabulary.status === "learning" && "bg-warning/20 text-warning",
                          word.userVocabulary.status === "difficult" && "bg-error/20 text-error",
                          word.userVocabulary.status === "new" && "bg-border text-muted"
                        )}
                      >
                        {word.userVocabulary.status === "known" && "Выучено"}
                        {word.userVocabulary.status === "learning" && "Изучаю"}
                        {word.userVocabulary.status === "difficult" && "Сложное"}
                        {word.userVocabulary.status === "new" && "Новое"}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
