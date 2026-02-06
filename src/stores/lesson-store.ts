import { create } from "zustand";
import type { Lesson, Vocabulary, GrammarRule, Exercise } from "@/types";

interface LessonState {
  currentLesson: Lesson | null;
  vocabulary: Vocabulary[];
  grammarRules: GrammarRule[];
  exercises: Exercise[];
  currentBlockIndex: number;
  completedBlocks: number[];
  score: number;

  setLesson: (lesson: Lesson) => void;
  setVocabulary: (vocabulary: Vocabulary[]) => void;
  setGrammarRules: (rules: GrammarRule[]) => void;
  setExercises: (exercises: Exercise[]) => void;
  nextBlock: () => void;
  previousBlock: () => void;
  completeBlock: (index: number) => void;
  addScore: (points: number) => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  currentLesson: null,
  vocabulary: [],
  grammarRules: [],
  exercises: [],
  currentBlockIndex: 0,
  completedBlocks: [],
  score: 0,

  setLesson: (lesson) => set({ currentLesson: lesson, currentBlockIndex: 0, completedBlocks: [], score: 0 }),
  setVocabulary: (vocabulary) => set({ vocabulary }),
  setGrammarRules: (rules) => set({ grammarRules: rules }),
  setExercises: (exercises) => set({ exercises }),
  nextBlock: () => set((state) => ({ currentBlockIndex: state.currentBlockIndex + 1 })),
  previousBlock: () => set((state) => ({ currentBlockIndex: Math.max(0, state.currentBlockIndex - 1) })),
  completeBlock: (index) =>
    set((state) => ({
      completedBlocks: state.completedBlocks.includes(index)
        ? state.completedBlocks
        : [...state.completedBlocks, index],
    })),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  resetLesson: () =>
    set({
      currentLesson: null,
      vocabulary: [],
      grammarRules: [],
      exercises: [],
      currentBlockIndex: 0,
      completedBlocks: [],
      score: 0,
    }),
}));
