import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import type { ContextType } from "@/types";
import {
  PROJECTS,
  IDEAS,
  ENTRIES,
  THOUGHTS,
  ACTIVITY,
  TECHNOLOGIES,
} from "@/data/mockData";
import { STATUS_CFG, PRIORITY_COLOR } from "@/lib/constants";
import { relativeTime } from "@/lib/helpers";

import {
  FloatCard,
  CardLabel,
  Mono,
  StatusPill,
  InlineTag,
  Bar,
} from "@/components/ui";

export function DashboardModule({
  onContext,
}: {
  onContext: (type: ContextType, id: string) => void;
}) {
  const active = PROJECTS.filter((p) => p.status === "active").sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );
  const blocked = PROJECTS.filter((p) => p.status === "blocked");
  const stale = PROJECTS.filter(
    (p) =>
      p.status === "active" &&
      Date.now() - p.updatedAt.getTime() > 14 * 86400000,
  );
  const attention = [
    ...blocked,
    ...stale.filter((s) => !blocked.find((b) => b.id === s.id)),
  ];
  const topIdeas = IDEAS.filter((i) => i.status === "active")
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3);
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const hero = active[0];

  return (
    <div className="p-5 md:p-7 lg:p-8 pb-20 max-w-[1300px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 md:mb-12">
        <div>
          <Mono className="text-[11px] block mb-2" style={{ color: "#4a4a40" }}>
            {dateStr}
          </Mono>
          <h1
            className="text-[36px] sm:text-[48px] text-foreground leading-[1.08]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Your workbench
          </h1>
        </div>
        <div className="flex gap-7 sm:gap-10">
          {[
            {
              label: "Active",
              value: PROJECTS.filter((p) => p.status === "active").length,
              color: "#7ca982",
            },
            {
              label: "Blocked",
              value: PROJECTS.filter((p) => p.status === "blocked").length,
              color: "#c9614a",
            },
            {
              label: "This week",
              value: ENTRIES.filter(
                (e) => Date.now() - e.createdAt.getTime() < 7 * 86400000,
              ).length,
              color: "#e9b44c",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-right">
              <div
                className="text-[30px] font-bold leading-none"
                style={{ color }}
              >
                {value}
              </div>
              <Mono
                className="text-[9px] block mt-1.5 uppercase tracking-[0.1em]"
                style={{ color: "#4a4a40" }}
              >
                {label}
              </Mono>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex flex-col gap-5 min-w-0" style={{ flex: "1.65" }}>
          {hero && (
            <FloatCard className="p-6">
              <CardLabel>Continue working on</CardLabel>
              <div
                className="p-5 rounded-xl mb-4 cursor-pointer"
                style={{
                  background: "#1a1714",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                  transition: "border-color 0.15s ease",
                }}
                onClick={() => onContext("project", hero.id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: STATUS_CFG[hero.status].color }}
                      />
                      <span
                        className="text-[26px] text-foreground leading-tight"
                        style={{ fontFamily: '"DM Serif Display", serif' }}
                      >
                        {hero.name}
                      </span>
                    </div>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: "#7a7a6a" }}
                    >
                      {hero.objective}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
                    <StatusPill status={hero.status} />
                    <Mono
                      className="text-[9px] uppercase tracking-[0.1em] font-semibold"
                      style={{ color: PRIORITY_COLOR[hero.priority] }}
                    >
                      {hero.priority} priority
                    </Mono>
                  </div>
                </div>
                {hero.nextAction && (
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium mb-3"
                    style={{
                      background: "rgba(124,169,130,0.1)",
                      color: "#7ca982",
                      border: "1px solid rgba(124,169,130,0.16)",
                    }}
                  >
                    <ArrowRight size={12} strokeWidth={2} />
                    {hero.nextAction}
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  {hero.technologies.map((t) => (
                    <InlineTag key={t}>{t}</InlineTag>
                  ))}
                  <Mono
                    className="text-[11px] ml-auto self-center"
                    style={{ color: "#4a4a40" }}
                  >
                    {relativeTime(hero.updatedAt)}
                  </Mono>
                </div>
              </div>
              {active.slice(1).map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3.5 py-3 px-2 cursor-pointer rounded-xl hover:bg-white/[0.02] transition-colors"
                  style={{
                    borderTop:
                      i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                  onClick={() => onContext("project", p.id)}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: STATUS_CFG[p.status].color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-foreground">
                      {p.name}
                    </div>
                    <div
                      className="text-[12px] truncate mt-0.5"
                      style={{ color: "#7a7a6a" }}
                    >
                      {p.objective}
                    </div>
                  </div>
                  <StatusPill status={p.status} />
                </div>
              ))}
            </FloatCard>
          )}

          {attention.length > 0 && (
            <FloatCard className="p-6">
              <CardLabel>Needs attention</CardLabel>
              <div className="flex flex-col gap-3">
                {attention.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-3.5 p-4 rounded-xl cursor-pointer"
                    style={{
                      background:
                        p.status === "blocked"
                          ? "rgba(201,97,74,0.08)"
                          : "rgba(212,162,76,0.08)",
                      border: `1px solid ${p.status === "blocked" ? "rgba(201,97,74,0.18)" : "rgba(212,162,76,0.18)"}`,
                    }}
                    onClick={() => onContext("project", p.id)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {p.status === "blocked" ? (
                        <AlertCircle size={14} color="#c9614a" />
                      ) : (
                        <Clock size={14} color="#d4a24c" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-foreground mb-1">
                        {p.name}
                      </div>
                      <div
                        className="text-[12px] leading-relaxed line-clamp-2"
                        style={{ color: "#7a7a6a" }}
                      >
                        {p.blocker ||
                          `Not updated in ${Math.floor((Date.now() - p.updatedAt.getTime()) / 86400000)} days`}
                      </div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                ))}
              </div>
            </FloatCard>
          )}

          <FloatCard className="p-6">
            <CardLabel>Recent notebook entries</CardLabel>
            <div className="flex flex-col">
              {ENTRIES.slice(0, 5).map((e, idx) => (
                <div
                  key={e.id}
                  className="py-3.5 px-2 -mx-2 cursor-pointer rounded-xl hover:bg-white/[0.015] transition-colors group"
                  style={{
                    borderTop:
                      idx > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                  onClick={() => onContext("notebook", e.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-foreground truncate group-hover:text-amber-300/80 transition-colors duration-100">
                        {e.title || (
                          <span
                            style={{
                              color: "#7a7a6a",
                              fontStyle: "italic",
                              fontWeight: 400,
                            }}
                          >
                            {e.preview.slice(0, 52)}…
                          </span>
                        )}
                      </div>
                      <div
                        className="text-[12px] mt-0.5 line-clamp-1 leading-relaxed"
                        style={{ color: "#7a7a6a" }}
                      >
                        {e.preview}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      {(e.linkedProject || e.linkedTech) && (
                        <InlineTag>{e.linkedProject || e.linkedTech}</InlineTag>
                      )}
                      <Mono
                        className="text-[10px]"
                        style={{ color: "#4a4a40" }}
                      >
                        {relativeTime(e.createdAt)}
                      </Mono>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FloatCard>

          <FloatCard className="p-6">
            <CardLabel>Recent thoughts</CardLabel>
            <div className="flex flex-col gap-3">
              {THOUGHTS.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl cursor-pointer hover:bg-white/[0.015] transition-colors"
                  style={{ borderLeft: "2px solid rgba(124,169,130,0.5)" }}
                  onClick={() => onContext("thought", t.id)}
                >
                  {t.title && (
                    <div className="text-[13px] font-semibold text-foreground mb-1.5">
                      {t.title}
                    </div>
                  )}
                  <div
                    className="text-[12px] leading-relaxed line-clamp-2"
                    style={{ color: "#7a7a6a" }}
                  >
                    {t.preview}
                  </div>
                  <Mono
                    className="text-[10px] block mt-2"
                    style={{ color: "#4a4a40" }}
                  >
                    {relativeTime(t.updatedAt)}
                  </Mono>
                </div>
              ))}
            </div>
          </FloatCard>
        </div>

        <div className="flex flex-col gap-5" style={{ flex: "1" }}>
          <FloatCard className="p-6">
            <CardLabel>Activity</CardLabel>
            <div
              className="flex flex-col"
              style={{ maxHeight: "340px", overflowY: "auto" }}
            >
              {ACTIVITY.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 py-3"
                  style={{
                    borderBottom:
                      idx < ACTIVITY.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                  }}
                >
                  <div
                    className="w-[5px] h-[5px] rounded-full shrink-0 mt-[6px]"
                    style={{
                      background:
                        ev.entityType === "project"
                          ? "#e9b44c"
                          : ev.entityType === "notebook"
                            ? "#7a7a6a"
                            : "#7ca982",
                    }}
                  />
                  <div className="flex-1 min-w-0 text-[12px] leading-snug">
                    <span style={{ color: "#7a7a6a" }}>{ev.verb} </span>
                    <span
                      className="font-semibold"
                      style={{ color: "#c9c5ba" }}
                    >
                      {ev.entity}
                    </span>
                  </div>
                  <Mono
                    className="text-[10px] shrink-0"
                    style={{ color: "#4a4a40" }}
                  >
                    {relativeTime(ev.time)}
                  </Mono>
                </div>
              ))}
            </div>
          </FloatCard>

          <FloatCard className="p-6">
            <CardLabel>Technology momentum</CardLabel>
            <div className="flex flex-col gap-5">
              {TECHNOLOGIES.filter((t) => t.entryCount >= 4)
                .slice(0, 4)
                .map((t) => (
                  <div
                    key={t.id}
                    className="cursor-pointer"
                    onClick={() => onContext("tech", t.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[13px] font-medium text-foreground">
                        {t.name}
                      </div>
                      <Mono
                        className="text-[10px]"
                        style={{ color: "#4a4a40" }}
                      >
                        {t.entryCount} entries
                      </Mono>
                    </div>
                    <Bar filled={t.mastery} total={4} color="#e9b44c" />
                  </div>
                ))}
            </div>
          </FloatCard>

          <FloatCard className="p-6">
            <CardLabel>Ideas worth revisiting</CardLabel>
            <div className="flex flex-col gap-5">
              {topIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="cursor-pointer group"
                  onClick={() => onContext("idea", idea.id)}
                >
                  <div className="text-[13px] font-medium text-foreground leading-snug mb-3 group-hover:text-foreground/80 transition-colors">
                    {idea.title}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Mono
                        className="text-[9px] block mb-1.5 uppercase tracking-[0.1em]"
                        style={{ color: "#4a4a40" }}
                      >
                        Confidence
                      </Mono>
                      <Bar filled={idea.confidence} total={5} color="#e9b44c" />
                    </div>
                    <div className="flex-1">
                      <Mono
                        className="text-[9px] block mb-1.5 uppercase tracking-[0.1em]"
                        style={{ color: "#4a4a40" }}
                      >
                        Importance
                      </Mono>
                      <Bar filled={idea.importance} total={5} color="#7ca982" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FloatCard>
        </div>
      </div>
    </div>
  );
}
