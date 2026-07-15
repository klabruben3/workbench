import type { ReactNode } from "react";

function AmberBtn({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 h-9 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90 ${className}`}
      style={{ background: "#e9b44c", color: "#0d0b07" }}
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-[12px] font-medium transition-colors ${className}`}
      style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9a9a88" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
      }
    >
      {children}
    </button>
  );
}

export { AmberBtn, GhostBtn };
