import { ChevronRight, Filter } from "lucide-react";
import { MODULE_META } from "@/config/nav";
import type { Module } from "@/types";

export function TopBar({ module }: { module: Module }) {
  const { crumbs } = MODULE_META[module];
  return (
    <div
      className="h-14 flex items-center justify-between px-8 border-b border-border shrink-0"
      style={{ background: "#0d0d0b" }}
    >
      <div className="flex items-center gap-1.5 text-[13px]">
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight size={12} className="text-muted-foreground" />
            )}
            <span
              style={{ color: i === crumbs.length - 1 ? "#f0ede6" : "#7a7a6a" }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] text-[12px] text-muted-foreground border border-border hover:border-[rgba(240,237,230,0.18)] transition-colors">
          <Filter size={11} /> Filter
        </button>
      </div>
    </div>
  );
}
