import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import type { ChatMessage } from "../../../types";
import { MauriceAvatar } from "./MauriceAvatar";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { Mono } from "../../ui/Mono";

export function WorkspaceConversation({
  messages,
  typing,
  onSend,
  onClose,
}: {
  messages: ChatMessage[];
  typing: boolean;
  onSend: (msg: string) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const suggestions = [
    "What should I focus on today?",
    "Summarize my active projects",
    "What ideas are worth pursuing next?",
    "Find connections between my work",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "#7a7a6a" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a6a")}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <MauriceAvatar size={32} />
          <div>
            <div
              className="text-[15px] font-semibold text-foreground"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Maurice
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#9180aa",
                  boxShadow: "0 0 6px rgba(145,128,170,0.6)",
                }}
              />
              <Mono className="text-[10px]" style={{ color: "#5a5a4a" }}>
                Workspace context
              </Mono>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        {typing && <TypingIndicator />}

        {/* Prompt suggestions — show when only the primer is there */}
        {messages.length === 1 && !typing && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSend(s)}
                className="text-[12px] px-3 py-1.5 rounded-xl transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#9a9a88",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.color = "#c9c5ba";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#9a9a88";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3 shrink-0">
        <ChatInput onSend={onSend} placeholder="Ask about your workspace…" />
      </div>
    </div>
  );
}
