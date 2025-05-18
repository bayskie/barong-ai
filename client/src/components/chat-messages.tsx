import { Card, CardContent } from "@/components/ui/card";
import { DotsLoader } from "@/components/ui/dots-loader";
import { ChatMessageBubble } from "./chat-message-bubble";
import { AnimatePresence, motion } from "motion/react";
import { Chat } from "@/types/chat";

interface ChatMessagesProps {
  chat: Chat[];
  promptLoading: boolean;
  synthesizeLoading: boolean;
  handleSynthesizeSpeech: (text: string) => void;
}

export function ChatMessages({
  chat,
  promptLoading,
  synthesizeLoading,
  handleSynthesizeSpeech,
}: ChatMessagesProps) {
  return (
    <AnimatePresence initial={false}>
      {chat.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <ChatMessageBubble
            chat={c}
            synthesizeLoading={synthesizeLoading}
            handleSynthesizeSpeech={handleSynthesizeSpeech}
          />
        </motion.div>
      ))}

      {promptLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col justify-start gap-2"
        >
          <Card className="w-fit max-w-[80%] rounded-bl-none shadow-none md:max-w-3/4">
            <CardContent>
              <DotsLoader />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
