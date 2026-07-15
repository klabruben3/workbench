import { useState, useRef } from "react";
import { Send } from "lucide-react";

export function ChatInput({
  onSend,
  placeholder = "Message Maurice…",
}: {
  onSend: (msg: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div
      className="flex items-end gap-3 p-3 rounded-2xl"
      style={{
        background: "#131109",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        onInput={handleInput}
        placeholder={placeholder}
        rows={1}
        className="flex-1 bg-transparent text-[14px] outline-none resize-none leading-[1.6]"
        style={{
          color: "#f0ede6",
          minHeight: "24px",
          maxHeight: "160px",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim()}
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
        style={{
          background: value.trim() ? "#e9b44c" : "rgba(255,255,255,0.06)",
          color: value.trim() ? "#0d0b07" : "#4a4a40",
        }}
      >
        <Send size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
