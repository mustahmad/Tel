"use client";

import { Card, CardContent } from "@/components/ui";

interface LessonContextProps {
  scenario: string;
  text: string;
}

export function LessonContext({ scenario, text }: LessonContextProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Контекст</h2>
        <p className="text-muted">{scenario}</p>
      </div>
      <Card className="bg-border/30">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">{text}</p>
        </CardContent>
      </Card>
    </div>
  );
}
