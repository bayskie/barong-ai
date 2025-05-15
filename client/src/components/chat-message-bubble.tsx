import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import clsx from "clsx";
import { RelevantDocDialog } from "./relevant-doc-dialog";
import { Chat } from "@/types/chat";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Cpu, User } from "lucide-react";

export function ChatMessageBubble({ chat }: { chat: Chat }) {
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
        <CardContent className="mb-2 p-0">
          <p className="wrap-break-word">{message}</p>
        </CardContent>
        <CardFooter className="justify-end p-0">
          <span className="text-muted-foreground text-xs">
            {dayjs(chat.createdAt).locale("id").format("HH:mm")}
          </span>
        </CardFooter>
      </Card>

      {attachments?.map((attachment, i) => (
        <RelevantDocDialog key={i} attachment={attachment} />
      ))}
    </div>
  );
}
