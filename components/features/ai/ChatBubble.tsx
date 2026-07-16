import type { ChatMessage } from "@/types";
import { MauriceAvatar } from "./MauriceAvatar";

export function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  if(typeof msg.content !== "string") return;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-md text-[14px] leading-[1.65]"
          style={{
            background: "rgba(233,180,76,0.12)",
            border: "1px solid rgba(233,180,76,0.18)",
            color: "#f0ede6",
          }}
        >
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <MauriceAvatar size={28} />
      <div
        className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-md text-[14px] leading-[1.65]"
        style={{
          background: "#131109",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "#c9c5ba",
        }}
        dangerouslySetInnerHTML={{
          __html: msg.content.replace(
            /\*\*(.+?)\*\*/g,
            '<strong style="color:#f0ede6">$1</strong>',
          ),
        }}
      />
    </div>
  );
}
