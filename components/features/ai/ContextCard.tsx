import type { ContextType } from "../../../types";
import { PROJECTS, IDEAS, ENTRIES, TECHNOLOGIES, THOUGHTS } from "../../../data/mockData";
import { STATUS_CFG, PRIORITY_COLOR, MASTERY_LABEL } from "../../../lib/constants";
import { relativeTime } from "../../../lib/helpers";
import { Mono } from "../../ui/Mono";
import { StatusPill } from "../../ui/StatusPill";
import { IdeaBadge } from "../../ui/IdeaBadge";
import { Bar } from "../../ui/Bar";
import { InlineTag } from "../../ui/InlineTag";
import { AlertCircle, ArrowRight } from "lucide-react";

export function ContextCard({ type, id }: { type: ContextType; id: string }) {
  if (type === "project") {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return null;
    return (
      <div className="p-5">
        <Mono
          className="text-[9px] font-semibold uppercase tracking-[0.14em] block mb-3"
          style={{ color: "#4a4a40" }}
        >
          Project context
        </Mono>
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: STATUS_CFG[p.status].color }}
              />
              <span
                className="text-[22px] text-foreground leading-tight"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                {p.name}
              </span>
            </div>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "#7a7a6a" }}
            >
              {p.objective}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusPill status={p.status} />
            <Mono
              className="text-[9px] uppercase tracking-[0.1em]"
              style={{ color: PRIORITY_COLOR[p.priority] }}
            >
              {p.priority} priority
            </Mono>
          </div>
        </div>
        {p.nextAction && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] mb-3"
            style={{
              background: "rgba(124,169,130,0.08)",
              color: "#7ca982",
              border: "1px solid rgba(124,169,130,0.14)",
            }}
          >
            <ArrowRight size={11} strokeWidth={2} />
            {p.nextAction}
          </div>
        )}
        {p.blocker && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-lg text-[12px] mb-3"
            style={{
              background: "rgba(201,97,74,0.08)",
              color: "#c9614a",
              border: "1px solid rgba(201,97,74,0.14)",
            }}
          >
            <AlertCircle
              size={11}
              strokeWidth={2}
              className="mt-0.5 shrink-0"
            />
            {p.blocker}
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {p.technologies.map((t) => (
            <InlineTag key={t}>{t}</InlineTag>
          ))}
          <Mono
            className="text-[10px] ml-auto self-center"
            style={{ color: "#4a4a40" }}
          >
            {relativeTime(p.updatedAt)}
          </Mono>
        </div>
      </div>
    );
  }

  if (type === "idea") {
    const idea = IDEAS.find((x) => x.id === id);
    if (!idea) return null;
    return (
      <div className="p-5">
        <Mono
          className="text-[9px] font-semibold uppercase tracking-[0.14em] block mb-3"
          style={{ color: "#4a4a40" }}
        >
          Idea context
        </Mono>
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div
              className="text-[20px] font-semibold text-foreground leading-snug mb-2"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              {idea.title}
            </div>
            <p
              className="text-[13px] leading-relaxed line-clamp-2"
              style={{ color: "#7a7a6a" }}
            >
              {idea.description}
            </p>
          </div>
          <IdeaBadge status={idea.status} />
        </div>
        {idea.nextStep && (
          <div
            className="text-[12px] px-3 py-2 rounded-lg mb-3"
            style={{
              background: "rgba(124,169,130,0.08)",
              color: "#7ca982",
              border: "1px solid rgba(124,169,130,0.14)",
            }}
          >
            → {idea.nextStep}
          </div>
        )}
        <div className="flex gap-6">
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
    );
  }

  if (type === "notebook") {
    const e = ENTRIES.find((x) => x.id === id);
    if (!e) return null;
    return (
      <div className="p-5">
        <Mono
          className="text-[9px] font-semibold uppercase tracking-[0.14em] block mb-3"
          style={{ color: "#4a4a40" }}
        >
          Notebook context
        </Mono>
        {e.title && (
          <div
            className="text-[20px] text-foreground mb-2 leading-snug"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {e.title}
          </div>
        )}
        <p
          className="text-[13px] leading-[1.7] line-clamp-3"
          style={{ color: "#7a7a6a" }}
        >
          {e.preview}
        </p>
        <div className="flex items-center gap-2 mt-3">
          {(e.linkedProject || e.linkedTech) && (
            <InlineTag>{e.linkedProject || e.linkedTech}</InlineTag>
          )}
          <Mono className="text-[10px] ml-auto" style={{ color: "#4a4a40" }}>
            {relativeTime(e.createdAt)}
          </Mono>
        </div>
      </div>
    );
  }

  if (type === "tech") {
    const t = TECHNOLOGIES.find((x) => x.id === id);
    if (!t) return null;
    return (
      <div className="p-5">
        <Mono
          className="text-[9px] font-semibold uppercase tracking-[0.14em] block mb-3"
          style={{ color: "#4a4a40" }}
        >
          Technology context
        </Mono>
        <div className="flex items-start justify-between mb-4">
          <div
            className="text-[22px] font-semibold text-foreground"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {t.name}
          </div>
          <Mono
            className="text-[10px] font-semibold uppercase"
            style={{
              color:
                t.mastery >= 3
                  ? "#e9b44c"
                  : t.mastery === 2
                    ? "#c9c5ba"
                    : "#7a7a6a",
            }}
          >
            {MASTERY_LABEL[t.mastery]}
          </Mono>
        </div>
        <div className="mb-4">
          <Bar filled={t.mastery} total={4} color="#e9b44c" />
        </div>
        <div className="flex gap-4">
          <Mono className="text-[12px]" style={{ color: "#7a7a6a" }}>
            {t.projectCount} {t.projectCount === 1 ? "project" : "projects"}
          </Mono>
          <span style={{ color: "#4a4a40" }}>·</span>
          <Mono className="text-[12px]" style={{ color: "#7a7a6a" }}>
            {t.entryCount} notebook {t.entryCount === 1 ? "entry" : "entries"}
          </Mono>
        </div>
      </div>
    );
  }

  if (type === "thought") {
    const t = THOUGHTS.find((x) => x.id === id);
    if (!t) return null;
    return (
      <div
        className="p-5"
        style={{ borderLeft: "2px solid rgba(124,169,130,0.45)" }}
      >
        <Mono
          className="text-[9px] font-semibold uppercase tracking-[0.14em] block mb-3"
          style={{ color: "#4a4a40" }}
        >
          Thought context
        </Mono>
        {t.title && (
          <div
            className="text-[20px] text-foreground mb-2"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {t.title}
          </div>
        )}
        <p
          className="text-[13px] leading-[1.7] line-clamp-3"
          style={{ color: "#7a7a6a" }}
        >
          {t.preview}
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {t.related.map((r) => (
            <InlineTag key={r}>{r}</InlineTag>
          ))}
          <Mono className="text-[10px] ml-auto" style={{ color: "#4a4a40" }}>
            {relativeTime(t.updatedAt)}
          </Mono>
        </div>
      </div>
    );
  }

  return null;
}
