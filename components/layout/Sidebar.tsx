import { Settings, Search, ChevronDown, Bot } from "lucide-react";
import { NAV_ITEMS } from "@/config/nav";
import type { Module } from "@/types";

export function Sidebar({
  active,
  onNavigate,
  onPaletteOpen,
}: {
  active: Module;
  onNavigate: (m: Module) => void;
  onPaletteOpen: () => void;
}) {
  return (
    <div
      className="w-60 flex flex-col h-full border-r border-border shrink-0"
      style={{ background: "#131310" }}
    >
      {/* Wordmark */}
      <div className="flex items-center px-5 pt-5 pb-3">
        <span
          className="text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif', fontSize: "18px" }}
        >
          Workbench
        </span>
        <div
          className="ml-auto w-[7px] h-[7px] rounded-full"
          style={{ background: "#7ca982" }}
          title="All synced"
        />
      </div>

      {/* Search trigger */}
      <div className="px-3 pb-3">
        <button
          onClick={onPaletteOpen}
          className="w-full flex items-center gap-2 px-3 h-[30px] rounded-[6px] text-[13px] text-muted-foreground border border-border hover:border-[rgba(240,237,230,0.18)] transition-colors"
          style={{ background: "#0a0a08" }}
        >
          <Search size={12} />
          <span className="flex-1 text-left">Search…</span>
          <span
            className="text-[11px] opacity-50"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            ⌘K
          </span>
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-1">
        {NAV_ITEMS.map(({ id, label, Icon, count }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id as Module)}
              className="w-full flex items-center gap-3 h-10 text-[14px] transition-colors duration-100"
              style={{
                paddingLeft: "10px",
                paddingRight: "12px",
                background: isActive ? "rgba(233,180,76,0.12)" : "transparent",
                color: isActive ? "#f0ede6" : "#c9c5ba",
                fontWeight: isActive ? 600 : 500,
                borderLeft: `2px solid ${isActive ? "#e9b44c" : "transparent"}`,
              }}
            >
              <Icon
                size={18}
                style={{ color: isActive ? "#e9b44c" : "#7a7a6a" }}
              />
              <span className="flex-1 text-left">{label}</span>
              {count !== undefined && !isActive && (
                <span className="text-[11px]" style={{ color: "#7a7a6a" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-border" />

        {/* Settings */}
        <button
          onClick={() => onNavigate("settings")}
          className="w-full flex items-center gap-3 h-10 text-[14px] transition-colors duration-100"
          style={{
            paddingLeft: "10px",
            paddingRight: "12px",
            background:
              active === "settings" ? "rgba(233,180,76,0.12)" : "transparent",
            color: active === "settings" ? "#f0ede6" : "#c9c5ba",
            fontWeight: active === "settings" ? 600 : 500,
            borderLeft: `2px solid ${active === "settings" ? "#e9b44c" : "transparent"}`,
          }}
        >
          <Settings
            size={18}
            style={{ color: active === "settings" ? "#e9b44c" : "#7a7a6a" }}
          />
          <span className="flex-1 text-left">Settings</span>
        </button>

        {/* AI — inert */}
        <div
          className="w-full flex items-center gap-3 h-10 text-[14px] opacity-40 select-none"
          style={{
            paddingLeft: "10px",
            paddingRight: "12px",
            color: "#c9c5ba",
            fontWeight: 500,
            borderLeft: "2px solid transparent",
          }}
        >
          <Bot size={18} style={{ color: "#7a7a6a" }} />
          <span className="flex-1 text-left">AI</span>
          <span
            className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
            style={{ background: "rgba(240,237,230,0.08)", color: "#7a7a6a" }}
          >
            Soon
          </span>
        </div>
      </nav>

      {/* Profile */}
      <div className="border-t border-border p-3">
        <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-[6px] hover:bg-secondary transition-colors">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ background: "#e9b44c", color: "#0d0d0b" }}
          >
            J
          </div>
          <span className="flex-1 text-left text-[13px] font-medium text-foreground">
            Jamie Chen
          </span>
          <ChevronDown size={13} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
