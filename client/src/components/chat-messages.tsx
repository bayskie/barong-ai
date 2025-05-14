import { Card, CardContent } from "@/components/ui/card";
import { DotsLoader } from "@/components/ui/dots-loader";
import { ChatMessageBubble } from "./chat-message-bubble";
import { Chat } from "@/types/chat";

export function ChatMessages({
  chat,
  promptLoading,
}: {
  chat: Chat[];
  promptLoading: boolean;
}) {
  return (
    <>
      {chat.map((c, index) => (
        <ChatMessageBubble key={index} chat={c} />
      ))}

      {promptLoading && (
        <div className="flex flex-col justify-start gap-2">
          <Card className="w-fit max-w-[80%] rounded-bl-none shadow-none md:max-w-3/4">
            <CardContent>
              <DotsLoader />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
