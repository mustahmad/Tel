"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input } from "@/components/ui";
import { useUserStore } from "@/stores";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("supabase.co");

const loginSchema = z.object({
  email: z.email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

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
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Вход в Tel</CardTitle>
        {DEMO_MODE && (
          <p className="text-xs text-center text-muted mt-2">Demo режим — введите любые данные</p>
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
              placeholder="Введите пароль"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
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
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-english hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
