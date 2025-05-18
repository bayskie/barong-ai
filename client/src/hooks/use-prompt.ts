import { PromptRequest, PromptResponse } from "@/types/prompt";
import { useState } from "react";

export function usePrompt() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<PromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendPrompt = async ({
    question,
    model = "deepseek-r1:8b",
  }: PromptRequest) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, model }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(
        data || {
          answer: "",
          relevant_docs: [],
        },
      );
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { sendPrompt, loading, response, error };
}
