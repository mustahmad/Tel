"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Gauge, Eye, EyeOff } from "lucide-react";
import { Button, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrl: string;
  transcript?: string;
  transcriptTranslation?: string;
  language: "en" | "ar" | "fr";
}

export function AudioPlayer({ audioUrl, transcript, transcriptTranslation, language }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  const isRtl = language === "ar";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const toggleSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const speeds = [0.5, 0.75, 1];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newRate = speeds[nextIndex];

    audio.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Progress */}
      <Progress value={progress} language={language} className="h-2" />

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="icon" onClick={restart}>
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant="primary"
          size="icon"
          className="w-14 h-14 rounded-full"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleSpeed}>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span className="text-xs">{playbackRate}x</span>
          </div>
        </Button>
      </div>

      {/* Transcript toggle */}
      {transcript && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-muted"
          >
            {showTranscript ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Скрыть текст
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Показать текст
              </>
            )}
          </Button>
        </div>
      )}

      {/* Transcript */}
      {showTranscript && transcript && (
        <div
          className={cn(
            "p-4 bg-border/30 rounded-lg space-y-2",
            isRtl && "text-right"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <p className={cn("text-lg", isRtl && "arabic-text leading-loose")}>{transcript}</p>
          {transcriptTranslation && (
            <p className="text-sm text-muted">{transcriptTranslation}</p>
          )}
        </div>
      )}
    </div>
  );
}
