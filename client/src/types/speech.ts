export interface SpeechRequest {
  text: string;
  filename?: string;
}

export type SpeechResponse = Blob;
