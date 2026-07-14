"use client";
import { AlertCircle, Clock } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { ENTRIES } from "@/data/entries";
import { THOUGHTS } from "@/data/thoughts";
import { TECHNOLOGIES } from "@/data/technologies";
import { IDEAS } from "@/data/ideas";
import { ACTIVITY } from "@/data/activity";
import { relativeTime } from "@/lib/helpers";
import { Bar, Wcard, CardLabel, StatusPill } from "../ui";
import { useState } from "react";

export function DashboardModule() {
  const [now] = useState(() => Date.now());
  
  const active = PROJECTS.filter((p) => p.status === "active").sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );
  const blocked = PROJECTS.filter((p) => p.status === "blocked");
  const stale = PROJECTS.filter(
    (p) =>
      p.status === "active" &&
      now - p.updatedAt.getTime() > 14 * 86400000,
  );
  const attention = [
    ...blocked,
    ...stale.filter((s) => !blocked.find((b) => b.id === s.id)),
  ];

  return (
    <div className="px-8 pt-12 pb-16 max-w-[1120px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <h1
          className="text-[32px] text-foreground leading-[1.15]"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Your workbench
        </h1>
        <div className="flex gap-10 pt-1">
          {[
            {
              label: "Active Projects",
              value: PROJECTS.filter((p) => p.status === "active").length,
            },
            {
              label: "Open Blockers",
              value: PROJECTS.filter((p) => p.status === "blocked").length,
            },
            {
              label: "Entries This Week",
              value: ENTRIES.filter(
                (e) => now - e.createdAt.getTime() < 7 * 86400000,
              ).length,
            },
          ].map(({ label, value }) => (
            <div key={label} className="text-right">
              <div className="text-[24px] font-bold text-foreground leading-none">
                {value}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "65fr 35fr" }}>
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Continue working on */}
          <Wcard className="p-5">
            <CardLabel>Continue working on</CardLabel>
            {active.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">
                No active projects.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {active.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[18px] text-foreground truncate"
                        style={{ fontFamily: '"DM Serif Display", serif' }}
                      >
                        {p.name}
                      </div>
                      <div className="text-[13px] text-muted-foreground truncate mt-0.5">
                        {p.objective}
                      </div>
                    </div>
                    <StatusPill status={p.status} />
                    {p.nextAction && (
                      <span
                        className="text-[12px] px-2 py-1 rounded-[6px] shrink-0 max-w-[190px] truncate"
                        style={{
                          background: "rgba(124,169,130,0.12)",
                          color: "#7ca982",
                        }}
                      >
                        {p.nextAction}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Wcard>

          {/* Needs attention */}
          {attention.length > 0 && (
            <Wcard className="p-5">
              <CardLabel>Needs attention</CardLabel>
              <div className="flex flex-col gap-2.5">
                {attention.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-3 p-3 rounded-[6px]"
                    style={{
                      background:
                        p.status === "blocked"
                          ? "rgba(201,97,74,0.07)"
                          : "rgba(212,162,76,0.07)",
                      borderLeft: `2px solid ${p.status === "blocked" ? "#c9614a" : "#d4a24c"}`,
                    }}
                  >
                    <div className="mt-0.5 shrink-0">
                      {p.status === "blocked" ? (
                        <AlertCircle size={14} color="#c9614a" />
                      ) : (
                        <Clock size={14} color="#d4a24c" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-foreground">
                        {p.name}
                      </div>
                      <div className="text-[13px] text-muted-foreground mt-0.5 line-clamp-1">
                        {p.blocker ||
                          `Not updated in ${Math.floor((now - p.updatedAt.getTime()) / 86400000)} days`}
                      </div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                ))}
              </div>
            </Wcard>
          )}

          {/* Recent notebook entries */}
          <Wcard className="p-5">
            <CardLabel>Recent notebook entries</CardLabel>
            <div className="divide-y divide-border">
              {ENTRIES.slice(0, 5).map((e) => (
                <div
                  key={e.id}
                  className="py-3 first:pt-0 last:pb-0 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-foreground truncate group-hover:text-primary transition-colors duration-100">
                        {e.title || (
                          <span className="text-muted-foreground italic font-normal">
                            {e.preview.slice(0, 48)}…
                          </span>
                        )}
                      </div>
                      <div className="text-[13px] text-muted-foreground mt-0.5 line-clamp-1">
                        {e.preview}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(e.linkedProject || e.linkedTech) && (
                        <span
                          className="text-[11px] px-1.5 py-0.5 rounded font-medium"
                          style={{
                            background: "rgba(240,237,230,0.07)",
                            color: "#7a7a6a",
                          }}
                        >
                          {e.linkedProject || e.linkedTech}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {relativeTime(e.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Wcard>

          {/* Recent thoughts */}
          <Wcard className="p-5">
            <CardLabel>Recent thoughts</CardLabel>
            <div className="flex flex-col gap-3">
              {THOUGHTS.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-[6px] cursor-pointer"
                  style={{ borderLeft: "2px solid #7ca982" }}
                >
                  {t.title && (
                    <div className="text-[14px] font-semibold text-foreground mb-1">
                      {t.title}
                    </div>
                  )}
                  <div className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {t.preview}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2">
                    {relativeTime(t.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </Wcard>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Activity feed */}
          <Wcard className="p-5">
            <CardLabel>Activity</CardLabel>
            <div
              className="flex flex-col overflow-y-auto"
              style={{ maxHeight: "480px" }}
            >
              {ACTIVITY.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-baseline gap-2.5 py-2.5 border-b border-border last:border-0"
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full shrink-0 mt-[5px]"
                    style={{
                      background:
                        ev.entityType === "project"
                          ? "#e9b44c"
                          : ev.entityType === "notebook"
                            ? "#7a7a6a"
                            : "#7ca982",
                    }}
                  />
                  <div className="flex-1 min-w-0 text-[13px] leading-snug">
                    <span className="text-muted-foreground">{ev.verb} </span>
                    <span className="text-primary font-medium">
                      {ev.entity}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                    {relativeTime(ev.time)}
                  </span>
                </div>
              ))}
            </div>
          </Wcard>

          {/* Technology momentum */}
          <Wcard className="p-5">
            <CardLabel>Technology momentum</CardLabel>
            <div className="flex flex-col gap-4">
              {TECHNOLOGIES.filter((t) => t.entryCount >= 4)
                .slice(0, 4)
                .map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-foreground mb-1.5">
                        {t.name}
                      </div>
                      <Bar filled={t.mastery} total={4} color="#e9b44c" />
                    </div>
                    <div className="text-[11px] text-muted-foreground shrink-0">
                      {t.entryCount} entries
                    </div>
                  </div>
                ))}
            </div>
          </Wcard>

          {/* Ideas worth revisiting */}
          <Wcard className="p-5">
            <CardLabel>Ideas worth revisiting</CardLabel>
            <div className="flex flex-col gap-4">
              {IDEAS.filter((i) => i.status === "active")
                .sort((a, b) => b.importance - a.importance)
                .slice(0, 3)
                .map((idea) => (
                  <div key={idea.id} className="cursor-pointer">
                    <div className="text-[13px] font-medium text-foreground leading-snug mb-2">
                      {idea.title}
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                          Confidence
                        </div>
                        <Bar
                          filled={idea.confidence}
                          total={5}
                          color="#e9b44c"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                          Importance
                        </div>
                        <Bar
                          filled={idea.importance}
                          total={5}
                          color="#7ca982"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Wcard>
        </div>
      </div>
    </div>
  );
}
