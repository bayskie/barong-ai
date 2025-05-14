import { SpeechResponse } from "@/types/speech";
import { useState } from "react";

export function useSynthesizeSpeech() {
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendSpeech = async (text: string, filename?: string) => {
    setLoading(true);
    setError(null);
    setAudio(null);

    try {
      const res = await fetch("http://localhost:8000/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, filename }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const blob = (await res.blob()) as SpeechResponse;
      setAudio(blob);
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { sendSpeech, loading, audio, error };
}
