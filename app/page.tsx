"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Lightbulb,
  BookOpen,
  Cpu,
  GitBranch,
  MessageSquare,
  Network,
  Settings,
  Search,
  Plus,
  X,
  Zap,
  AlertCircle,
  PauseCircle,
  CheckCircle2,
  Archive,
  MoreHorizontal,
  ChevronDown,
  Clock,
  Circle,
  ChevronRight,
  Bot,
  Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Module =
  | "dashboard"
  | "projects"
  | "ideas"
  | "notebook"
  | "technologies"
  | "evolution"
  | "thoughts"
  | "graph"
  | "settings";

type ProjectStatus =
  | "idea"
  | "active"
  | "paused"
  | "blocked"
  | "shipped"
  | "archived";
type Priority = "low" | "medium" | "high";

interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: Priority;
  objective: string;
  nextAction: string;
  blocker?: string;
  pauseReason?: string;
  technologies: string[];
  updatedAt: Date;
}
interface Idea {
  id: string;
  title: string;
  description: string;
  status: "active" | "promoted" | "archived";
  confidence: number;
  importance: number;
  nextStep?: string;
}
interface NEntry {
  id: string;
  title?: string;
  preview: string;
  linkedProject?: string;
  linkedTech?: string;
  createdAt: Date;
}
interface Tech {
  id: string;
  name: string;
  mastery: 1 | 2 | 3 | 4;
  projectCount: number;
  entryCount: number;
}
interface Thought {
  id: string;
  title?: string;
  preview: string;
  related: string[];
  updatedAt: Date;
}
interface FeedEvent {
  id: string;
  verb: string;
  entity: string;
  entityType: string;
  time: Date;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Aperture",
    status: "active",
    priority: "high",
    objective: "Ship the public API with authentication and rate limiting",
    nextAction: "Wire up the auth callback endpoint",
    technologies: ["TypeScript", "React", "Supabase"],
    updatedAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: "2",
    name: "Devfolio",
    status: "shipped",
    priority: "medium",
    objective: "Keep case studies and public portfolio current",
    nextAction: "",
    technologies: ["Next.js", "TypeScript", "Tailwind"],
    updatedAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "3",
    name: "Zephyr",
    status: "blocked",
    priority: "high",
    objective: "Build distributed configuration sync with conflict resolution",
    nextAction: "Rethink the locking strategy",
    blocker:
      "Mutex contention in the write path causes deadlocks under concurrent load.",
    technologies: ["Rust", "PostgreSQL"],
    updatedAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    id: "4",
    name: "Tessera",
    status: "paused",
    priority: "low",
    objective: "Ship a real-time collaborative whiteboard with WebRTC",
    nextAction: "",
    pauseReason:
      "Waiting to finish the WebRTC research spike before committing to an architecture.",
    technologies: ["React", "WebRTC"],
    updatedAt: new Date(Date.now() - 14 * 86400000),
  },
  {
    id: "5",
    name: "Kestrel",
    status: "idea",
    priority: "low",
    objective:
      "Explore a personal finance tracker with automatic categorization",
    nextAction: "",
    technologies: [],
    updatedAt: new Date(Date.now() - 20 * 86400000),
  },
];

const IDEAS: Idea[] = [
  {
    id: "1",
    title: "Semantic codebase search with local embeddings",
    description:
      "Run a local embedding model over the codebase and expose a natural-language query interface. No cloud, no telemetry.",
    status: "active",
    confidence: 4,
    importance: 5,
    nextStep: "Prototype with Nomic Embed + SQLite vector store",
  },
  {
    id: "2",
    title: "Automated PR review summaries",
    description:
      "Generate structured summaries of GitHub PRs — scope, risk level, coverage — piped into Slack before review starts.",
    status: "active",
    confidence: 3,
    importance: 4,
  },
  {
    id: "3",
    title: "Terminal-native kanban board",
    description:
      "A TUI kanban that reads from Linear or GitHub Projects and renders with vim bindings. No browser required.",
    status: "active",
    confidence: 4,
    importance: 3,
    nextStep: "Evaluate Ratatui vs. Ink for the TUI framework",
  },
  {
    id: "4",
    title: "Latency dashboard for self-hosted stack",
    description:
      "Lightweight observability for home-lab services — P99, uptime, and alert routing in one view.",
    status: "active",
    confidence: 2,
    importance: 4,
  },
  {
    id: "5",
    title: "Workbench — private engineering OS",
    description:
      "A single-tenant, graph-first tool for managing projects, ideas, notes, and growth across a full career.",
    status: "promoted",
    confidence: 5,
    importance: 5,
  },
];

const ENTRIES: NEntry[] = [
  {
    id: "1",
    title: "Debugging Supabase RLS policies on Aperture",
    preview:
      "Spent two hours chasing a 401 that turned out to be a missing auth.uid() check in the RLS policy for the media table. The gotcha: USING and WITH CHECK behave differently for SELECT vs INSERT...",
    linkedProject: "Aperture",
    createdAt: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: "2",
    title: "TypeScript 5.5 — inferred type predicates",
    preview:
      "The new inferred type predicates feature is genuinely good. No more writing x is SomeType manually when the function body already makes it obvious. Tested against Aperture...",
    linkedTech: "TypeScript",
    createdAt: new Date(Date.now() - 8 * 3600000),
  },
  {
    id: "3",
    title: "WebRTC signaling server design options",
    preview:
      "Comparing mesh vs. SFU vs. MCU for Tessera. For fewer than 10 participants, a simple mesh via signaling server is probably right to start. MCU is overkill.",
    linkedProject: "Tessera",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    preview:
      "Rust's ownership model is finally clicking after the Zephyr work. Key insight: a &mut T borrow is exclusive — no other reference can exist simultaneously. That's exactly what makes the compiler your concurrency checker.",
    linkedProject: "Zephyr",
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: "5",
    title: "Nomic Embed first impressions",
    preview:
      "Ran Nomic Embed locally on the Aperture source tree. 350ms for an 80-file codebase on M3 Pro — totally acceptable. The semantic similarity scores are surprisingly coherent.",
    createdAt: new Date(Date.now() - 4 * 86400000),
  },
];

const TECHNOLOGIES: Tech[] = [
  { id: "1", name: "TypeScript", mastery: 4, projectCount: 4, entryCount: 11 },
  { id: "2", name: "React", mastery: 4, projectCount: 3, entryCount: 7 },
  { id: "3", name: "Next.js", mastery: 3, projectCount: 1, entryCount: 4 },
  { id: "4", name: "Tailwind CSS", mastery: 3, projectCount: 3, entryCount: 3 },
  { id: "5", name: "Rust", mastery: 1, projectCount: 1, entryCount: 5 },
  { id: "6", name: "PostgreSQL", mastery: 2, projectCount: 2, entryCount: 6 },
  { id: "7", name: "Supabase", mastery: 2, projectCount: 1, entryCount: 4 },
  { id: "8", name: "WebRTC", mastery: 1, projectCount: 1, entryCount: 2 },
];

const THOUGHTS: Thought[] = [
  {
    id: "1",
    title: "On reaching for Rust when complexity doesn't warrant it",
    preview:
      "I keep choosing Rust for projects where TypeScript would be fine. The ownership model is clarifying, yes — but I'm shipping slower because of it. Need to be deliberate about when systems-level concerns actually require a systems language.",
    related: ["Rust", "Zephyr"],
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    title: "Tools for myself are better than client work for learning",
    preview:
      "Every time I build something for myself, I'm willing to go deeper — to research the right approach rather than the fast one. Aperture taught me more about Supabase's internals than any client project would have.",
    related: ["Aperture"],
    updatedAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "3",
    preview:
      "The idea backlog is valuable. I keep coming back to old ideas and finding that the right moment has arrived — context I didn't have before makes them feasible now. The act of capturing matters more than the quality of capture.",
    related: [],
    updatedAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    id: "4",
    title: "On public visibility as a forcing function",
    preview:
      "Making Aperture public (even just unlisted on Devfolio) created a different quality bar for the code. Not always a good thing — perfection blocks shipping — but for architecture decisions, knowing it might be read sharpened my thinking.",
    related: ["Aperture", "Devfolio"],
    updatedAt: new Date(Date.now() - 12 * 86400000),
  },
];

const ACTIVITY: FeedEvent[] = [
  {
    id: "1",
    verb: "created notebook entry",
    entity: "Debugging Supabase RLS policies",
    entityType: "notebook",
    time: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: "2",
    verb: "changed status of",
    entity: "Aperture",
    entityType: "project",
    time: new Date(Date.now() - 6 * 3600000),
  },
  {
    id: "3",
    verb: "linked TypeScript to",
    entity: "Aperture",
    entityType: "project",
    time: new Date(Date.now() - 9 * 3600000),
  },
  {
    id: "4",
    verb: "created notebook entry",
    entity: "WebRTC signaling server design",
    entityType: "notebook",
    time: new Date(Date.now() - 86400000),
  },
  {
    id: "5",
    verb: "added thought",
    entity: "On reaching for Rust",
    entityType: "thought",
    time: new Date(Date.now() - 86400000),
  },
  {
    id: "6",
    verb: "created project",
    entity: "Zephyr",
    entityType: "project",
    time: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: "7",
    verb: "promoted idea to project",
    entity: "Workbench",
    entityType: "idea",
    time: new Date(Date.now() - 5 * 86400000),
  },
  {
    id: "8",
    verb: "archived project",
    entity: "CLI Tooling Suite",
    entityType: "project",
    time: new Date(Date.now() - 8 * 86400000),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 2) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByDate(entries: NEntry[]) {
  const groups: { label: string; entries: NEntry[] }[] = [];
  const seen = new Map<string, number>();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  entries.forEach((e) => {
    const d = e.createdAt;
    let label: string;
    if (d.toDateString() === today.toDateString()) label = "Today";
    else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else
      label = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    if (!seen.has(label)) {
      seen.set(label, groups.length);
      groups.push({ label, entries: [] });
    }
    groups[seen.get(label)!].entries.push(e);
  });
  return groups;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  idea: { color: "#7a7a6a", label: "Idea", Icon: Circle },
  active: { color: "#7ca982", label: "Active", Icon: CheckCircle2 },
  paused: { color: "#d4a24c", label: "Paused", Icon: PauseCircle },
  blocked: { color: "#c9614a", label: "Blocked", Icon: AlertCircle },
  shipped: { color: "#e9b44c", label: "Shipped", Icon: Zap },
  archived: { color: "#7a7a6a", label: "Archived", Icon: Archive },
} as const;

const PRIORITY_COLOR: Record<Priority, string> = {
  low: "#7a7a6a",
  medium: "#d4a24c",
  high: "#c9614a",
};

const MASTERY_LABEL = ["", "Exploring", "Comfortable", "Proficient", "Expert"];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "projects", label: "Projects", Icon: FolderOpen, count: 5 },
  { id: "ideas", label: "Ideas", Icon: Lightbulb, count: 5 },
  { id: "notebook", label: "Notebook", Icon: BookOpen, count: 12 },
  { id: "technologies", label: "Technologies", Icon: Cpu, count: 8 },
  { id: "evolution", label: "Evolution", Icon: GitBranch },
  { id: "thoughts", label: "Thoughts", Icon: MessageSquare, count: 4 },
  { id: "graph", label: "Knowledge Graph", Icon: Network },
] as {
  id: string;
  label: string;
  Icon: typeof LayoutDashboard;
  count?: number;
}[];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: ProjectStatus }) {
  const { color, label, Icon } = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded text-[11px] font-medium tracking-wide uppercase"
      style={{ background: color + "26", color }}
    >
      <Icon size={9} strokeWidth={2.5} />
      {label}
    </span>
  );
}

function IdeaBadge({ status }: { status: "active" | "promoted" | "archived" }) {
  const cfg = {
    active: { color: "#7ca982", label: "Active" },
    promoted: { color: "#e9b44c", label: "Promoted" },
    archived: { color: "#7a7a6a", label: "Archived" },
  };
  const { color, label } = cfg[status];
  return (
    <span
      className="text-[11px] font-medium tracking-wide uppercase px-2 py-[3px] rounded shrink-0"
      style={{ background: color + "26", color }}
    >
      {label}
    </span>
  );
}

function Bar({
  filled,
  total,
  color,
}: {
  filled: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-[5px] flex-1 rounded-[2px]"
          style={{ background: i < filled ? color : "rgba(240,237,230,0.1)" }}
        />
      ))}
    </div>
  );
}

function Wcard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[10px] border border-border ${className}`}
      style={{ background: "#131310" }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground mb-3">
      {children}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardModule() {
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
                (e) => Date.now() - e.createdAt.getTime() < 7 * 86400000,
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
                          `Not updated in ${Math.floor((Date.now() - p.updatedAt.getTime()) / 86400000)} days`}
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

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsModule() {
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

// ─── Ideas ────────────────────────────────────────────────────────────────────

function IdeasModule() {
  return (
    <div className="px-8 pt-12 pb-16 max-w-[1120px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-foreground">Ideas</h2>
        <button
          className="flex items-center gap-1.5 px-4 h-9 rounded-[6px] text-[14px] font-semibold"
          style={{ background: "#e9b44c", color: "#0d0d0b" }}
        >
          <Plus size={15} strokeWidth={2.5} /> New Idea
        </button>
      </div>
      <div className="columns-3 gap-4">
        {IDEAS.map((idea) => (
          <div
            key={idea.id}
            className="break-inside-avoid mb-4 rounded-[10px] border border-border p-5 cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-all duration-100"
            style={{ background: "#131310" }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="text-[15px] font-semibold text-foreground leading-snug">
                {idea.title}
              </div>
              <IdeaBadge status={idea.status} />
            </div>
            <p className="text-[13px] text-muted-foreground leading-[1.6] mb-4 line-clamp-4">
              {idea.description}
            </p>
            {idea.nextStep && (
              <div
                className="text-[12px] px-2.5 py-2 rounded-[6px] mb-4 leading-snug"
                style={{
                  background: "rgba(124,169,130,0.1)",
                  color: "#7ca982",
                }}
              >
                → {idea.nextStep}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide w-[72px]">
                  Confidence
                </span>
                <div className="flex-1">
                  <Bar filled={idea.confidence} total={5} color="#e9b44c" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide w-[72px]">
                  Importance
                </span>
                <div className="flex-1">
                  <Bar filled={idea.importance} total={5} color="#7ca982" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Notebook ─────────────────────────────────────────────────────────────────

function NotebookModule() {
  const [composing, setComposing] = useState(false);
  const groups = groupByDate(ENTRIES);

  return (
    <div className="px-8 pt-12 pb-16 max-w-[720px] mx-auto">
      {!composing ? (
        <div
          className="mb-8 p-5 rounded-[10px] border border-border cursor-text hover:border-[rgba(240,237,230,0.18)] transition-colors"
          style={{ background: "#131310" }}
          onClick={() => setComposing(true)}
        >
          <span
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: "18px",
              color: "#7a7a6a",
            }}
          >
            Jot something down...
          </span>
        </div>
      ) : (
        <div
          className="mb-8 rounded-[10px] border p-5 transition-colors"
          style={{ background: "#131310", borderColor: "rgba(233,180,76,0.4)" }}
        >
          <input
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[15px] font-semibold outline-none placeholder:text-muted-foreground mb-3"
          />
          <textarea
            autoFocus
            placeholder="Start writing..."
            className="w-full bg-transparent text-foreground text-[14px] leading-[1.6] outline-none placeholder:text-muted-foreground resize-none"
            style={{ minHeight: "120px" }}
          />
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
            <div className="flex gap-3 text-[12px] text-muted-foreground">
              <button className="hover:text-foreground transition-colors">
                Link to…
              </button>
              <span>·</span>
              <button className="hover:text-foreground transition-colors">
                Add tags
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setComposing(false)}
                className="text-[13px] text-muted-foreground hover:text-foreground px-3 h-7 transition-colors"
              >
                Cancel
              </button>
              <button
                className="text-[13px] font-semibold px-3 h-7 rounded-[6px]"
                style={{ background: "#e9b44c", color: "#0d0d0b" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {groups.map(({ label, entries }) => (
        <div key={label} className="mb-8">
          <div
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-4 py-2 sticky top-0"
            style={{ background: "#0d0d0b" }}
          >
            {label}
          </div>
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <div
                key={e.id}
                className="p-5 rounded-[10px] border border-border cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-colors group"
                style={{ background: "#131310" }}
              >
                {e.title && (
                  <div className="text-[15px] font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {e.title}
                  </div>
                )}
                <p className="text-[14px] text-muted-foreground leading-[1.6] line-clamp-3">
                  {e.preview}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {(e.linkedProject || e.linkedTech) && (
                    <span
                      className="text-[11px] px-1.5 py-[2px] rounded font-medium"
                      style={{
                        background: "rgba(240,237,230,0.07)",
                        color: "#7a7a6a",
                      }}
                    >
                      {e.linkedProject || e.linkedTech}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">
                    {relativeTime(e.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Technologies ─────────────────────────────────────────────────────────────

function TechnologiesModule() {
  return (
    <div className="px-8 pt-12 pb-16 max-w-[1120px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-foreground">
          Technologies
        </h2>
        <button className="flex items-center gap-1.5 px-4 h-9 rounded-[6px] text-[14px] font-medium border border-border text-foreground hover:border-[rgba(240,237,230,0.18)] transition-colors">
          <Plus size={15} /> Add Technology
        </button>
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {TECHNOLOGIES.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-[10px] border border-border cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-colors"
            style={{ background: "#131310" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-[15px] font-semibold text-foreground">
                {t.name}
              </div>
              <span
                className="text-[11px] font-medium uppercase tracking-wide"
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
              </span>
            </div>
            <div className="mb-4">
              <Bar filled={t.mastery} total={4} color="#e9b44c" />
            </div>
            <div className="flex gap-3 text-[12px] text-muted-foreground">
              <span>
                {t.projectCount} project{t.projectCount !== 1 ? "s" : ""}
              </span>
              <span className="opacity-40">·</span>
              <span>{t.entryCount} entries</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Evolution ────────────────────────────────────────────────────────────────

function EvolutionModule() {
  const [selectedProject, setSelectedProject] = useState<string>("1");
  const project = PROJECTS.find((p) => p.id === selectedProject);

  const events = [
    {
      date: new Date(Date.now() - 2 * 3600000),
      type: "status",
      color: "#7ca982",
      text: "Status changed from idea → active",
      note: undefined,
    },
    {
      date: new Date(Date.now() - 9 * 3600000),
      type: "link",
      color: "#e9b44c",
      text: "Linked TypeScript, React, Supabase",
      note: undefined,
    },
    {
      date: new Date(Date.now() - 3 * 86400000),
      type: "notebook",
      color: "#7a7a6a",
      text: "Debugging Supabase RLS policies",
      note: "Spent two hours chasing a 401 that turned out to be a missing auth.uid() check in the RLS policy for the media table.",
    },
    {
      date: new Date(Date.now() - 5 * 86400000),
      type: "status",
      color: "#e9b44c",
      text: "Project created",
      note: undefined,
    },
  ];

  return (
    <div className="px-8 pt-12 pb-16 max-w-[720px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-semibold text-foreground">Evolution</h2>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="text-[13px] text-muted-foreground border border-border rounded-[6px] px-3 h-8 outline-none focus:border-primary transition-colors"
          style={{ background: "#131310" }}
        >
          {PROJECTS.filter((p) => p.status !== "archived").map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {project && (
        <div
          className="mb-8 p-4 rounded-[10px] border border-border"
          style={{ background: "#131310" }}
        >
          <div
            className="text-[18px] text-foreground mb-1"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {project.name}
          </div>
          <div className="text-[13px] text-muted-foreground">
            {project.objective}
          </div>
        </div>
      )}
      <div className="relative">
        <div
          className="absolute left-[7px] top-3 bottom-3 w-[2px]"
          style={{ background: "rgba(240,237,230,0.1)" }}
        />
        <div className="flex flex-col gap-5 pl-10">
          {events.map((ev, i) => (
            <div key={i} className="relative">
              <div
                className="absolute border-2 border-background rounded-full"
                style={{
                  background: ev.color,
                  width: "14px",
                  height: "14px",
                  left: "-36px",
                  top: "14px",
                }}
              />
              <div
                className="p-4 rounded-[10px] border border-border"
                style={{ background: "#131310" }}
              >
                <div className="text-[13px] font-medium text-foreground">
                  {ev.text}
                </div>
                {ev.note && (
                  <div className="text-[13px] text-muted-foreground mt-2 leading-[1.6] line-clamp-2">
                    {ev.note}
                  </div>
                )}
                <div className="text-[11px] text-muted-foreground mt-2 tabular-nums">
                  {relativeTime(ev.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Thoughts ─────────────────────────────────────────────────────────────────

function ThoughtsModule() {
  const [composing, setComposing] = useState(false);

  return (
    <div className="px-8 pt-12 pb-16 max-w-[720px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-foreground">Thoughts</h2>
        <button
          onClick={() => setComposing(!composing)}
          className="flex items-center gap-1.5 px-4 h-9 rounded-[6px] text-[14px] font-semibold"
          style={{ background: "#e9b44c", color: "#0d0d0b" }}
        >
          <Plus size={15} strokeWidth={2.5} /> New Thought
        </button>
      </div>

      {composing && (
        <div
          className="mb-5 rounded-[10px] border p-5"
          style={{
            background: "#131310",
            borderColor: "rgba(124,169,130,0.4)",
          }}
        >
          <input
            autoFocus
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[15px] font-semibold outline-none placeholder:text-muted-foreground mb-3"
          />
          <textarea
            placeholder="A reflection, a pattern you've noticed, a belief worth examining..."
            className="w-full bg-transparent text-[14px] text-foreground leading-[1.6] outline-none placeholder:text-muted-foreground resize-none"
            style={{ minHeight: "100px" }}
          />
          <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-border">
            <button
              onClick={() => setComposing(false)}
              className="text-[13px] text-muted-foreground hover:text-foreground px-3 h-7 transition-colors"
            >
              Cancel
            </button>
            <button
              className="text-[13px] font-semibold px-3 h-7 rounded-[6px]"
              style={{ background: "#e9b44c", color: "#0d0d0b" }}
            >
              Save Thought
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {THOUGHTS.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-[10px] border border-border cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-colors"
            style={{
              background: "#131310",
              borderLeftWidth: "2px",
              borderLeftColor: "#7ca982",
            }}
          >
            {t.title && (
              <div className="text-[15px] font-semibold text-foreground mb-2">
                {t.title}
              </div>
            )}
            <p className="text-[14px] text-muted-foreground leading-[1.6]">
              {t.preview}
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {t.related.map((r) => (
                <span
                  key={r}
                  className="text-[11px] px-1.5 py-[2px] rounded font-medium"
                  style={{
                    background: "rgba(240,237,230,0.07)",
                    color: "#7a7a6a",
                  }}
                >
                  {r}
                </span>
              ))}
              <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">
                {relativeTime(t.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Knowledge Graph ──────────────────────────────────────────────────────────

function GraphModule() {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = [
    {
      id: "aperture",
      x: 340,
      y: 200,
      label: "Aperture",
      color: "#e9b44c",
      r: 22,
      type: "project",
    },
    {
      id: "devfolio",
      x: 590,
      y: 130,
      label: "Devfolio",
      color: "#e9b44c",
      r: 16,
      type: "project",
    },
    {
      id: "zephyr",
      x: 170,
      y: 330,
      label: "Zephyr",
      color: "#e9b44c",
      r: 16,
      type: "project",
    },
    {
      id: "tessera",
      x: 480,
      y: 350,
      label: "Tessera",
      color: "#e9b44c",
      r: 14,
      type: "project",
    },
    {
      id: "typescript",
      x: 460,
      y: 240,
      label: "TypeScript",
      color: "#7ca982",
      r: 20,
      type: "tech",
    },
    {
      id: "rust",
      x: 220,
      y: 450,
      label: "Rust",
      color: "#7ca982",
      r: 15,
      type: "tech",
    },
    {
      id: "react",
      x: 580,
      y: 310,
      label: "React",
      color: "#7ca982",
      r: 18,
      type: "tech",
    },
    {
      id: "supabase",
      x: 400,
      y: 115,
      label: "Supabase",
      color: "#7ca982",
      r: 14,
      type: "tech",
    },
    {
      id: "webrtc",
      x: 580,
      y: 430,
      label: "WebRTC",
      color: "#7ca982",
      r: 12,
      type: "tech",
    },
    {
      id: "idea1",
      x: 700,
      y: 220,
      label: "Semantic search",
      color: "#9180aa",
      r: 12,
      type: "idea",
    },
    {
      id: "idea2",
      x: 100,
      y: 210,
      label: "TUI kanban",
      color: "#9180aa",
      r: 12,
      type: "idea",
    },
    {
      id: "thought1",
      x: 700,
      y: 380,
      label: "On Rust",
      color: "#5a5a4a",
      r: 10,
      type: "thought",
    },
  ];

  const edges = [
    ["aperture", "typescript"],
    ["aperture", "react"],
    ["aperture", "supabase"],
    ["devfolio", "typescript"],
    ["devfolio", "react"],
    ["zephyr", "rust"],
    ["tessera", "react"],
    ["tessera", "webrtc"],
    ["typescript", "idea1"],
    ["rust", "idea2"],
    ["zephyr", "thought1"],
  ];

  const connected = (id: string) =>
    edges.filter(([a, b]) => a === id || b === id).flatMap(([a, b]) => [a, b]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-border">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground">
            Knowledge Graph
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Your engineering life as a graph. Hover nodes to explore
            connections.
          </p>
        </div>
        <div className="flex items-center gap-5">
          {[
            ["#e9b44c", "Projects"],
            ["#7ca982", "Technologies"],
            ["#9180aa", "Ideas"],
            ["#5a5a4a", "Thoughts"],
          ].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: color }}
              />
              <span className="text-[12px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 540"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0"
        >
          <defs>
            <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0f0f0d" />
              <stop offset="100%" stopColor="#0a0a08" />
            </radialGradient>
          </defs>
          <rect width="800" height="540" fill="url(#bg-grad)" />

          {edges.map(([a, b], i) => {
            const na = nodes.find((n) => n.id === a)!;
            const nb = nodes.find((n) => n.id === b)!;
            const isLit = hovered && (hovered === a || hovered === b);
            return (
              <line
                key={i}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={
                  isLit ? "rgba(240,237,230,0.25)" : "rgba(240,237,230,0.06)"
                }
                strokeWidth={isLit ? 1.5 : 1}
              />
            );
          })}

          {nodes.map((n) => {
            const isHov = hovered === n.id;
            const neighbors = hovered ? connected(hovered) : [];
            const isDimmed =
              hovered && !neighbors.includes(n.id) && hovered !== n.id;
            return (
              <g
                key={n.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {isHov && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r + 6}
                    fill="none"
                    stroke={n.color}
                    strokeWidth={1}
                    opacity={0.35}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={n.color}
                  opacity={isDimmed ? 0.12 : 1}
                />
                <text
                  x={n.x}
                  y={n.y + n.r + 14}
                  textAnchor="middle"
                  fill={isDimmed ? "rgba(240,237,230,0.15)" : "#c9c5ba"}
                  fontSize="11"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="500"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function SettingsModule() {
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Name", value: "Jamie Chen", type: "input" as const },
        { label: "Email", value: "jamie@local.dev", type: "input" as const },
      ],
    },
    {
      title: "Appearance",
      items: [
        { label: "Theme", value: "Dark (always)", type: "static" as const },
        { label: "Reduced motion", value: "false", type: "toggle" as const },
      ],
    },
    {
      title: "Data & Export",
      items: [
        {
          label: "Download full data export",
          value: "",
          type: "action" as const,
        },
      ],
    },
    {
      title: "Devfolio Sync",
      items: [
        {
          label: "Public site URL",
          value: "jamie.design",
          type: "static" as const,
        },
        {
          label: "Public entities",
          value: "1 project · 0 ideas",
          type: "static" as const,
        },
      ],
    },
  ];

  return (
    <div className="px-8 pt-12 pb-16 max-w-[720px] mx-auto">
      <h2 className="text-[20px] font-semibold text-foreground mb-8">
        Settings
      </h2>
      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-3">
              {section.title}
            </h3>
            <div
              className="rounded-[10px] border border-border overflow-hidden"
              style={{ background: "#131310" }}
            >
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <label className="text-[14px] font-medium text-foreground">
                    {item.label}
                  </label>
                  {item.type === "input" && (
                    <input
                      defaultValue={item.value}
                      className="text-[14px] text-muted-foreground bg-transparent border border-border rounded-[6px] px-3 h-8 text-right outline-none focus:border-primary transition-colors w-48"
                    />
                  )}
                  {item.type === "static" && (
                    <span className="text-[14px] text-muted-foreground">
                      {item.value}
                    </span>
                  )}
                  {item.type === "toggle" && (
                    <div
                      className="relative w-9 h-5 rounded-full cursor-pointer transition-colors"
                      style={{
                        background: "rgba(240,237,230,0.12)",
                        border: "1px solid rgba(240,237,230,0.15)",
                      }}
                    >
                      <div
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform"
                        style={{ background: "#7a7a6a" }}
                      />
                    </div>
                  )}
                  {item.type === "action" && (
                    <button className="text-[13px] font-medium px-3 h-8 rounded-[6px] border border-border text-foreground hover:border-[rgba(240,237,230,0.18)] transition-colors">
                      Export JSON
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────────

function CommandPalette({
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
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

// ─── Top Bar ──────────────────────────────────────────────────────────────────

const MODULE_META: Record<Module, { crumbs: string[] }> = {
  dashboard: { crumbs: ["Dashboard"] },
  projects: { crumbs: ["Projects"] },
  ideas: { crumbs: ["Ideas"] },
  notebook: { crumbs: ["Notebook"] },
  technologies: { crumbs: ["Technologies"] },
  evolution: { crumbs: ["Evolution"] },
  thoughts: { crumbs: ["Thoughts"] },
  graph: { crumbs: ["Knowledge Graph"] },
  settings: { crumbs: ["Settings"] },
};

function TopBar({ module }: { module: Module }) {
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

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [module, setModule] = useState<Module>("dashboard");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const renderModule = () => {
    switch (module) {
      case "dashboard":
        return <DashboardModule />;
      case "projects":
        return <ProjectsModule />;
      case "ideas":
        return <IdeasModule />;
      case "notebook":
        return <NotebookModule />;
      case "technologies":
        return <TechnologiesModule />;
      case "evolution":
        return <EvolutionModule />;
      case "thoughts":
        return <ThoughtsModule />;
      case "graph":
        return <GraphModule />;
      case "settings":
        return <SettingsModule />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        active={module}
        onNavigate={setModule}
        onPaletteOpen={() => setPaletteOpen(true)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar module={module} />
        <main
          className={`flex-1 overflow-y-auto ${module === "graph" ? "flex flex-col" : ""}`}
        >
          {renderModule()}
        </main>
      </div>
      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onNavigate={setModule}
        />
      )}
    </div>
  );
}
