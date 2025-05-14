import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book } from "lucide-react";
import { Satua } from "@/types/satua";

export function RelevantDocDialog({ attachment }: { attachment: Satua }) {
  const sentences = attachment.content
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim() !== "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge
          variant="secondary"
          className="hover:bg-secondary/90 cursor-pointer"
        >
          <Book />
          {attachment.title}
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-hidden lg:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>{attachment.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-96">
          {sentences.map((sentence, i) => (
            <span
              className="cursor-pointer hover:bg-black/10 hover:dark:bg-white/10"
              key={i}
            >
              {sentence}
              &nbsp;
            </span>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
