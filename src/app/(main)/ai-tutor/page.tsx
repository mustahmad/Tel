"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle, RefreshCw, Settings } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { LANGUAGES } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

const scenarios = [
  { id: "cafe", title: "В кафе", description: "Заказ еды и напитков" },
  { id: "shop", title: "В магазине", description: "Покупка товаров" },
  { id: "intro", title: "Знакомство", description: "Представление себя" },
  { id: "directions", title: "Направления", description: "Как куда-то добраться" },
  { id: "free", title: "Свободная тема", description: "Обсудить что угодно" },
];

const difficulties = [
  { id: "beginner", label: "Начинающий", description: "Простые фразы, медленно" },
  { id: "intermediate", label: "Средний", description: "Обычная речь" },
  { id: "advanced", label: "Продвинутый", description: "Сложные темы, идиомы" },
];

export default function AITutorPage() {
  const { user } = useUserStore();
  const currentLanguage = user?.currentLanguage || "en";
  const languageConfig = LANGUAGES[currentLanguage];
  const isRtl = languageConfig.isRtl;

  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = scenarios.find((s) => s.id === scenarioId);

    // Mock initial message
    const initialMessage: Message = {
      role: "assistant",
      content: getInitialMessage(scenarioId, currentLanguage),
    };
    setMessages([initialMessage]);
  };

  const getInitialMessage = (scenarioId: string, lang: string): string => {
    const greetings: Record<string, Record<string, string>> = {
      cafe: {
        en: "Hello! Welcome to our café. What would you like to order today?",
        ar: "مرحباً! أهلاً بك في مقهانا. ماذا تريد أن تطلب اليوم؟",
        fr: "Bonjour ! Bienvenue dans notre café. Que souhaitez-vous commander aujourd'hui ?",
      },
      shop: {
        en: "Good afternoon! How can I help you today?",
        ar: "مساء الخير! كيف يمكنني مساعدتك اليوم؟",
        fr: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      },
      intro: {
        en: "Hi there! I'm Alex. Nice to meet you! What's your name?",
        ar: "مرحباً! أنا أليكس. سعيد بلقائك! ما اسمك؟",
        fr: "Salut ! Je suis Alex. Enchanté ! Comment tu t'appelles ?",
      },
      directions: {
        en: "Excuse me, you look a bit lost. Can I help you find your way?",
        ar: "عفواً، تبدو تائهاً قليلاً. هل يمكنني مساعدتك في إيجاد طريقك؟",
        fr: "Excusez-moi, vous avez l'air un peu perdu. Puis-je vous aider à trouver votre chemin ?",
      },
      free: {
        en: "Hello! Feel free to talk about anything you'd like. What's on your mind?",
        ar: "مرحباً! تحدث عن أي شيء تريده. ما الذي يشغل تفكيرك؟",
        fr: "Bonjour ! N'hésitez pas à parler de ce que vous voulez. Qu'avez-vous en tête ?",
      },
    };
    return greetings[scenarioId]?.[lang] || greetings[scenarioId]?.en || "Hello!";
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Mock AI response (in real app, this would call OpenAI API)
    setTimeout(() => {
      const mockResponses: Record<string, string[]> = {
        en: [
          "That's interesting! Can you tell me more about that?",
          "I understand. How about we practice ordering something?",
          "Good job! Your English is improving. Let's continue.",
          "Excellent! You're doing great. What else would you like to discuss?",
        ],
        ar: [
          "هذا مثير للاهتمام! هل يمكنك إخباري المزيد عن ذلك؟",
          "أفهم. ما رأيك في أن نتدرب على طلب شيء ما؟",
          "أحسنت! لغتك العربية تتحسن. دعنا نستمر.",
        ],
        fr: [
          "C'est intéressant ! Pouvez-vous m'en dire plus ?",
          "Je comprends. Et si nous nous entraînions à commander quelque chose ?",
          "Bien joué ! Votre français s'améliore. Continuons.",
        ],
      };

      const responses = mockResponses[currentLanguage] || mockResponses.en;
      const response = responses[Math.floor(Math.random() * responses.length)];

      // Mock correction (randomly add corrections for demonstration)
      if (Math.random() > 0.5 && input.length > 10) {
        const mockCorrection: Correction = {
          original: input.slice(0, 20),
          corrected: input.slice(0, 20) + " (corrected)",
          explanation: "This is a mock correction for demonstration purposes.",
        };
        setCorrections((prev) => [...prev, mockCorrection]);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  const resetConversation = () => {
    setMessages([]);
    setCorrections([]);
    setSelectedScenario(null);
  };

  // Scenario selection
  if (!selectedScenario) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">AI-репетитор</h1>
          <p className="text-muted">
            Практикуй {languageConfig.name.toLowerCase()} в диалоге с AI
          </p>
        </div>

        {/* Difficulty selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Уровень сложности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={cn(
                    "p-4 border-2 rounded-lg text-left transition-all",
                    selectedDifficulty === diff.id
                      ? "border-foreground bg-border/30"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <div className="font-medium">{diff.label}</div>
                  <div className="text-sm text-muted">{diff.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scenario selection */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Выберите сценарий</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="cursor-pointer hover:border-foreground/20 transition-colors"
                onClick={() => startConversation(scenario.id)}
              >
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-1">{scenario.title}</h3>
                  <p className="text-sm text-muted">{scenario.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-xl font-bold">
            {scenarios.find((s) => s.id === selectedScenario)?.title}
          </h1>
          <p className="text-sm text-muted">
            {difficulties.find((d) => d.id === selectedDifficulty)?.label}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetConversation}>
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "user" ? "bg-english" : "bg-border"
              )}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                message.role === "user"
                  ? "bg-english text-white"
                  : "bg-border",
                isRtl && "text-right arabic-text"
              )}
              dir={isRtl ? "rtl" : "ltr"}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-border p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Corrections */}
      {corrections.length > 0 && (
        <div className="border-t border-border pt-3 pb-3">
          <div className="flex items-center gap-2 text-sm text-warning mb-2">
            <AlertCircle className="w-4 h-4" />
            Исправления
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {corrections.slice(-3).map((correction, index) => (
              <div key={index} className="text-sm p-2 bg-warning/10 rounded">
                <div className="text-error line-through">{correction.original}</div>
                <div className="text-success">{correction.corrected}</div>
                <div className="text-muted text-xs mt-1">{correction.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Напишите на ${languageConfig.name.toLowerCase()}...`}
            className={cn(isRtl && "text-right")}
            dir={isRtl ? "rtl" : "ltr"}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />
          <Button
            variant={languageConfig.color as "english" | "arabic" | "french"}
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
