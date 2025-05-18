import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Languages, Send, Speech } from "lucide-react";
import clsx from "clsx";
import { forwardRef, useState } from "react";
import { PromptRequest } from "@/types/prompt";
import Link from "next/link";

interface PromptInputProps {
  model: string;
  setModel: (value: PromptRequest["model"]) => void;
  models: string[];
  handlePrompt: () => void;
  disabled: boolean;
}

export const PromptInput = forwardRef<HTMLInputElement, PromptInputProps>(
  function PromptInput(
    { model, setModel, models, handlePrompt, disabled },
    ref,
  ) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return (
      <div className="bg-card z-20 w-3xl rounded-2xl border p-4 shadow-xs">
        <div className="top mb-2">
          <Input
            ref={ref}
            type="text"
            className="w-full border-none bg-transparent p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
            placeholder="Tanya tentang satua Bali"
            disabled={disabled}
            onKeyUp={(e) => {
              if (e.key === "Enter") handlePrompt();
            }}
          />
        </div>
        <div className="bottom flex justify-between">
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                {model}
                <ChevronDown
                  className={clsx(
                    "h-4 w-4 transition-transform duration-300",
                    isDropdownOpen && "rotate-180",
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={model}
                onValueChange={(value: string) =>
                  setModel(value as PromptRequest["model"])
                }
              >
                {models.map((m) => (
                  <DropdownMenuRadioItem key={m} value={m}>
                    {m}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="right flex gap-2">
            <Button
              asChild
              size="icon"
              className="rounded-full"
              variant="secondary"
            >
              <Link href="/translate">
                <Languages />
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              className="rounded-full"
              variant="secondary"
            >
              <Link href="/synthesize">
                <Speech />
              </Link>
            </Button>
            <Button
              size="icon"
              className="rounded-full"
              onClick={handlePrompt}
              disabled={disabled}
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
