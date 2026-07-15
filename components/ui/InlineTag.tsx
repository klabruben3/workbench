import type { ReactNode } from "react";

export function InlineTag({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[11px] px-2 py-0.5 rounded-md font-medium"
      style={{ background: "rgba(255,255,255,0.06)", color: "#9a9a88" }}
    >
      {children}
    </span>
  );
}
