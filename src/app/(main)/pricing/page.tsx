"use client";

import { useRouter } from "next/navigation";
import { Check, X, Zap, Crown, Sparkles } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { useUserStore } from "@/stores";

const plans = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0",
    period: "навсегда",
    description: "Для знакомства с платформой",
    icon: Sparkles,
    color: "text-muted",
    borderColor: "border-border",
    bgColor: "bg-background",
    features: [
      { text: "Первые 3 урока каждого уровня", included: true },
      { text: "Базовый словарь (до 100 слов)", included: true },
      { text: "1 язык для изучения", included: true },
      { text: "AI-репетитор", included: false },
      { text: "Статистика прогресса", included: false },
      { text: "Офлайн доступ", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "499",
    period: "в месяц",
    description: "Для серьезного изучения языка",
    icon: Zap,
    color: "text-english",
    borderColor: "border-english",
    bgColor: "bg-english/5",
    popular: true,
    features: [
      { text: "Все уроки всех уровней", included: true },
      { text: "Безлимитный словарь", included: true },
      { text: "До 3 языков для изучения", included: true },
      { text: "AI-репетитор (50 сообщений/день)", included: true },
      { text: "Подробная статистика", included: true },
      { text: "Офлайн доступ", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "999",
    period: "в месяц",
    description: "Максимум возможностей",
    icon: Crown,
    color: "text-amber-500",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-500/5",
    features: [
      { text: "Все уроки всех уровней", included: true },
      { text: "Безлимитный словарь", included: true },
      { text: "Все языки без ограничений", included: true },
      { text: "AI-репетитор без лимитов", included: true },
      { text: "Расширенная статистика и аналитика", included: true },
      { text: "Офлайн доступ к урокам", included: true },
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();
  const currentPlan = user?.subscriptionTier || "free";

  const handleSelectPlan = (planId: string) => {
    // В демо-режиме просто обновляем tier
    // В продакшене здесь был бы Stripe checkout
    if (planId === "free") {
      updateUser({ subscriptionTier: "free" });
    } else {
      // Симуляция успешной оплаты в демо-режиме
      updateUser({ subscriptionTier: planId as "free" | "pro" | "premium" });
    }
    router.push("/account");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Выберите план</h1>
        <p className="text-muted max-w-xl mx-auto">
          Начните с бесплатного плана и перейдите на Pro или Premium, когда будете готовы к серьезному изучению языка
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative ${plan.borderColor} ${plan.bgColor} ${
                plan.popular ? "ring-2 ring-english shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-english text-white text-xs font-medium px-3 py-1 rounded-full">
                    Популярный
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className={`w-12 h-12 mx-auto rounded-xl ${plan.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${plan.color}`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold">{plan.price} ₽</span>
                  <span className="text-muted ml-1">/ {plan.period}</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-muted"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Текущий план
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === "free" ? "Выбрать" : "Перейти на " + plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted space-y-2">
        <p>Все платные планы включают 7-дневный бесплатный пробный период</p>
        <p>Отменить подписку можно в любой момент</p>
      </div>
    </div>
  );
}
