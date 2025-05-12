import { Satua } from "./satua";

export interface Chat {
  role: "user" | "assistant";
  message: string;
  attachments?: Satua[] | null;
}
