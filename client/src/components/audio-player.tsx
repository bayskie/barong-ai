import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Download } from "lucide-react";
import Link from "next/link";

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
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

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (value[0] / 100) * audio.duration;
    }
  };

  return (
    <Card className="w-full rounded-full">
      <CardContent>
        {/* Audio */}
        <audio ref={audioRef} src={src} preload="metadata" />
        <div className="flex w-full items-center justify-between px-4">
          <Button onClick={togglePlay} variant="outline" size="icon">
            {isPlaying ? <Pause /> : <Play />}
          </Button>

          <div className="flex w-full flex-col gap-2 px-4">
            <Slider value={[progress]} onValueChange={handleSliderChange} />
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <Button variant="outline" size="icon" asChild>
            <Link href={src} download>
              <Download />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
