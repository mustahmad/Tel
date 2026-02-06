export type Language = "en" | "ar" | "fr";
export type Level = "starter" | "a1" | "a2" | "b1" | "b2" | "c1";
export type SubscriptionTier = "free" | "premium";

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  currentLanguage: Language | null;
  currentLevel: Level | null;
  dailyGoal: number;
  streakDays: number;
  lastActivityDate: string | null;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
}

export interface LanguageConfig {
  id: Language;
  nameRu: string;
  nameNative: string;
  accentColor: string;
  isRtl: boolean;
}

export interface LevelConfig {
  id: Level;
  languageId: Language;
  orderIndex: number;
  name: string;
  description: string;
  isFree: boolean;
}

export interface Module {
  id: string;
  levelId: string;
  orderIndex: number;
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  orderIndex: number;
  title: string;
  contextText: string;
  contextScenario: string;
}

export interface Vocabulary {
  id: string;
  lessonId: string;
  word: string;
  transcription: string;
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
  audioUrl: string | null;
  wordType: "word" | "phrase" | "expression";
}

export interface GrammarRule {
  id: string;
  lessonId: string;
  title: string;
  explanation: string;
  examples: Array<{ target: string; translation: string }>;
}

export interface Exercise {
  id: string;
  lessonId: string;
  blockType: "practice" | "listening" | "consolidation";
  exerciseType: "choice" | "fill_blank" | "translate" | "translate_reverse" | "arrange";
  orderIndex: number;
  question: Record<string, unknown>;
  correctAnswer: string | string[];
  options: string[] | null;
  audioUrl: string | null;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number | null;
  completedAt: string | null;
}

export interface UserVocabulary {
  id: string;
  userId: string;
  vocabularyId: string;
  status: "new" | "learning" | "known" | "difficult";
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string | null;
  lastReviewed: string | null;
}

export interface AIConversation {
  id: string;
  userId: string;
  lessonId: string | null;
  scenario: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  errors: Array<{ original: string; corrected: string; explanation: string }>;
  createdAt: string;
}
