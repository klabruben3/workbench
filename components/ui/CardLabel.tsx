import type { ReactNode } from "react";

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-4"
      style={{ color: "#4a4a40", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </div>
  );
}
