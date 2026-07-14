"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  FolderOpen,
  Lightbulb,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { IDEAS } from "@/data/ideas";
import { ENTRIES } from "@/data/entries";
import { ACTIVITY } from "@/data/activity";
import { relativeTime } from "@/lib/helpers";
import type { Module } from "@/types";

export function CommandPalette({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (m: Module) => void;
}) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => s + 1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(0, s - 1));
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const quickActions = [
    { label: "New Project", Icon: FolderOpen, target: "projects" as Module },
    { label: "New Idea", Icon: Lightbulb, target: "ideas" as Module },
    {
      label: "New Notebook Entry",
      Icon: BookOpen,
      target: "notebook" as Module,
    },
    { label: "New Thought", Icon: MessageSquare, target: "thoughts" as Module },
  ];

  const q = query.trim().toLowerCase();
  const results = q
    ? [
        ...PROJECTS.filter((p) => p.name.toLowerCase().includes(q)).map(
          (p) => ({
            label: p.name,
            type: "Project",
            target: "projects" as Module,
          }),
        ),
        ...IDEAS.filter((i) => i.title.toLowerCase().includes(q)).map((i) => ({
          label: i.title,
          type: "Idea",
          target: "ideas" as Module,
        })),
        ...ENTRIES.filter(
          (e) =>
            (e.title || "").toLowerCase().includes(q) ||
            e.preview.toLowerCase().includes(q),
        ).map((e) => ({
          label: e.title || e.preview.slice(0, 45) + "…",
          type: "Notebook",
          target: "notebook" as Module,
        })),
      ]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{ paddingTop: "14vh" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full shadow-2xl"
        style={{
          maxWidth: "640px",
          borderRadius: "14px",
          background: "#1a1a16",
          border: "1px solid rgba(240,237,230,0.12)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
            placeholder="Type a command or search everything…"
            className="flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="py-2" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {!q ? (
            <>
              <div className="px-4 pt-1 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.07em]">
                Quick actions
              </div>
              {quickActions.map(({ label, Icon, target }, i) => (
                <button
                  key={label}
                  onClick={() => {
                    onNavigate(target);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 h-11 text-left text-[14px] text-foreground transition-colors"
                  style={{
                    background:
                      sel === i ? "rgba(240,237,230,0.06)" : "transparent",
                  }}
                  onMouseEnter={() => setSel(i)}
                >
                  <Icon size={16} className="text-muted-foreground" />
                  {label}
                  <span
                    className="ml-auto text-[11px] text-muted-foreground"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    ⌘N
                  </span>
                </button>
              ))}
              <div className="mx-4 my-2 border-t border-border" />
              <div className="px-4 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.07em]">
                Recent
              </div>
              {ACTIVITY.slice(0, 4).map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 px-4 h-11 text-[14px]"
                  style={{ color: "#c9c5ba" }}
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{
                      background:
                        ev.entityType === "project"
                          ? "#e9b44c"
                          : ev.entityType === "thought"
                            ? "#7ca982"
                            : "#7a7a6a",
                    }}
                  />
                  <span className="flex-1 truncate">{ev.entity}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                    {relativeTime(ev.time)}
                  </span>
                </div>
              ))}
            </>
          ) : results.length > 0 ? (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  onNavigate(r.target);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 h-11 text-left text-[14px] text-foreground transition-colors"
                style={{
                  background:
                    sel === i ? "rgba(240,237,230,0.06)" : "transparent",
                }}
                onMouseEnter={() => setSel(i)}
              >
                <span
                  className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: "rgba(240,237,230,0.08)",
                    color: "#7a7a6a",
                  }}
                >
                  {r.type}
                </span>
                <span className="flex-1 truncate">{r.label}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-10 text-center text-[14px] text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
