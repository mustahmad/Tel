import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Language, Level, LanguageProgress } from "@/types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  setLanguage: (language: Language) => void;
  setLevel: (level: Level) => void;
  // Новые методы для мультиязычности
  addLanguage: (language: Language, level: Level) => void;
  removeLanguage: (language: Language) => void;
  switchLanguage: (language: Language) => void;
  logout: () => void;
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

      // Добавить новый язык для изучения
      addLanguage: (language, level) =>
        set((state) => {
          if (!state.user) return state;

          // Проверяем, что язык ещё не добавлен
          const exists = state.user.languages?.some(l => l.language === language);
          if (exists) {
            // Просто переключаемся на него
            return {
              user: {
                ...state.user,
                currentLanguage: language,
                currentLevel: state.user.languages.find(l => l.language === language)?.level || level,
              }
            };
          }

          const newProgress: LanguageProgress = {
            language,
            level,
            startedAt: new Date().toISOString(),
          };

          return {
            user: {
              ...state.user,
              languages: [...(state.user.languages || []), newProgress],
              currentLanguage: language,
              currentLevel: level,
            }
          };
        }),

      // Удалить язык из изучаемых
      removeLanguage: (language) =>
        set((state) => {
          if (!state.user) return state;

          const newLanguages = state.user.languages?.filter(l => l.language !== language) || [];
          const isCurrentLanguage = state.user.currentLanguage === language;

          return {
            user: {
              ...state.user,
              languages: newLanguages,
              // Если удаляем текущий язык, переключаемся на первый оставшийся
              currentLanguage: isCurrentLanguage ? (newLanguages[0]?.language || null) : state.user.currentLanguage,
              currentLevel: isCurrentLanguage ? (newLanguages[0]?.level || null) : state.user.currentLevel,
            }
          };
        }),

      // Переключиться на другой язык
      switchLanguage: (language) =>
        set((state) => {
          if (!state.user) return state;

          const langProgress = state.user.languages?.find(l => l.language === language);
          if (!langProgress) return state;

          return {
            user: {
              ...state.user,
              currentLanguage: language,
              currentLevel: langProgress.level,
            }
          };
        }),

      // Выход из аккаунта
      logout: () => set({ user: null }),
    }),
    {
      name: "lingua-user",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
