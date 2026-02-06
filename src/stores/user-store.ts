import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Language, Level, LanguageProgress } from "@/types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  setLanguage: (language: Language) => void;
  setLevel: (level: Level) => void;
  addLanguage: (language: Language, level: Level) => void;
  removeLanguage: (language: Language) => void;
  switchLanguage: (language: Language) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      _hasHydrated: false,

      setUser: (user) => {
        console.log("setUser called:", user);
        set({ user, isLoading: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setHasHydrated: (state) => {
        console.log("Hydration state:", state);
        set({ _hasHydrated: state });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        console.log("updateUser called:", updates, "current:", currentUser);
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setLanguage: (language) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, currentLanguage: language } });
        }
      },

      setLevel: (level) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, currentLevel: level } });
        }
      },

      addLanguage: (language, level) => {
        const currentUser = get().user;
        console.log("addLanguage called:", language, level, "user:", currentUser);

        if (!currentUser) {
          console.log("No user, cannot add language");
          return;
        }

        const exists = currentUser.languages?.some(l => l.language === language);
        if (exists) {
          const existingLevel = currentUser.languages.find(l => l.language === language)?.level || level;
          set({
            user: {
              ...currentUser,
              currentLanguage: language,
              currentLevel: existingLevel,
            }
          });
          return;
        }

        const newProgress: LanguageProgress = {
          language,
          level,
          startedAt: new Date().toISOString(),
        };

        set({
          user: {
            ...currentUser,
            languages: [...(currentUser.languages || []), newProgress],
            currentLanguage: language,
            currentLevel: level,
          }
        });
        console.log("Language added successfully");
      },

      removeLanguage: (language) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const newLanguages = currentUser.languages?.filter(l => l.language !== language) || [];
        const isCurrentLanguage = currentUser.currentLanguage === language;

        set({
          user: {
            ...currentUser,
            languages: newLanguages,
            currentLanguage: isCurrentLanguage ? (newLanguages[0]?.language || null) : currentUser.currentLanguage,
            currentLevel: isCurrentLanguage ? (newLanguages[0]?.level || null) : currentUser.currentLevel,
          }
        });
      },

      switchLanguage: (language) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const langProgress = currentUser.languages?.find(l => l.language === language);
        if (!langProgress) return;

        set({
          user: {
            ...currentUser,
            currentLanguage: language,
            currentLevel: langProgress.level,
          }
        });
      },

      logout: () => {
        console.log("Logout called");
        set({ user: null, isLoading: false });
        // Очищаем localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("lingua-user");
        }
      },
    }),
    {
      name: "lingua-user",
      storage: createJSONStorage(() => {
        // Безопасная проверка на SSR
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Hydration error:", error);
        }
        console.log("Rehydration complete, state:", state?.user);
        // Используем setState напрямую, т.к. state - это просто данные, не store
        useUserStore.setState({ _hasHydrated: true });
      },
    }
  )
);
