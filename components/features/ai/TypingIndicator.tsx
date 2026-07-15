import { MauriceAvatar } from "./MauriceAvatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <MauriceAvatar size={28} />
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-md"
        style={{
          background: "#131109",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#5a5a4a",
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}
