import type { ReactNode, CSSProperties } from "react";

export function Mono({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{ fontFamily: "'JetBrains Mono', monospace", ...style }}
    >
      {children}
    </span>
  );
}
