import type { ReactNode } from "react";

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground mb-3">
      {children}
    </div>
  );
}
