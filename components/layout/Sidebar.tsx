import { Search, Settings, Bot, X, ChevronDown, LogIn } from "lucide-react";
import type { Module } from "@/types";
import { NAV_ITEMS } from "@/data/navigation";
import { Mono } from "../ui";

export function Sidebar({
  active,
  onNavigate,
  onPaletteOpen,
  onMaurice,
  onSignIn,
  isGuest,
  isMauriceActive,
  onClose,
}: {
  active: Module;
  onNavigate: (m: Module) => void;
  onPaletteOpen: () => void;
  onMaurice: () => void;
  onSignIn: () => void;
  isGuest: boolean;
  isMauriceActive: boolean;
  onClose?: () => void;
}) {
  return (
    <div
      className="w-[220px] flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(13,11,8,0.97)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow:
          "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center px-4 pt-5 pb-3">
        <span
          className="text-foreground"
          style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: "19px",
            letterSpacing: "-0.01em",
          }}
        >
          Workbench
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="w-[6px] h-[6px] rounded-full"
            style={{
              background: "#7ca982",
              boxShadow: "0 0 6px rgba(124,169,130,0.6)",
            }}
            title="All synced"
          />
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors lg:hidden ml-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <button
          onClick={onPaletteOpen}
          className="w-full flex items-center gap-2 px-3 h-8 rounded-xl text-[12px] transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#7a7a6a",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          <Search size={11} />
          <span className="flex-1 text-left">Search…</span>
          <Mono className="text-[10px] opacity-50">⌘K</Mono>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2">
        {NAV_ITEMS.map(({ id, label, Icon, count }) => {
          const isActive = active === id && !isMauriceActive;
          return (
            <button
              key={id}
              onClick={() => {
                onNavigate(id as Module);
                onClose?.();
              }}
              className="w-full flex items-center gap-2.5 h-9 text-[13px] rounded-xl mb-0.5 transition-all duration-150"
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                background: isActive ? "rgba(233,180,76,0.12)" : "transparent",
                color: isActive ? "#f0ede6" : "#7a7a6a",
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon
                size={16}
                style={{ color: isActive ? "#e9b44c" : "#5a5a4a" }}
              />
              <span className="flex-1 text-left">{label}</span>
              {count !== undefined && !isActive && (
                <Mono className="text-[10px]" style={{ color: "#4a4a40" }}>
                  {count}
                </Mono>
              )}
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{
                    background: "#e9b44c",
                    boxShadow: "0 0 4px rgba(233,180,76,0.8)",
                  }}
                />
              )}
            </button>
          );
        })}

        <div
          className="mx-2 my-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        />

        {/* Settings */}
        {(() => {
          const isActive = active === "settings" && !isMauriceActive;
          return (
            <button
              onClick={() => {
                onNavigate("settings");
                onClose?.();
              }}
              className="w-full flex items-center gap-2.5 h-9 text-[13px] rounded-xl mb-0.5 transition-all duration-150"
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                background: isActive ? "rgba(233,180,76,0.12)" : "transparent",
                color: isActive ? "#f0ede6" : "#7a7a6a",
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Settings
                size={16}
                style={{ color: isActive ? "#e9b44c" : "#5a5a4a" }}
              />
              <span className="flex-1 text-left">Settings</span>
            </button>
          );
        })()}

        {/* Maurice */}
        <button
          onClick={onMaurice}
          className="w-full flex items-center gap-2.5 h-9 text-[13px] rounded-xl mb-0.5 transition-all duration-150"
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            background: isMauriceActive
              ? "rgba(145,128,170,0.14)"
              : "transparent",
            color: isMauriceActive ? "#c9c5ba" : "#7a7a6a",
            fontWeight: isMauriceActive ? 600 : 500,
          }}
          onMouseEnter={(e) => {
            if (!isMauriceActive)
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            if (!isMauriceActive)
              e.currentTarget.style.background = "transparent";
          }}
        >
          <Bot
            size={16}
            style={{
              color: isMauriceActive ? "#9180aa" : "#5a5a4a",
              transition: "color 0.15s ease",
            }}
          />
          <span className="flex-1 text-left">Maurice</span>
          {isMauriceActive ? (
            <div
              className="w-1 h-1 rounded-full shrink-0"
              style={{
                background: "#9180aa",
                boxShadow: "0 0 4px rgba(145,128,170,0.8)",
              }}
            />
          ) : (
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "rgba(145,128,170,0.4)" }}
            />
          )}
        </button>
      </nav>

      {/* Bottom — guest or user */}
      <div
        className="p-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {isGuest ? (
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-[10px]" style={{ color: "#5a5a4a" }}>
                  G
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[12px] font-medium"
                  style={{ color: "#7a7a6a" }}
                >
                  Guest
                </div>
                <Mono className="text-[10px]" style={{ color: "#4a4a40" }}>
                  Browse only
                </Mono>
              </div>
            </div>
            <button
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-2 h-8 rounded-xl text-[12px] font-medium transition-all"
              style={{
                background: "rgba(233,180,76,0.08)",
                border: "1px solid rgba(233,180,76,0.18)",
                color: "#e9b44c",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(233,180,76,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(233,180,76,0.08)";
              }}
            >
              <LogIn size={12} /> Sign In
            </button>
          </div>
        ) : (
          <button
            className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl transition-colors"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, #e9b44c, #c9984a)",
                color: "#0d0b07",
              }}
            >
              J
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-[13px] font-semibold text-foreground leading-tight">
                Jamie Chen
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#7ca982" }}
                />
                <Mono className="text-[9px]" style={{ color: "#4a4a40" }}>
                  Online
                </Mono>
              </div>
            </div>
            <ChevronDown size={12} style={{ color: "#5a5a4a" }} />
          </button>
        )}
      </div>
    </div>
  );
}
