import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import clsx from "clsx";
import { AttachmentDialog } from "./attachment-dialog";
import { Chat } from "@/types/chat";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Cpu, User } from "lucide-react";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface ChatMessageBubbleProps {
  chat: Chat;
  synthesizeLoading: boolean;
  handleSynthesizeSpeech: (text: string) => void;
}

export function ChatMessageBubble({
  chat,
  synthesizeLoading,
  handleSynthesizeSpeech,
}: ChatMessageBubbleProps) {
  const { role, message, attachments } = chat;

  return (
    <div
      className={clsx("flex flex-col gap-2", {
        "items-end": role === "user",
        "items-start": role === "assistant",
      })}
    >
      <Card
        className={clsx(
          "w-fit max-w-[80%] min-w-[20%] gap-0 rounded-xl p-4 shadow-none md:max-w-3/4",
          {
            "rounded-br-none": role === "user",
            "rounded-bl-none": role === "assistant",
          },
        )}
      >
        <CardHeader className="mb-1 p-0">
          <div className="flex">
            {role === "user" ? (
              <User className="text-muted-foreground mr-2 h-4 w-4" />
            ) : (
              <Cpu className="text-muted-foreground mr-2 h-4 w-4" />
            )}
            <span className="text-muted-foreground text-xs">
              {role === "user" ? "Anda" : "Barong"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="prose prose-base dark:prose-invert mb-2 max-w-none p-0">
          <Markdown rehypePlugins={[rehypeSanitize]}>{message}</Markdown>
        </CardContent>
        <CardFooter className="justify-end p-0">
          <span className="text-muted-foreground text-xs">
            {dayjs(chat.createdAt).locale("id").format("HH:mm")}
          </span>
        </CardFooter>
      </Card>

      {attachments?.map((attachment, i) => (
        <AttachmentDialog
          key={i}
          attachment={attachment}
          synthesizeLoading={synthesizeLoading}
          handleSynthesizeSpeech={handleSynthesizeSpeech}
        />
      ))}
    </div>
  );
}
