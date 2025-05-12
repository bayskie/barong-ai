import { Satua } from "./satua";

export interface PromptRequest {
  question: string;
}

export interface PromptResponse {
  answer: string;
  relevant_docs: Satua[];
}
