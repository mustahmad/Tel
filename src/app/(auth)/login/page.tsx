"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input } from "@/components/ui";
import { useUserStore } from "@/stores";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("supabase.co");
const SAVED_CREDENTIALS_KEY = "lingua-saved-credentials";

const loginSchema = z.object({
  email: z.email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type LoginForm = z.infer<typeof loginSchema>;

// Сохранение и загрузка учётных данных
const saveCredentials = (email: string, password: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SAVED_CREDENTIALS_KEY, JSON.stringify({ email, password }));
  }
};

const loadCredentials = (): { email: string; password: string } | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(SAVED_CREDENTIALS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export default function LoginPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Подписываемся на завершение гидратации
  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsubscribe;
  }, []);

  // Редирект если уже авторизован
  useEffect(() => {
    if (hasHydrated && user) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, user, router]);

  // Загружаем сохранённые данные при монтировании
  useEffect(() => {
    const saved = loadCredentials();
    if (saved) {
      setValue("email", saved.email);
      setValue("password", saved.password);
      setHasSavedCredentials(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    // Сохраняем учётные данные для следующего входа
    saveCredentials(data.email, data.password);

    if (DEMO_MODE) {
      // Demo mode - создаём mock пользователя
      setUser({
        id: "demo-user",
        email: data.email,
        displayName: data.email.split("@")[0],
        currentLanguage: "en",
        currentLevel: "a1",
        languages: [
          { language: "en", level: "a1", startedAt: new Date().toISOString() }
        ],
        dailyGoal: 15,
        streakDays: 7,
        lastActivityDate: new Date().toISOString(),
        subscriptionTier: "free",
        createdAt: new Date().toISOString(),
      });
      router.push("/dashboard");
      return;
    }

    // Real Supabase auth
    const { createClient } = await import("@/lib/supabase");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError("Неверный email или пароль");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-english/5 to-transparent">
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5 text-english" />
            Вход в Tel
          </CardTitle>
          {DEMO_MODE && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-center text-muted mt-2"
            >
              Demo режим — введите любые данные
            </motion.p>
          )}
          {hasSavedCredentials && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-center text-english mt-2 bg-english/10 py-1 px-2 rounded"
            >
              Данные заполнены автоматически
            </motion.p>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-muted" />
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                className="transition-all focus:ring-2 focus:ring-english/20"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-error text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-muted" />
                Пароль
              </label>
              <Input
                type="password"
                placeholder="Введите пароль"
                {...register("password")}
                className="transition-all focus:ring-2 focus:ring-english/20"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-error text-sm mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-error/10 text-error text-sm p-3 rounded-md"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                variant="primary"
                className="w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Вход...
                  </motion.span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-border mt-4 pt-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted flex items-center gap-1"
          >
            Нет аккаунта?{" "}
            <Link href="/register" className="text-english hover:underline inline-flex items-center gap-1">
              <UserPlus className="w-4 h-4" />
              Зарегистрироваться
            </Link>
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
