"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useSynthesizeSpeech } from "@/hooks/use-synthesize-speech";
import { Cpu, Dices, Languages, Speech } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CircleLoader } from "@/components/ui/circle-loader";
import { AudioPlayer } from "@/components/audio-player";

export default function Synthesize() {
  const MAX_WORDS = 20;
  const MIN_WORDS = 5;

  const sampleSentences = [
    "Tiang ajak timpal ngelah acara makarya ring pura.",
    "I Bapa ngajak anakne ngalaksanayang sembahyang rahina Tilem.",
    "I Meme masak lawar lan sate genyol ring pawon.",
    "Tiang ngidang ngaturangang banten punia ring sanggah.",
    "Ritatkala Galungan, krama desa nglaksanayang mepeed ring jalan utama.",
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string>("");

  const { loading, audio, error, sendSpeech } = useSynthesizeSpeech();

  const countWords = (str: string) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(text);
  const progressValue = Math.min(
    100,
    Math.round((wordCount / MAX_WORDS) * 100),
  );
  const isValid = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;

  const handleRandomText = () => {
    const randomIndex = Math.floor(Math.random() * sampleSentences.length);
    setText(sampleSentences[randomIndex]);
  };

  const handleSynthesizeSpeech = async () => {
    if (!isValid || loading) return;
    await sendSpeech(text);
  };

  useEffect(() => {
    if (audio) {
      const url = URL.createObjectURL(audio);
      setAudioURL(url);
    }
  }, [audio]);

  return (
    <>
      <div className="flex h-[calc(100vh-15rem)] w-screen flex-col items-center justify-center gap-4 px-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Bacakan Teks</CardTitle>
            <CardDescription>
              Ubah teks menjadi suara dengan Barong TTS
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan teks di sini ..."
              rows={5}
              className="h-20 resize-none"
            />

            <div className="mt-4">
              <Progress value={progressValue} />
              <p className="mt-2 text-sm">
                {wordCount} kata dari {MAX_WORDS} maksimal
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <div />
            <div className="right flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={loading}
                onClick={handleRandomText}
              >
                <Dices />
              </Button>
              <Button
                disabled={loading || !isValid}
                onClick={handleSynthesizeSpeech}
                className="flex items-center gap-2"
              >
                {loading ? <CircleLoader size={16} /> : <Speech size={16} />}
                Bacakan
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="h-34 w-full max-w-3xl">
          <CardContent>
            {audioURL && !loading ? (
              <AudioPlayer src={audioURL} />
            ) : (
              <p className="text-muted-foreground text-sm">
                Belum ada audio yang dihasilkan
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="fixed right-4 bottom-4 left-4 flex justify-center">
        <Card className="w-fit rounded-full p-2">
          <CardContent className="flex gap-2 p-0">
            <Button
              asChild
              size="icon"
              className="rounded-full"
              variant="outline"
            >
              <Link href="/">
                <Cpu />
              </Link>
            </Button>
            <Button size="icon" className="rounded-full">
              <Speech />
            </Button>
            <Button
              asChild
              size="icon"
              className="rounded-full"
              variant="outline"
            >
              <Link href="/translate">
                <Languages />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
