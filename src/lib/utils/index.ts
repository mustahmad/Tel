export { cn } from "./cn";

export type Language = "en" | "ar" | "fr";
export type Level = "starter" | "a1" | "a2" | "b1" | "b2" | "c1";

export const LANGUAGES: Record<Language, { name: string; nameNative: string; isRtl: boolean; color: string }> = {
  en: { name: "Английский", nameNative: "English", isRtl: false, color: "english" },
  ar: { name: "Арабский", nameNative: "العربية", isRtl: true, color: "arabic" },
  fr: { name: "Французский", nameNative: "Français", isRtl: false, color: "french" },
};

export const LEVELS: Record<Level, { name: string; description: string }> = {
  starter: { name: "Starter", description: "Нулевой уровень" },
  a1: { name: "A1", description: "Начальный" },
  a2: { name: "A2", description: "Элементарный" },
  b1: { name: "B1", description: "Средний" },
  b2: { name: "B2", description: "Выше среднего" },
  c1: { name: "C1", description: "Продвинутый" },
};

export function getLanguageColor(language: Language): string {
  return LANGUAGES[language].color;
}
