import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import type { ContextType, ProjectStatus } from "@/types";
import { PROJECTS } from "@/data/mockData";
import { STATUS_CFG, PRIORITY_COLOR } from "@/lib/constants";
import { relativeTime } from "@/lib/helpers";

import {
  FloatCard,
  Mono,
  StatusPill,
  InlineTag,
  AmberBtn,
} from "@/components/ui";

export function ProjectsModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  const [view, setView] = useState<"table" | "board">("table");
  const [hovered, setHovered] = useState<string | null>(null);
  const boardStatuses: ProjectStatus[] = [
    "active",
    "blocked",
    "paused",
    "shipped",
  ];

  return (
    <div className="p-5 md:p-7 lg:p-8 pb-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[28px] text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Projects
        </h2>
        <div className="flex items-center gap-3">
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.09)" }}
          >
            {(["table", "board"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3.5 h-8 text-[12px] font-medium transition-colors capitalize"
                style={{
                  background:
                    view === v ? "rgba(255,255,255,0.09)" : "transparent",
                  color: view === v ? "#f0ede6" : "#7a7a6a",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <AmberBtn onClick={() => onGuardedAction(() => {})}>
            <Plus size={14} strokeWidth={2.5} /> New Project
          </AmberBtn>
        </div>
      </div>

      {view === "table" ? (
        <FloatCard className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Name", "Status", "Priority", "Technologies", "Updated"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left px-5 py-3.5"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "10px",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#4a4a40",
                      }}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p, i) => (
                <tr
                  key={p.id}
                  className="cursor-pointer transition-colors duration-100"
                  style={{
                    background:
                      hovered === p.id
                        ? "rgba(255,255,255,0.025)"
                        : "transparent",
                    borderTop:
                      i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onContext("project", p.id)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-[5px] h-[5px] rounded-full shrink-0"
                        style={{ background: STATUS_CFG[p.status].color }}
                      />
                      <span className="text-[14px] font-semibold text-foreground">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div
                      className="w-2 h-2 rounded-[3px]"
                      style={{ background: PRIORITY_COLOR[p.priority] }}
                      title={p.priority}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.technologies.slice(0, 3).map((t) => (
                        <InlineTag key={t}>{t}</InlineTag>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <Mono
                        className="text-[12px]"
                        style={{ color: "#7a7a6a" }}
                      >
                        {relativeTime(p.updatedAt)}
                      </Mono>
                      {hovered === p.id && (
                        <button
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FloatCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boardStatuses.map((status) => (
            <FloatCard key={status} className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <StatusPill status={status} />
                <Mono className="text-[10px]" style={{ color: "#4a4a40" }}>
                  {PROJECTS.filter((p) => p.status === status).length}
                </Mono>
              </div>
              <div className="flex flex-col gap-2.5">
                {PROJECTS.filter((p) => p.status === status).map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl cursor-pointer transition-colors"
                    style={{
                      background: "#0f0d0a",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onClick={() => onContext("project", p.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.14)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.07)")
                    }
                  >
                    <div className="text-[14px] font-semibold text-foreground mb-1">
                      {p.name}
                    </div>
                    <div
                      className="text-[12px] leading-relaxed line-clamp-2"
                      style={{ color: "#7a7a6a" }}
                    >
                      {p.objective}
                    </div>
                    {p.technologies.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2.5">
                        {p.technologies.slice(0, 2).map((t) => (
                          <InlineTag key={t}>{t}</InlineTag>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {PROJECTS.filter((p) => p.status === status).length === 0 && (
                  <div
                    className="text-[12px] py-4 text-center"
                    style={{ color: "#4a4a40" }}
                  >
                    No projects
                  </div>
                )}
              </div>
            </FloatCard>
          ))}
        </div>
      )}
    </div>
  );
}
