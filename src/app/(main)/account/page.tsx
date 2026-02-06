"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Languages, Trash2, Plus, Check } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from "@/components/ui";
import { useUserStore } from "@/stores";
import { LANGUAGES } from "@/lib/utils";
import type { Language, Level } from "@/types";

// SVG флаги
const FlagUK = () => (
  <svg viewBox="0 0 60 40" className="w-10 h-7 rounded shadow-sm">
    <rect fill="#012169" width="60" height="40"/>
    <path fill="#FFF" d="M0,0 L60,40 M60,0 L0,40" stroke="#FFF" strokeWidth="8"/>
    <path fill="#C8102E" d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/>
    <path fill="#FFF" d="M30,0 V40 M0,20 H60" stroke="#FFF" strokeWidth="12"/>
    <path fill="#C8102E" d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const FlagSA = () => (
  <svg viewBox="0 0 60 40" className="w-10 h-7 rounded shadow-sm">
    <rect fill="#006C35" width="60" height="40"/>
    <text x="30" y="22" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="10" fontFamily="serif">العربية</text>
  </svg>
);

const FlagFR = () => (
  <svg viewBox="0 0 60 40" className="w-10 h-7 rounded shadow-sm">
    <rect fill="#002654" width="20" height="40"/>
    <rect fill="#FFF" x="20" width="20" height="40"/>
    <rect fill="#CE1126" x="40" width="20" height="40"/>
  </svg>
);

const FLAGS: Record<Language, React.ReactNode> = {
  en: <FlagUK />,
  ar: <FlagSA />,
  fr: <FlagFR />,
};

const ALL_LANGUAGES: Array<{ id: Language; name: string; nameNative: string }> = [
  { id: "en", name: "Английский", nameNative: "English" },
  { id: "ar", name: "Арабский", nameNative: "العربية" },
  { id: "fr", name: "Французский", nameNative: "Français" },
];

const LEVELS: Array<{ id: Level; label: string }> = [
  { id: "starter", label: "Starter" },
  { id: "a1", label: "A1" },
  { id: "a2", label: "A2" },
  { id: "b1", label: "B1" },
  { id: "b2", label: "B2" },
  { id: "c1", label: "C1" },
];

type Tab = "profile" | "languages";

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateUser, addLanguage, removeLanguage, logout } = useUserStore();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 15);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [selectedNewLanguage, setSelectedNewLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>("starter");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "languages") {
      setActiveTab("languages");
    }
  }, [searchParams]);

  const handleSaveProfile = () => {
    updateUser({
      displayName: displayName || null,
      dailyGoal,
    });
  };

  const handleAddLanguage = () => {
    if (selectedNewLanguage) {
      addLanguage(selectedNewLanguage, selectedLevel);
      setShowAddLanguage(false);
      setSelectedNewLanguage(null);
      setSelectedLevel("starter");
    }
  };

  const handleRemoveLanguage = (lang: Language) => {
    if (user?.languages && user.languages.length > 1) {
      removeLanguage(lang);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userLanguages = user?.languages || [];
  const availableLanguages = ALL_LANGUAGES.filter(
    lang => !userLanguages.some(ul => ul.language === lang.id)
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Настройки аккаунта</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-english text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          Профиль
        </button>
        <button
          onClick={() => setActiveTab("languages")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "languages"
              ? "border-english text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Languages className="w-4 h-4" />
          Языки
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-background-alt"
                />
                <p className="text-xs text-muted mt-1">Email нельзя изменить</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Имя</label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Как вас называть?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Дневная цель (минут)
                </label>
                <div className="flex gap-2">
                  {[10, 15, 20, 30].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setDailyGoal(goal)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        dailyGoal === goal
                          ? "border-english bg-english/10 text-english"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="primary" onClick={handleSaveProfile}>
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Подписка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {user?.subscriptionTier === "premium" ? "Premium" : "Бесплатный план"}
                  </div>
                  <div className="text-sm text-muted">
                    {user?.subscriptionTier === "premium"
                      ? "Полный доступ ко всем урокам"
                      : "Доступ к первым урокам каждого уровня"}
                  </div>
                </div>
                {user?.subscriptionTier !== "premium" && (
                  <Button variant="english">Улучшить</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-error/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-error">Выйти из аккаунта</div>
                  <div className="text-sm text-muted">
                    Вы будете перенаправлены на страницу входа
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Languages Tab */}
      {activeTab === "languages" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Мои языки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userLanguages.length > 0 ? (
                userLanguages.map((lang) => (
                  <div
                    key={lang.language}
                    className="flex items-center gap-4 p-4 border border-border rounded-xl"
                  >
                    {FLAGS[lang.language]}
                    <div className="flex-1">
                      <div className="font-medium">
                        {LANGUAGES[lang.language].name}
                      </div>
                      <div className="text-sm text-muted">
                        Уровень: {lang.level.toUpperCase()}
                      </div>
                    </div>
                    {user?.currentLanguage === lang.language && (
                      <span className="text-xs bg-english/10 text-english px-2 py-1 rounded">
                        Активный
                      </span>
                    )}
                    {userLanguages.length > 1 && (
                      <button
                        onClick={() => handleRemoveLanguage(lang.language)}
                        className="p-2 text-muted hover:text-error transition-colors"
                        title="Удалить язык"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted">
                  <Languages className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Добавьте язык для изучения</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add new language */}
          {!showAddLanguage ? (
            <Button
              variant="outline"
              onClick={() => setShowAddLanguage(true)}
              className="w-full"
              disabled={availableLanguages.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить язык
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Добавить новый язык</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Выберите язык</label>
                  <div className="grid gap-2">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedNewLanguage(lang.id)}
                        className={`flex items-center gap-3 p-3 border rounded-xl transition-colors ${
                          selectedNewLanguage === lang.id
                            ? "border-english bg-english/5"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {FLAGS[lang.id]}
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-sm text-muted">{lang.nameNative}</span>
                        {selectedNewLanguage === lang.id && (
                          <Check className="w-4 h-4 text-english ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedNewLanguage && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Ваш уровень</label>
                    <div className="flex flex-wrap gap-2">
                      {LEVELS.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setSelectedLevel(level.id)}
                          className={`px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedLevel === level.id
                              ? "border-english bg-english/10 text-english"
                              : "border-border hover:border-foreground/30"
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowAddLanguage(false);
                      setSelectedNewLanguage(null);
                    }}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAddLanguage}
                    disabled={!selectedNewLanguage}
                  >
                    Добавить язык
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-8 text-center text-muted">Загрузка...</div>}>
      <AccountContent />
    </Suspense>
  );
}
