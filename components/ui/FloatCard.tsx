import { useState, type ReactNode, type CSSProperties } from "react";

export const CARD_BASE: CSSProperties = {
  background: "#131109",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.07)",
  boxShadow:
    "0 2px 16px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
};

export const CARD_HOVER: CSSProperties = {
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
  transform: "translateY(-2px)",
  borderColor: "rgba(255,255,255,0.11)",
};

export function FloatCard({
  children,
  className = "",
  style = {},
  interactive = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        ...CARD_BASE,
        transition: interactive
          ? "transform 0.18s ease-out, box-shadow 0.18s ease-out, border-color 0.18s ease-out"
          : undefined,
        ...(interactive && hov ? CARD_HOVER : {}),
        ...style,
      }}
      onMouseEnter={interactive ? () => setHov(true) : undefined}
      onMouseLeave={interactive ? () => setHov(false) : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
