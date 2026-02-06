import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Language, Level } from "@/types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  setLanguage: (language: Language) => void;
  setLevel: (level: Level) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setLanguage: (language) =>
        set((state) => ({
          user: state.user ? { ...state.user, currentLanguage: language } : null,
        })),
      setLevel: (level) =>
        set((state) => ({
          user: state.user ? { ...state.user, currentLevel: level } : null,
        })),
    }),
    {
      name: "lingua-user",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
