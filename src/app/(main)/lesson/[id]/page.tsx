"use client";

import { use } from "react";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { useUserStore } from "@/stores";
import type { Lesson, Vocabulary, GrammarRule, Exercise } from "@/types";

// Mock data для демонстрации
const mockLesson: Lesson = {
  id: "l6",
  moduleId: "m2",
  orderIndex: 3,
  title: "Глагол to be",
  contextText:
    "Представь, что ты на международной конференции. Тебе нужно представиться и рассказать немного о себе: кто ты, откуда, чем занимаешься.",
  contextScenario: "Ты знакомишься с новыми людьми на мероприятии",
};

const mockVocabulary: Vocabulary[] = [
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
  },
  {
    id: "v3",
    lessonId: "l6",
    word: "He is / She is",
    transcription: "/hiː ɪz/ /ʃiː ɪz/",
    translation: "Он есть / Она есть",
    exampleSentence: "She is a doctor.",
    exampleTranslation: "Она врач.",
    audioUrl: null,
    wordType: "phrase",
  },
  {
    id: "v4",
    lessonId: "l6",
    word: "We are",
    transcription: "/wiː ɑːr/",
    translation: "Мы есть",
    exampleSentence: "We are friends.",
    exampleTranslation: "Мы друзья.",
    audioUrl: null,
    wordType: "phrase",
  },
  {
    id: "v5",
    lessonId: "l6",
    word: "They are",
    transcription: "/ðeɪ ɑːr/",
    translation: "Они есть",
    exampleSentence: "They are from Russia.",
    exampleTranslation: "Они из России.",
    audioUrl: null,
    wordType: "phrase",
  },
];

const mockGrammarRules: GrammarRule[] = [
  {
    id: "g1",
    lessonId: "l6",
    title: "Глагол to be в настоящем времени",
    explanation:
      "Глагол 'to be' (быть) — один из самых важных в английском языке. В русском мы часто опускаем его ('Я студент'), но в английском он обязателен ('I am a student'). Используется для описания: кто вы, какой вы, где вы находитесь.",
    examples: [
      { target: "I am happy.", translation: "Я счастлив." },
      { target: "She is a teacher.", translation: "Она учитель." },
      { target: "We are at home.", translation: "Мы дома." },
    ],
  },
];

const mockExercises: Exercise[] = [
  {
    id: "e1",
    lessonId: "l6",
    blockType: "practice",
    exerciseType: "choice",
    orderIndex: 1,
    question: "I ___ a student." as unknown as Record<string, unknown>,
    correctAnswer: "am",
    options: ["am", "is", "are", "be"],
    audioUrl: null,
  },
  {
    id: "e2",
    lessonId: "l6",
    blockType: "practice",
    exerciseType: "choice",
    orderIndex: 2,
    question: "She ___ from London." as unknown as Record<string, unknown>,
    correctAnswer: "is",
    options: ["am", "is", "are", "be"],
    audioUrl: null,
  },
  {
    id: "e3",
    lessonId: "l6",
    blockType: "practice",
    exerciseType: "fill_blank",
    orderIndex: 3,
    question: "They ___ my friends." as unknown as Record<string, unknown>,
    correctAnswer: "are",
    options: null,
    audioUrl: null,
  },
  {
    id: "e4",
    lessonId: "l6",
    blockType: "consolidation",
    exerciseType: "translate",
    orderIndex: 1,
    question: "Я студент." as unknown as Record<string, unknown>,
    correctAnswer: "I am a student",
    options: null,
    audioUrl: null,
  },
  {
    id: "e5",
    lessonId: "l6",
    blockType: "consolidation",
    exerciseType: "translate_reverse",
    orderIndex: 2,
    question: "We are happy." as unknown as Record<string, unknown>,
    correctAnswer: "Мы счастливы",
    options: null,
    audioUrl: null,
  },
];

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUserStore();
  const currentLanguage = user?.currentLanguage || "en";

  // В реальном приложении здесь будет загрузка данных из Supabase
  console.log("Loading lesson:", id);

  return (
    <LessonPlayer
      lesson={mockLesson}
      vocabulary={mockVocabulary}
      grammarRules={mockGrammarRules}
      exercises={mockExercises}
      language={currentLanguage}
    />
  );
}
