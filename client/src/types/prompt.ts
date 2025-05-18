import { Satua } from "./satua";

export interface PromptRequest {
  question: string;
  model: "deepseek-r1:8b" | "llama3.1" | "llama3.2" | "gemini-2.0-flash";
}

export interface PromptResponse {
  answer: string;
  relevant_docs: Satua[];
}
