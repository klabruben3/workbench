import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { ContextPayload, ChatMessage, ContextType } from "../../../types";
import { CARD_BASE } from "../../ui/FloatCard";
import { MauriceAvatar } from "./MauriceAvatar";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { ContextCard } from "./ContextCard";
import { Mono } from "../../ui/Mono";

export function ContextConversation({
  context,
  messages,
  typing,
  onSend,
  onClose,
}: {
  context: ContextPayload;
  messages: ChatMessage[];
  typing: boolean;
  onSend: (msg: string) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const contextLabel: Record<ContextType, string> = {
    project: "project",
    idea: "idea",
    notebook: "notebook entry",
    tech: "technology",
    thought: "thought",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Back bar */}
      <div
        className="flex items-center gap-3 px-5 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[12px] transition-colors"
          style={{ color: "#7a7a6a" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a6a")}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div
          className="w-px h-4 mx-1"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div className="flex items-center gap-2">
          <MauriceAvatar size={20} />
          <Mono className="text-[11px]" style={{ color: "#5a5a4a" }}>
            Maurice · {contextLabel[context.type]} context
          </Mono>
        </div>
      </div>

      {/* Context card — pinned, animated */}
      <div
        className="mx-5 mt-5 mb-0 rounded-2xl overflow-hidden shrink-0"
        style={{
          ...CARD_BASE,
          borderColor: "rgba(145,128,170,0.2)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(145,128,170,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        }}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(145,128,170,0.35), transparent)",
          }}
        />
        <ContextCard type={context.type} id={context.id} />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 pt-5 pb-2 flex flex-col gap-4"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 0.4s ease-out 0.15s",
        }}
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-3 shrink-0">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}
