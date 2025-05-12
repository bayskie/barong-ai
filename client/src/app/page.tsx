"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Book, Cpu, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { usePrompt } from "@/hooks/use-prompt";
import LoadingDots from "@/components/ui/loading-dots";
import { Chat } from "@/types/chat";
import clsx from "clsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function Home() {
  const backsoundRef = useRef<HTMLAudioElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);

  const [chat, setChat] = useState<Chat[]>([]);
  const { sendPrompt, loading, response, error } = usePrompt();

  const handlePrompt = () => {
    const prompt = promptRef.current?.value;
    if (!prompt) return;

    promptRef.current!.value = "";

    sendPrompt(prompt);
    setChat((prev) => [...prev, { role: "user", message: prompt }]);
  };

  useEffect(() => {
    if (backsoundRef.current) {
      backsoundRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    if (response) {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          message: response.answer,
          attachments: response.relevant_docs,
        },
      ]);
    }
  }, [response]);

  return (
    <div className="relative container w-full px-4 py-8 md:px-40">
      {/* Background Music */}
      <audio ref={backsoundRef} autoPlay loop hidden>
        <source
          src="music/Ratu Anom - Balinese Instrumental - Sugi Art.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Header */}
      <header className="bg-background fixed top-0 right-0 left-0 flex h-20 items-center gap-4 border-b px-4">
        <div className="logo flex items-center gap-2">
          <Cpu />
          <h1 className="text-xl font-bold tracking-widest">Barong</h1>
        </div>
      </header>

      {/* Main */}
      <main className="mt-20 flex w-full flex-col gap-4">
        {/* Bot Messages */}
        {chat.map((c, index) => (
          <div
            key={index}
            className={clsx("flex flex-col gap-2", {
              "items-end": c.role === "user",
              "items-start": c.role === "assistant",
            })}
          >
            <Card
              className={clsx("w-fit max-w-[80%] shadow-none md:max-w-3/4", {
                "rounded-br-none": c.role === "user",
                "rounded-bl-none": c.role === "assistant",
              })}
            >
              <CardContent>
                <p>{c.message}</p>
              </CardContent>
            </Card>

            {/* Relevant Docs */}
            {c.attachments?.map((attachment, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="hover:bg-secondary/90 cursor-pointer"
                  >
                    <Book />
                    {attachment.title}
                  </Badge>
                </DialogTrigger>
                <DialogContent className="max-h-screen overflow-y-scroll lg:max-w-screen-lg">
                  <DialogHeader>
                    <DialogTitle>{attachment.title}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] w-full border-none">
                    <p className="break-words whitespace-pre-line">
                      {attachment.content}
                    </p>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col justify-start gap-2">
            <Card className="w-fit max-w-[80%] rounded-bl-none shadow-none md:max-w-3/4">
              <CardContent>
                <LoadingDots />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Prompt Input */}
      <div
        className={clsx(
          "fixed right-0 bottom-0 left-0 flex items-center gap-4 p-8 px-40",
          {
            "top-0": chat.length === 0,
          },
        )}
      >
        <Input
          ref={promptRef}
          type="text"
          className="w-full p-6"
          placeholder="Tanya tentang satua Bali"
          disabled={loading}
          onKeyUp={(e) => e.key === "Enter" && handlePrompt()}
        />
        <Button
          className="p-6"
          size="icon"
          onClick={handlePrompt}
          disabled={loading}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
