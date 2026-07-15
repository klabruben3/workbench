import { useState, useEffect, useRef } from "react";
import { Search, X, FolderOpen, Lightbulb, BookOpen, MessageSquare } from "lucide-react";
import type { Module } from "@/types";
import { PROJECTS, IDEAS, ENTRIES, ACTIVITY } from "@/data/mockData";
import { relativeTime } from "@/lib/helpers";
import { Mono } from "./Mono";

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
    { label: "New Notebook Entry", Icon: BookOpen, target: "notebook" as Module },
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
      style={{ paddingTop: "13vh" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.65)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: "640px",
          background: "rgba(18,15,10,0.97)",
          border: "1px solid rgba(255,255,255,0.11)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={15} style={{ color: "#7a7a6a" }} className="shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
            placeholder="Type a command or search everything…"
            className="flex-1 bg-transparent text-[14px] text-foreground outline-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#f0ede6",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ color: "#7a7a6a" }}>
              <X size={13} />
            </button>
          )}
          <Mono
            className="text-[11px] px-1.5 py-0.5 rounded-md"
            style={{
              color: "#4a4a40",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            esc
          </Mono>
        </div>
        <div className="py-2" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {!q ? (
            <>
              <Mono
                className="text-[9px] font-semibold uppercase tracking-[0.12em] block px-4 pt-2 pb-2"
                style={{ color: "#4a4a40" }}
              >
                Quick actions
              </Mono>
              {quickActions.map(({ label, Icon, target }, i) => (
                <button
                  key={label}
                  onClick={() => {
                    onNavigate(target);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 h-11 text-left text-[13px] text-foreground transition-colors"
                  style={{
                    background:
                      sel === i ? "rgba(255,255,255,0.05)" : "transparent",
                  }}
                  onMouseEnter={() => setSel(i)}
                >
                  <Icon size={15} style={{ color: "#7a7a6a" }} />
                  {label}
                  <Mono
                    className="ml-auto text-[10px]"
                    style={{ color: "#4a4a40" }}
                  >
                    ⌘N
                  </Mono>
                </button>
              ))}
              <div
                className="mx-4 my-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              />
              <Mono
                className="text-[9px] font-semibold uppercase tracking-[0.12em] block px-4 pb-2"
                style={{ color: "#4a4a40" }}
              >
                Recent
              </Mono>
              {ACTIVITY.slice(0, 4).map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 px-4 h-11 text-[13px]"
                  style={{ color: "#c9c5ba" }}
                >
                  <div
                    className="w-[5px] h-[5px] rounded-full shrink-0"
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
                  <Mono
                    className="text-[10px] shrink-0"
                    style={{ color: "#4a4a40" }}
                  >
                    {relativeTime(ev.time)}
                  </Mono>
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
                className="w-full flex items-center gap-3 px-4 h-11 text-left text-[13px] text-foreground transition-colors"
                style={{
                  background:
                    sel === i ? "rgba(255,255,255,0.05)" : "transparent",
                }}
                onMouseEnter={() => setSel(i)}
              >
                <Mono
                  className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    color: "#7a7a6a",
                  }}
                >
                  {r.type}
                </Mono>
                <span className="flex-1 truncate">{r.label}</span>
              </button>
            ))
          ) : (
            <div
              className="px-4 py-10 text-center text-[13px]"
              style={{ color: "#7a7a6a" }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
