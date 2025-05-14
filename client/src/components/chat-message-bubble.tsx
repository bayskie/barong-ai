import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import { RelevantDocDialog } from "./relevant-doc-dialog";
import { Chat } from "@/types/chat";

export function ChatMessageBubble({ chat }: { chat: Chat }) {
  const { role, message, attachments } = chat;

  return (
    <div
      className={clsx("flex flex-col gap-2", {
        "items-end": role === "user",
        "items-start": role === "assistant",
      })}
    >
      <Card className="w-fit max-w-[80%] rounded-xl p-4 shadow-none md:max-w-3/4">
        <CardContent className="p-0 wrap-break-word">
          <p>{message}</p>
        </CardContent>
      </Card>

      {attachments?.map((attachment, i) => (
        <RelevantDocDialog key={i} attachment={attachment} />
      ))}
    </div>
  );
}
