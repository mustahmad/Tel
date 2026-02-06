"use client";

import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { GrammarRule } from "@/types";

interface GrammarBlockProps {
  rule: GrammarRule;
  language: "en" | "ar" | "fr";
}

export function GrammarBlock({ rule, language }: GrammarBlockProps) {
  const isRtl = language === "ar";
  const colorClass = {
    en: "border-english bg-english-light/30",
    ar: "border-arabic bg-arabic-light/30",
    fr: "border-french bg-french-light/30",
  }[language];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{rule.title}</h2>

      <Card className={cn("border-l-4", colorClass)}>
        <CardContent className="pt-6">
          <p className="text-foreground/90 leading-relaxed">{rule.explanation}</p>
        </CardContent>
      </Card>

      {rule.examples.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Примеры</h3>
          <div className="grid gap-3">
            {rule.examples.map((example, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 bg-border/30 rounded-lg",
                  isRtl && "text-right"
                )}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <p className={cn("font-medium", isRtl && "arabic-text")}>{example.target}</p>
                <p className="text-sm text-muted mt-1">{example.translation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
