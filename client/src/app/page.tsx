"use client";

import { useEffect, useRef, useState } from "react";
import { usePrompt } from "@/hooks/use-prompt";
import { useSynthesizeSpeech } from "@/hooks/use-synthesize-speech";
import { ChatMessages } from "@/components/chat-messages";
import { PromptInput } from "@/components/prompt-input";
import { Chat } from "@/types/chat";
import { motion } from "motion/react";
import { PromptRequest } from "@/types/prompt";

export default function Home() {
  const backsoundRef = useRef<HTMLAudioElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [model, setModel] =
    useState<PromptRequest["model"]>("gemini-2.0-flash");
  const models = ["llama3.2", "deepseek-r1:8b", "llama3.1", "gemini-2.0-flash"];

  const [chat, setChat] = useState<Chat[]>([]);
  const { sendPrompt, loading: promptLoading, response } = usePrompt();
  const {
    sendSpeech,
    loading: synthesizeLoading,
    audio,
  } = useSynthesizeSpeech();

  const handlePrompt = () => {
    const question = promptRef.current?.value;
    if (!question) return;
    promptRef.current!.value = "";
    sendPrompt({ question, model });
    setChat((prev) => [
      ...prev,
      { role: "user", message: question, createdAt: new Date() },
    ]);
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
      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          {
            role: "assistant",
            message: response.answer,
            attachments: response.relevant_docs,
            createdAt: new Date(),
          },
        ]);
      }, 200);
    }
  }, [response]);

  return (
    <>
      {/* Chat */}
      <div className="flex w-full max-w-3xl flex-col gap-4 px-4 lg:px-0">
        <ChatMessages
          chat={chat}
          promptLoading={promptLoading}
          synthesizeLoading={synthesizeLoading}
          handleSynthesizeSpeech={handleSynthesizeSpeech}
        />
        <div ref={bottomRef} className="mb-40" />
      </div>

      {/* Prompt */}
      <motion.div
        initial={false}
        animate={{
          top: chat.length === 0 ? 0 : "auto",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed right-0 bottom-0 left-0 flex items-center justify-center gap-4 p-4 px-4 lg:px-0"
      >
        <PromptInput
          ref={promptRef}
          model={model}
          setModel={setModel}
          models={models}
          handlePrompt={handlePrompt}
          disabled={promptLoading}
        />
      </motion.div>

      {/* Backsound */}
      <audio ref={backsoundRef} autoPlay loop hidden>
        <source
          src="music/Ratu Anom - Balinese Instrumental - Sugi Art.mp3"
          type="audio/mpeg"
        />
      </audio>
    </>
  );
}
