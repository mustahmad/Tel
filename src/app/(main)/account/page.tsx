"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Languages, Trash2, Plus, Check, Sparkles, Crown, LogOut } from "lucide-react";
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

// Анимации
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateUser, addLanguage, removeLanguage, logout } = useUserStore();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [displayName, setDisplayName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(15);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [selectedNewLanguage, setSelectedNewLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>("starter");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setDailyGoal(user.dailyGoal || 15);
    }
  }, [user]);

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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-muted">Вы не авторизованы</p>
          <Button variant="primary" onClick={() => router.push("/login")}>
            Войти
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold"
      >
        Настройки аккаунта
      </motion.h1>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 border-b border-border relative"
      >
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 transition-colors relative ${
            activeTab === "profile" ? "text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          Профиль
          {activeTab === "profile" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-english"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("languages")}
          className={`flex items-center gap-2 px-4 py-2 transition-colors relative ${
            activeTab === "languages" ? "text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <Languages className="w-4 h-4" />
          Языки
          {activeTab === "languages" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-english"
            />
          )}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-english/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-english" />
                    Личные данные
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
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
                      className="transition-all focus:ring-2 focus:ring-english/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Дневная цель (минут)
                    </label>
                    <div className="flex gap-2">
                      {[10, 15, 20, 30].map((goal) => (
                        <motion.button
                          key={goal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDailyGoal(goal)}
                          className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                            dailyGoal === goal
                              ? "border-english bg-english/10 text-english shadow-sm"
                              : "border-border hover:border-english/50 hover:bg-english/5"
                          }`}
                        >
                          {goal}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.div
                        key="saved"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-success font-medium flex items-center gap-2 bg-success/10 px-4 py-2 rounded-lg"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-5 h-5" />
                        </motion.div>
                        Сохранено!
                      </motion.div>
                    ) : (
                      <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Button
                          variant="primary"
                          onClick={handleSaveProfile}
                          className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Сохранить изменения
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    Подписка
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {user?.subscriptionTier === "premium" ? (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Premium
                          </>
                        ) : user?.subscriptionTier === "pro" ? (
                          "Pro"
                        ) : (
                          "Бесплатный план"
                        )}
                      </div>
                      <div className="text-sm text-muted">
                        {user?.subscriptionTier === "premium"
                          ? "Максимум возможностей"
                          : user?.subscriptionTier === "pro"
                            ? "Полный доступ к урокам"
                            : "Доступ к первым урокам каждого уровня"}
                      </div>
                    </div>
                    {user?.subscriptionTier !== "premium" && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="english"
                          onClick={() => router.push("/pricing")}
                          className="group-hover:shadow-md transition-shadow"
                        >
                          {user?.subscriptionTier === "pro" ? "Перейти на Premium" : "Улучшить"}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-error/30 overflow-hidden hover:shadow-lg hover:border-error/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-error flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Выйти из аккаунта
                      </div>
                      <div className="text-sm text-muted">
                        Вы будете перенаправлены на страницу входа
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" onClick={handleLogout}>
                        Выйти
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Languages Tab */}
        {activeTab === "languages" && (
          <motion.div
            key="languages"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-english/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-english" />
                    Мои языки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {userLanguages.length > 0 ? (
                    <AnimatePresence>
                      {userLanguages.map((lang, index) => (
                        <motion.div
                          key={lang.language}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                          className="flex items-center gap-4 p-4 border border-border rounded-xl transition-colors hover:border-english/30"
                        >
                          <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.3 }}>
                            {FLAGS[lang.language]}
                          </motion.div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {LANGUAGES[lang.language].name}
                            </div>
                            <div className="text-sm text-muted">
                              Уровень: {lang.level.toUpperCase()}
                            </div>
                          </div>
                          {user?.currentLanguage === lang.language && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs bg-english/10 text-english px-2 py-1 rounded font-medium"
                            >
                              Активный
                            </motion.span>
                          )}
                          {userLanguages.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#ef4444" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveLanguage(lang.language)}
                              className="p-2 text-muted transition-colors"
                              title="Удалить язык"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Languages className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      </motion.div>
                      <p>Добавьте язык для изучения</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Add new language */}
            <AnimatePresence mode="wait">
              {!showAddLanguage ? (
                <motion.div
                  key="add-button"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setShowAddLanguage(true)}
                    className="w-full border-dashed border-2 hover:border-english hover:bg-english/5 transition-all"
                    disabled={availableLanguages.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить язык
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="add-form" variants={scaleIn}>
                  <Card className="overflow-hidden border-english/30">
                    <CardHeader className="bg-gradient-to-r from-english/10 to-transparent">
                      <CardTitle>Добавить новый язык</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Выберите язык</label>
                        <div className="grid gap-2">
                          {availableLanguages.map((lang, index) => (
                            <motion.button
                              key={lang.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedNewLanguage(lang.id)}
                              className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${
                                selectedNewLanguage === lang.id
                                  ? "border-english bg-english/5 shadow-sm"
                                  : "border-border hover:border-english/50"
                              }`}
                            >
                              {FLAGS[lang.id]}
                              <span className="font-medium">{lang.name}</span>
                              <span className="text-sm text-muted">{lang.nameNative}</span>
                              {selectedNewLanguage === lang.id && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="ml-auto"
                                >
                                  <Check className="w-5 h-5 text-english" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedNewLanguage && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <label className="block text-sm font-medium mb-2">Ваш уровень</label>
                            <div className="flex flex-wrap gap-2">
                              {LEVELS.map((level, index) => (
                                <motion.button
                                  key={level.id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setSelectedLevel(level.id)}
                                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                                    selectedLevel === level.id
                                      ? "border-english bg-english/10 text-english shadow-sm"
                                      : "border-border hover:border-english/50"
                                  }`}
                                >
                                  {level.label}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setShowAddLanguage(false);
                            setSelectedNewLanguage(null);
                          }}
                        >
                          Отмена
                        </Button>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="primary"
                            onClick={handleAddLanguage}
                            disabled={!selectedNewLanguage}
                          >
                            Добавить язык
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto p-8 text-center text-muted">
        <div className="w-8 h-8 border-2 border-english border-t-transparent rounded-full mx-auto animate-spin" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
