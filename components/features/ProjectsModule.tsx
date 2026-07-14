"use client";
import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { STATUS_CFG, PRIORITY_COLOR } from "@/config/status";
import { relativeTime } from "@/lib/helpers";
import type { ProjectStatus } from "@/types";
import { StatusPill } from "../ui";

export function ProjectsModule() {
  const [view, setView] = useState<"table" | "board">("table");
  const [hovered, setHovered] = useState<string | null>(null);

  const boardStatuses: ProjectStatus[] = [
    "active",
    "blocked",
    "paused",
    "shipped",
  ];

  return (
    <div className="px-8 pt-12 pb-16 max-w-[1120px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-foreground">Projects</h2>
        <div className="flex items-center gap-3">
          <div className="flex border border-border rounded-[6px] overflow-hidden">
            {(["table", "board"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 h-8 text-[13px] font-medium transition-colors capitalize"
                style={{
                  background:
                    view === v ? "rgba(240,237,230,0.1)" : "transparent",
                  color: view === v ? "#f0ede6" : "#7a7a6a",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1.5 px-4 h-9 rounded-[6px] text-[14px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#e9b44c", color: "#0d0d0b" }}
          >
            <Plus size={15} strokeWidth={2.5} /> New Project
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div
          className="rounded-[10px] border border-border overflow-hidden"
          style={{ background: "#131310" }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Status", "Priority", "Technologies", "Updated"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 cursor-pointer transition-colors duration-100"
                  style={{
                    background: hovered === p.id ? "#1a1a16" : "transparent",
                    height: "48px",
                  }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <td className="px-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-[6px] h-[6px] rounded-full shrink-0"
                        style={{ background: STATUS_CFG[p.status].color }}
                      />
                      <span className="text-[14px] font-medium text-foreground">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-5">
                    <div
                      className="w-2.5 h-2.5 rounded-[2px]"
                      style={{ background: PRIORITY_COLOR[p.priority] }}
                      title={p.priority}
                    />
                  </td>
                  <td className="px-5">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-1.5 py-[2px] rounded font-medium"
                          style={{
                            background: "rgba(240,237,230,0.07)",
                            color: "#c9c5ba",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] text-muted-foreground tabular-nums">
                        {relativeTime(p.updatedAt)}
                      </span>
                      {hovered === p.id && (
                        <button
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {boardStatuses.map((status) => (
            <div
              key={status}
              className="rounded-[10px] border border-border p-4"
              style={{ background: "#131310" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <StatusPill status={status} />
                <span className="text-[11px] text-muted-foreground">
                  {PROJECTS.filter((p) => p.status === status).length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {PROJECTS.filter((p) => p.status === status).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-[6px] border border-border cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-colors"
                    style={{ background: "#0d0d0b" }}
                  >
                    <div className="text-[14px] font-medium text-foreground">
                      {p.name}
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {p.objective}
                    </div>
                  </div>
                ))}
                {PROJECTS.filter((p) => p.status === status).length === 0 && (
                  <div className="text-[12px] text-muted-foreground py-2 text-center">
                    No projects
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
