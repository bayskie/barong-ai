"use client";

import { useEffect, useRef, useState } from "react";
import { usePrompt } from "@/hooks/use-prompt";
import { useSynthesizeSpeech } from "@/hooks/use-synthesize-speech";
import { Logo } from "@/components/logo";
import { ChatMessages } from "@/components/chat-messages";
import { PromptInput } from "@/components/prompt-input";
import { Chat } from "@/types/chat";

export default function Home() {
  const backsoundRef = useRef<HTMLAudioElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [model, setModel] = useState("deepseek-r1:8b");
  const models = ["deepseek-r1:8b", "llama3.1", "llama3.2"];

  const [chat, setChat] = useState<Chat[]>([]);
  const { sendPrompt, loading: promptLoading, response } = usePrompt();
  const { sendSpeech, loading: speechLoading, audio } = useSynthesizeSpeech();

  const handlePrompt = () => {
    const prompt = promptRef.current?.value;
    if (!prompt) return;
    promptRef.current!.value = "";
    sendPrompt(prompt);
    setChat((prev) => [...prev, { role: "user", message: prompt }]);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const handleSynthesizeSpeech = async (text: string) => {
    await sendSpeech(text);
    if (audio) {
      const url = URL.createObjectURL(audio);
      new Audio(url).play();
    }
  };

  useEffect(() => {
    if (backsoundRef.current) backsoundRef.current.volume = 0.3;
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
    <div className="relative flex w-full flex-col items-center px-4 py-8 md:px-40">
      <audio ref={backsoundRef} autoPlay loop hidden>
        <source
          src="music/Ratu Anom - Balinese Instrumental - Sugi Art.mp3"
          type="audio/mpeg"
        />
      </audio>

      <header className="bg-background fixed top-0 right-0 left-0 flex h-20 items-center gap-4 border-b px-4 shadow-xs">
        <div className="logo relative z-20 flex items-center gap-2">
          <Logo />
        </div>

        <div className="from-background absolute inset-0 z-10 bg-gradient-to-r via-transparent to-transparent"></div>
        <div className="absolute inset-0 z-0 bg-[url('/image/balinese-pattern-black.svg')] bg-repeat opacity-10 dark:bg-[url('/image/balinese-pattern-white.svg')]"></div>
      </header>

      <main className="mt-20 flex w-3xl flex-col gap-4">
        <ChatMessages chat={chat} promptLoading={promptLoading} />
        <div ref={bottomRef} className="mb-60" />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex items-center justify-center gap-4 py-4">
        <PromptInput
          ref={promptRef}
          model={model}
          setModel={setModel}
          models={models}
          handlePrompt={handlePrompt}
          // handleSpeech={handleSpeech}
          disabled={promptLoading}
        />
      </footer>

      {/* Background */}
      <div className="fixed right-0 bottom-0 left-0 -z-10 h-1/2 bg-[url('/image/balinese-pattern-black.svg')] bg-[length:360px] bg-repeat opacity-1.5 dark:bg-[url('/image/balinese-pattern-white.svg')]" />
      <div className="from-background fixed right-0 bottom-0 left-0 -z-10 h-1/2 bg-gradient-to-b via-transparent to-transparent" />
    </div>
  );
}
