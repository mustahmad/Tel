"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input } from "@/components/ui";
import { useUserStore } from "@/stores";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("supabase.co");

const registerSchema = z.object({
  email: z.email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    if (DEMO_MODE) {
      // Demo mode - создаём mock пользователя
      setUser({
        id: "demo-user",
        email: data.email,
        displayName: data.email.split("@")[0],
        currentLanguage: null,
        currentLevel: null,
        languages: [],
        dailyGoal: 15,
        streakDays: 0,
        lastActivityDate: null,
        subscriptionTier: "free",
        createdAt: new Date().toISOString(),
      });
      router.push("/onboarding");
      return;
    }

    // Real Supabase auth
    const { createClient } = await import("@/lib/supabase");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/onboarding");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Регистрация</CardTitle>
        {DEMO_MODE && (
          <p className="text-xs text-center text-muted mt-2">Demo режим — данные сохраняются локально</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Пароль</label>
            <Input
              type="password"
              placeholder="Минимум 6 символов"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Подтвердите пароль</label>
            <Input
              type="password"
              placeholder="Повторите пароль"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-error/10 text-error text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Создать аккаунт"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-english hover:underline">
            Войти
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
