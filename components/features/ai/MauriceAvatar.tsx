import { Sparkles } from "lucide-react";

export function MauriceAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-xl flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #3d2f5e, #1e1a2e)",
        border: "1px solid rgba(145,128,170,0.3)",
        boxShadow: "0 0 12px rgba(145,128,170,0.15)",
      }}
    >
      <Sparkles
        size={size * 0.45}
        style={{ color: "#9180aa" }}
        strokeWidth={1.5}
      />
    </div>
  );
}
