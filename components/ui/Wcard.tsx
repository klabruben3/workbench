import type { ReactNode } from "react";

export function Wcard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[10px] border border-border ${className}`}
      style={{ background: "#131310" }}
    >
      {children}
    </div>
  );
}
