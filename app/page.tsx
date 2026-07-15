"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
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
  ArrowRight,
  Circle,
  Bot,
  Menu,
  Send,
  ChevronLeft,
  Sparkles,
  LogIn,
  User,
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

type AppMode = "module" | "workspace" | "context";

type ContextType = "project" | "idea" | "notebook" | "tech" | "thought";

interface ContextPayload {
  type: ContextType;
  id: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: Date;
}

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
      "Spent two hours chasing a 401 that turned out to be a missing auth.uid() check in the RLS policy for the media table. The gotcha: USING and WITH CHECK behave differently for SELECT vs INSERT.",
    linkedProject: "Aperture",
    createdAt: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: "2",
    title: "TypeScript 5.5 — inferred type predicates",
    preview:
      "The new inferred type predicates feature is genuinely good. No more writing x is SomeType manually when the function body already makes it obvious. Tested against Aperture.",
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

function uid() {
  return Math.random().toString(36).slice(2);
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

// ─── Maurice context primers ──────────────────────────────────────────────────

function getMauricePrimer(type: ContextType, id: string): string {
  if (type === "project") {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return "This project is in context.";
    const linked = ENTRIES.filter((e) => e.linkedProject === p.name).length;
    return `I've loaded **${p.name}** into context. Status: ${p.status}. Technologies: ${p.technologies.join(", ") || "none yet"}. ${linked} linked notebook ${linked === 1 ? "entry" : "entries"}. What would you like to work through?`;
  }
  if (type === "idea") {
    const idea = IDEAS.find((x) => x.id === id);
    if (!idea) return "This idea is in context.";
    return `This idea is ready to discuss. Confidence ${idea.confidence}/5 · Importance ${idea.importance}/5.${idea.nextStep ? ` Next step: ${idea.nextStep}` : ""} Ask me anything about it.`;
  }
  if (type === "notebook") {
    const e = ENTRIES.find((x) => x.id === id);
    if (!e) return "This notebook entry is in context.";
    const link = e.linkedProject
      ? `Linked to project: ${e.linkedProject}.`
      : e.linkedTech
        ? `Linked to: ${e.linkedTech}.`
        : "";
    return `This notebook entry is loaded. ${link} I can help you expand it, connect it to other work, or find related ideas.`;
  }
  if (type === "tech") {
    const t = TECHNOLOGIES.find((x) => x.id === id);
    if (!t) return "This technology is in context.";
    return `${t.name} is loaded — ${MASTERY_LABEL[t.mastery]} level, across ${t.projectCount} ${t.projectCount === 1 ? "project" : "projects"}, ${t.entryCount} notebook ${t.entryCount === 1 ? "entry" : "entries"}. What do you want to explore?`;
  }
  if (type === "thought") {
    const t = THOUGHTS.find((x) => x.id === id);
    if (!t) return "This reflection is in context.";
    return `This reflection is loaded.${t.related.length ? ` Related to: ${t.related.join(", ")}.` : ""} I can help you examine it further, challenge assumptions, or connect it to your active work.`;
  }
  return "Context loaded.";
}

const WORKSPACE_PRIMER = `The entire workspace is available — ${PROJECTS.length} projects, ${IDEAS.length} ideas, ${ENTRIES.length} notebook entries, ${TECHNOLOGIES.length} technologies, ${THOUGHTS.length} thoughts. What are you thinking about?`;

// ─── Simulated Maurice responses ──────────────────────────────────────────────

function getMauriceResponse(
  type: ContextType | "workspace",
  userMsg: string,
): string {
  const msg = userMsg.toLowerCase();
  if (msg.includes("block") || msg.includes("stuck")) {
    return "Let's unpack the blocker. What specifically is preventing forward movement — is it a technical constraint, a decision you're postponing, or something else entirely?";
  }
  if (msg.includes("next") || msg.includes("should i")) {
    return "Based on what's in context, the most immediate leverage point seems to be the next action already defined. But tell me — is there something making that feel uncertain or wrong?";
  }
  if (msg.includes("idea") || msg.includes("think")) {
    return "That's an interesting thread to pull. The pattern I notice across your workspace is a preference for building tools that solve your own problems first. Does this align with that?";
  }
  if (type === "project") {
    return "Looking at this project's history and linked entries, there's a consistent theme. What aspect feels most uncertain right now — the technical approach, or the scope?";
  }
  if (type === "tech") {
    return "Your notebook entries around this technology show genuine depth forming. The gap between Comfortable and Proficient usually closes through deliberate projects, not just usage. Want to identify one?";
  }
  if (type === "thought") {
    return "This kind of reflection tends to be more valuable when tested against a specific case. Can you point to a moment in the last two weeks where this played out?";
  }
  return "I'm following your thinking. Can you say more — what's the piece you're trying to resolve?";
}

// ─── Atmospheric Canvas ───────────────────────────────────────────────────────

function Canvas() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-25%",
          left: "-15%",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(233,180,76,0.06) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-5%",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,169,130,0.04) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "45%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(145,128,170,0.025) 0%, transparent 60%)",
          filter: "blur(80px)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const CARD_BASE: CSSProperties = {
  background: "#131109",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow:
    "0 2px 16px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const CARD_HOVER: CSSProperties = {
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
  transform: "translateY(-2px)",
  borderColor: "rgba(255,255,255,0.11)",
};

function FloatCard({
  children,
  className = "",
  style = {},
  interactive = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        ...CARD_BASE,
        transition: interactive
          ? "transform 0.18s ease-out, box-shadow 0.18s ease-out, border-color 0.18s ease-out"
          : undefined,
        ...(interactive && hov ? CARD_HOVER : {}),
        ...style,
      }}
      onMouseEnter={interactive ? () => setHov(true) : undefined}
      onMouseLeave={interactive ? () => setHov(false) : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-4"
      style={{ color: "#4a4a40", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </div>
  );
}

function Mono({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{ fontFamily: "'JetBrains Mono', monospace", ...style }}
    >
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: ProjectStatus }) {
  const { color, label, Icon } = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide uppercase"
      style={{
        background: color + "1a",
        color,
        border: `1px solid ${color}25`,
      }}
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
      className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-lg shrink-0"
      style={{
        background: color + "1a",
        color,
        border: `1px solid ${color}25`,
      }}
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
          className="h-[3px] flex-1 rounded-full"
          style={{
            background: i < filled ? color : "rgba(255,255,255,0.07)",
            boxShadow: i < filled ? `0 0 4px ${color}50` : "none",
          }}
        />
      ))}
    </div>
  );
}

function InlineTag({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[11px] px-2 py-0.5 rounded-md font-medium"
      style={{ background: "rgba(255,255,255,0.06)", color: "#9a9a88" }}
    >
      {children}
    </span>
  );
}

function AmberBtn({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 h-9 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-90 ${className}`}
      style={{ background: "#e9b44c", color: "#0d0b07" }}
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-[12px] font-medium transition-colors ${className}`}
      style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9a9a88" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
      }
    >
      {children}
    </button>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function AuthModal({
  onAuth,
  onClose,
}: {
  onAuth: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ paddingBottom: "8vh" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: "380px",
          background: "rgba(16, 13, 9, 0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Top accent */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(233,180,76,0.4), transparent)",
          }}
        />

        <div className="p-8">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(233,180,76,0.08)",
                border: "1px solid rgba(233,180,76,0.18)",
              }}
            >
              <LogIn size={20} style={{ color: "#e9b44c" }} />
            </div>
          </div>

          <h2
            className="text-[20px] text-center text-foreground mb-2"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Sign in to continue
          </h2>
          <p
            className="text-[13px] text-center mb-8 leading-relaxed"
            style={{ color: "#7a7a6a" }}
          >
            You are browsing as a guest. Sign in to create, edit, and save your
            work.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onAuth}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-xl text-[14px] font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0ede6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <User size={16} style={{ color: "#9a9a88" }} />
              Continue with Google
            </button>
            <button
              onClick={onAuth}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-xl text-[14px] font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0ede6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <User size={16} style={{ color: "#9a9a88" }} />
              Continue with GitHub
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 text-[12px] py-2 transition-colors"
            style={{ color: "#5a5a4a" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9a9a88")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5a5a4a")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chat UI components ───────────────────────────────────────────────────────

function MauriceAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-xl flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #3d2f5e, #1e1a2e)",
        border: "1px solid rgba(145,128,170,0.3)",
        boxShadow: "0 0 12px rgba(145,128,170,0.15)",
      }}
    >
      <Sparkles
        size={size * 0.45}
        style={{ color: "#9180aa" }}
        strokeWidth={1.5}
      />
    </div>
  );
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-md text-[14px] leading-[1.65]"
          style={{
            background: "rgba(233,180,76,0.12)",
            border: "1px solid rgba(233,180,76,0.18)",
            color: "#f0ede6",
          }}
        >
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <MauriceAvatar size={28} />
      <div
        className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-md text-[14px] leading-[1.65]"
        style={{
          background: "#131109",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "#c9c5ba",
        }}
        dangerouslySetInnerHTML={{
          __html: msg.content.replace(
            /\*\*(.+?)\*\*/g,
            '<strong style="color:#f0ede6">$1</strong>',
          ),
        }}
      />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <MauriceAvatar size={28} />
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-md"
        style={{
          background: "#131109",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#5a5a4a",
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

function ChatInput({
  onSend,
  placeholder = "Message Maurice…",
}: {
  onSend: (msg: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div
      className="flex items-end gap-3 p-3 rounded-2xl"
      style={{
        background: "#131109",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        onInput={handleInput}
        placeholder={placeholder}
        rows={1}
        className="flex-1 bg-transparent text-[14px] outline-none resize-none leading-[1.6]"
        style={{
          color: "#f0ede6",
          minHeight: "24px",
          maxHeight: "160px",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim()}
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
        style={{
          background: value.trim() ? "#e9b44c" : "rgba(255,255,255,0.06)",
          color: value.trim() ? "#0d0b07" : "#4a4a40",
        }}
      >
        <Send size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── Workspace Conversation ───────────────────────────────────────────────────

function WorkspaceConversation({
  messages,
  typing,
  onSend,
  onClose,
}: {
  messages: ChatMessage[];
  typing: boolean;
  onSend: (msg: string) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const suggestions = [
    "What should I focus on today?",
    "Summarize my active projects",
    "What ideas are worth pursuing next?",
    "Find connections between my work",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "#7a7a6a" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a6a")}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <MauriceAvatar size={32} />
          <div>
            <div
              className="text-[15px] font-semibold text-foreground"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Maurice
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#9180aa",
                  boxShadow: "0 0 6px rgba(145,128,170,0.6)",
                }}
              />
              <Mono className="text-[10px]" style={{ color: "#5a5a4a" }}>
                Workspace context
              </Mono>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        {typing && <TypingIndicator />}

        {/* Prompt suggestions — show when only the primer is there */}
        {messages.length === 1 && !typing && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSend(s)}
                className="text-[12px] px-3 py-1.5 rounded-xl transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#9a9a88",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.color = "#c9c5ba";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#9a9a88";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3 shrink-0">
        <ChatInput onSend={onSend} placeholder="Ask about your workspace…" />
      </div>
    </div>
  );
}

// ─── Context Conversation ─────────────────────────────────────────────────────

function ContextCard({ type, id }: { type: ContextType; id: string }) {
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

function ContextConversation({
  context,
  messages,
  typing,
  onSend,
  onClose,
}: {
  context: ContextPayload;
  messages: ChatMessage[];
  typing: boolean;
  onSend: (msg: string) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const contextLabel: Record<ContextType, string> = {
    project: "project",
    idea: "idea",
    notebook: "notebook entry",
    tech: "technology",
    thought: "thought",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Back bar */}
      <div
        className="flex items-center gap-3 px-5 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[12px] transition-colors"
          style={{ color: "#7a7a6a" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a6a")}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div
          className="w-px h-4 mx-1"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div className="flex items-center gap-2">
          <MauriceAvatar size={20} />
          <Mono className="text-[11px]" style={{ color: "#5a5a4a" }}>
            Maurice · {contextLabel[context.type]} context
          </Mono>
        </div>
      </div>

      {/* Context card — pinned, animated */}
      <div
        className="mx-5 mt-5 mb-0 rounded-2xl overflow-hidden shrink-0"
        style={{
          ...CARD_BASE,
          borderColor: "rgba(145,128,170,0.2)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(145,128,170,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        }}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(145,128,170,0.35), transparent)",
          }}
        />
        <ContextCard type={context.type} id={context.id} />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 pt-5 pb-2 flex flex-col gap-4"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 0.4s ease-out 0.15s",
        }}
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-3 shrink-0">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardModule({
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

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsModule({
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

// ─── Ideas ────────────────────────────────────────────────────────────────────

function IdeasModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  return (
    <div className="p-5 md:p-7 lg:p-8 pb-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[28px] text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Ideas
        </h2>
        <AmberBtn onClick={() => onGuardedAction(() => {})}>
          <Plus size={14} strokeWidth={2.5} /> New Idea
        </AmberBtn>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {IDEAS.map((idea) => (
          <FloatCard
            key={idea.id}
            interactive
            className="break-inside-avoid mb-4 p-5 cursor-pointer"
            onClick={() => onContext("idea", idea.id)}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-[15px] font-semibold text-foreground leading-snug">
                {idea.title}
              </div>
              <IdeaBadge status={idea.status} />
            </div>
            <p
              className="text-[13px] leading-[1.65] mb-4 line-clamp-4"
              style={{ color: "#7a7a6a" }}
            >
              {idea.description}
            </p>
            {idea.nextStep && (
              <div
                className="text-[12px] px-3 py-2.5 rounded-xl mb-4 leading-snug"
                style={{
                  background: "rgba(124,169,130,0.1)",
                  color: "#7ca982",
                  border: "1px solid rgba(124,169,130,0.15)",
                }}
              >
                → {idea.nextStep}
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <Mono
                  className="text-[9px] uppercase tracking-[0.1em] w-[68px]"
                  style={{ color: "#4a4a40" }}
                >
                  Confidence
                </Mono>
                <div className="flex-1">
                  <Bar filled={idea.confidence} total={5} color="#e9b44c" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mono
                  className="text-[9px] uppercase tracking-[0.1em] w-[68px]"
                  style={{ color: "#4a4a40" }}
                >
                  Importance
                </Mono>
                <div className="flex-1">
                  <Bar filled={idea.importance} total={5} color="#7ca982" />
                </div>
              </div>
            </div>
          </FloatCard>
        ))}
      </div>
    </div>
  );
}

// ─── Notebook ─────────────────────────────────────────────────────────────────

function NotebookModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  const [composing, setComposing] = useState(false);
  const groups = groupByDate(ENTRIES);

  return (
    <div className="p-5 md:p-8 pb-16 max-w-[760px] mx-auto">
      {!composing ? (
        <FloatCard
          interactive
          className="mb-8 p-5 cursor-text"
          onClick={() => onGuardedAction(() => setComposing(true))}
        >
          <span
            style={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: "18px",
              color: "#4a4a40",
              fontStyle: "italic",
            }}
          >
            Jot something down…
          </span>
        </FloatCard>
      ) : (
        <FloatCard
          className="mb-8 p-6"
          style={{ borderColor: "rgba(233,180,76,0.3)" }}
        >
          <input
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[16px] font-semibold outline-none mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          />
          <textarea
            autoFocus
            placeholder="Start writing…"
            className="w-full bg-transparent text-foreground text-[14px] leading-[1.7] outline-none resize-none"
            style={{ minHeight: "120px" }}
          />
          <div
            className="flex items-center justify-between pt-3.5 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="flex gap-4 text-[12px]"
              style={{ color: "#7a7a6a" }}
            >
              <button className="hover:text-foreground transition-colors">
                Link to…
              </button>
              <span style={{ opacity: 0.4 }}>·</span>
              <button className="hover:text-foreground transition-colors">
                Add tags
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setComposing(false)}
                className="text-[12px] px-3 h-7 rounded-lg transition-colors"
                style={{ color: "#7a7a6a" }}
              >
                Cancel
              </button>
              <AmberBtn className="text-[12px] px-3 h-7">Save</AmberBtn>
            </div>
          </div>
        </FloatCard>
      )}

      {groups.map(({ label, entries }) => (
        <div key={label} className="mb-8">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-4 py-2 sticky top-0"
            style={{
              background: "#0a0907",
              color: "#4a4a40",
              fontFamily: "'JetBrains Mono', monospace",
              zIndex: 2,
            }}
          >
            {label}
          </div>
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <FloatCard
                key={e.id}
                interactive
                className="p-5 cursor-pointer group"
                onClick={() => onContext("notebook", e.id)}
              >
                {e.title && (
                  <div
                    className="text-[15px] font-semibold text-foreground mb-2 group-hover:text-foreground/80 transition-colors"
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
                <div className="flex items-center gap-2 mt-3.5">
                  {(e.linkedProject || e.linkedTech) && (
                    <InlineTag>{e.linkedProject || e.linkedTech}</InlineTag>
                  )}
                  <Mono
                    className="text-[10px] ml-auto"
                    style={{ color: "#4a4a40" }}
                  >
                    {relativeTime(e.createdAt)}
                  </Mono>
                </div>
              </FloatCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Technologies ─────────────────────────────────────────────────────────────

function TechnologiesModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  return (
    <div className="p-5 md:p-7 lg:p-8 pb-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[28px] text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Technologies
        </h2>
        <GhostBtn onClick={() => onGuardedAction(() => {})}>
          <Plus size={13} /> Add Technology
        </GhostBtn>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TECHNOLOGIES.map((t) => (
          <FloatCard
            key={t.id}
            interactive
            className="p-5 cursor-pointer"
            onClick={() => onContext("tech", t.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-[16px] font-semibold text-foreground">
                {t.name}
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  color:
                    t.mastery >= 3
                      ? "#e9b44c"
                      : t.mastery === 2
                        ? "#c9c5ba"
                        : "#7a7a6a",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {MASTERY_LABEL[t.mastery]}
              </span>
            </div>
            <div className="mb-4">
              <Bar filled={t.mastery} total={4} color="#e9b44c" />
            </div>
            <div className="flex gap-3">
              <Mono className="text-[11px]" style={{ color: "#7a7a6a" }}>
                {t.projectCount} {t.projectCount !== 1 ? "projects" : "project"}
              </Mono>
              <span style={{ color: "#4a4a40", opacity: 0.5 }}>·</span>
              <Mono className="text-[11px]" style={{ color: "#7a7a6a" }}>
                {t.entryCount} entries
              </Mono>
            </div>
          </FloatCard>
        ))}
      </div>
    </div>
  );
}

// ─── Evolution ────────────────────────────────────────────────────────────────

function EvolutionModule() {
  const [selectedProject, setSelectedProject] = useState("1");
  const project = PROJECTS.find((p) => p.id === selectedProject);
  const events = [
    {
      date: new Date(Date.now() - 2 * 3600000),
      color: "#7ca982",
      text: "Status changed from idea → active",
      note: undefined,
    },
    {
      date: new Date(Date.now() - 9 * 3600000),
      color: "#e9b44c",
      text: "Linked TypeScript, React, Supabase",
      note: undefined,
    },
    {
      date: new Date(Date.now() - 3 * 86400000),
      color: "#7a7a6a",
      text: "Debugging Supabase RLS policies",
      note: "Spent two hours chasing a 401 that turned out to be a missing auth.uid() check in the RLS policy for the media table.",
    },
    {
      date: new Date(Date.now() - 5 * 86400000),
      color: "#e9b44c",
      text: "Project created",
      note: undefined,
    },
  ];

  return (
    <div className="p-5 md:p-8 pb-16 max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-[28px] text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Evolution
        </h2>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="text-[12px] rounded-xl px-3 h-9 outline-none"
          style={{
            background: "#131109",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#9a9a88",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {PROJECTS.filter((p) => p.status !== "archived").map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {project && (
        <FloatCard className="p-5 mb-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: STATUS_CFG[project.status].color }}
            />
            <div
              className="text-[20px] text-foreground"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              {project.name}
            </div>
          </div>
          <div
            className="text-[13px] leading-relaxed"
            style={{ color: "#7a7a6a" }}
          >
            {project.objective}
          </div>
        </FloatCard>
      )}
      <div className="relative pl-10">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          }}
        />
        <div className="flex flex-col gap-5">
          {events.map((ev, i) => (
            <div key={i} className="relative">
              <div
                className="absolute rounded-full"
                style={{
                  background: ev.color,
                  width: "12px",
                  height: "12px",
                  left: "-37px",
                  top: "16px",
                  border: "2px solid #0a0907",
                  boxShadow: `0 0 8px ${ev.color}60`,
                }}
              />
              <FloatCard className="p-4">
                <div className="text-[13px] font-semibold text-foreground mb-1">
                  {ev.text}
                </div>
                {ev.note && (
                  <div
                    className="text-[12px] leading-relaxed mt-2 line-clamp-2"
                    style={{ color: "#7a7a6a" }}
                  >
                    {ev.note}
                  </div>
                )}
                <Mono
                  className="text-[10px] block mt-2"
                  style={{ color: "#4a4a40" }}
                >
                  {relativeTime(ev.date)}
                </Mono>
              </FloatCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Thoughts ─────────────────────────────────────────────────────────────────

function ThoughtsModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  const [composing, setComposing] = useState(false);

  return (
    <div className="p-5 md:p-8 pb-16 max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[28px] text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Thoughts
        </h2>
        <AmberBtn onClick={() => onGuardedAction(() => setComposing(true))}>
          <Plus size={14} strokeWidth={2.5} /> New Thought
        </AmberBtn>
      </div>
      {composing && (
        <FloatCard
          className="mb-5 p-6"
          style={{ borderColor: "rgba(124,169,130,0.3)" }}
        >
          <input
            autoFocus
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[16px] font-semibold outline-none mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          />
          <textarea
            placeholder="A reflection, a pattern you've noticed, a belief worth examining…"
            className="w-full bg-transparent text-[13px] text-foreground leading-[1.7] outline-none resize-none"
            style={{ minHeight: "100px" }}
          />
          <div
            className="flex items-center justify-end gap-2 pt-3.5 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={() => setComposing(false)}
              className="text-[12px] px-3 h-7 transition-colors"
              style={{ color: "#7a7a6a" }}
            >
              Cancel
            </button>
            <AmberBtn className="text-[12px] px-3 h-7">Save Thought</AmberBtn>
          </div>
        </FloatCard>
      )}
      <div className="flex flex-col gap-4">
        {THOUGHTS.map((t) => (
          <FloatCard
            key={t.id}
            interactive
            className="p-5 cursor-pointer"
            style={{
              borderLeftWidth: "2px",
              borderLeftColor: "rgba(124,169,130,0.45)",
            }}
            onClick={() => onContext("thought", t.id)}
          >
            {t.title && (
              <div
                className="text-[15px] font-semibold text-foreground mb-2"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                {t.title}
              </div>
            )}
            <p
              className="text-[13px] leading-[1.7]"
              style={{ color: "#7a7a6a" }}
            >
              {t.preview}
            </p>
            <div className="flex items-center gap-2 mt-3.5 flex-wrap">
              {t.related.map((r) => (
                <InlineTag key={r}>{r}</InlineTag>
              ))}
              <Mono
                className="text-[10px] ml-auto"
                style={{ color: "#4a4a40" }}
              >
                {relativeTime(t.updatedAt)}
              </Mono>
            </div>
          </FloatCard>
        ))}
      </div>
    </div>
  );
}

// ─── Knowledge Graph ──────────────────────────────────────────────────────────

function GraphModule({
  onContext,
}: {
  onContext: (type: ContextType, id: string) => void;
}) {
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
      dataId: "1",
    },
    {
      id: "devfolio",
      x: 590,
      y: 130,
      label: "Devfolio",
      color: "#e9b44c",
      r: 16,
      type: "project",
      dataId: "2",
    },
    {
      id: "zephyr",
      x: 170,
      y: 330,
      label: "Zephyr",
      color: "#e9b44c",
      r: 16,
      type: "project",
      dataId: "3",
    },
    {
      id: "tessera",
      x: 480,
      y: 355,
      label: "Tessera",
      color: "#e9b44c",
      r: 14,
      type: "project",
      dataId: "4",
    },
    {
      id: "typescript",
      x: 460,
      y: 245,
      label: "TypeScript",
      color: "#7ca982",
      r: 20,
      type: "tech",
      dataId: "1",
    },
    {
      id: "rust",
      x: 220,
      y: 450,
      label: "Rust",
      color: "#7ca982",
      r: 15,
      type: "tech",
      dataId: "5",
    },
    {
      id: "react",
      x: 580,
      y: 310,
      label: "React",
      color: "#7ca982",
      r: 18,
      type: "tech",
      dataId: "2",
    },
    {
      id: "supabase",
      x: 400,
      y: 110,
      label: "Supabase",
      color: "#7ca982",
      r: 14,
      type: "tech",
      dataId: "7",
    },
    {
      id: "webrtc",
      x: 580,
      y: 430,
      label: "WebRTC",
      color: "#7ca982",
      r: 12,
      type: "tech",
      dataId: "8",
    },
    {
      id: "idea1",
      x: 700,
      y: 220,
      label: "Semantic search",
      color: "#9180aa",
      r: 12,
      type: "idea",
      dataId: "1",
    },
    {
      id: "idea2",
      x: 100,
      y: 215,
      label: "TUI kanban",
      color: "#9180aa",
      r: 12,
      type: "idea",
      dataId: "3",
    },
    {
      id: "thought1",
      x: 700,
      y: 385,
      label: "On Rust",
      color: "#5a5a4a",
      r: 10,
      type: "thought",
      dataId: "1",
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

  const typeToContext: Record<string, ContextType> = {
    project: "project",
    tech: "tech",
    idea: "idea",
    thought: "thought",
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="px-7 pt-7 pb-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <h2
            className="text-[28px] text-foreground"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Knowledge Graph
          </h2>
          <p className="text-[12px] mt-1" style={{ color: "#7a7a6a" }}>
            Your engineering life as a graph. Click nodes to open a
            conversation.
          </p>
        </div>
        <div className="flex items-center gap-5">
          {(
            [
              ["#e9b44c", "Projects"],
              ["#7ca982", "Technologies"],
              ["#9180aa", "Ideas"],
              ["#5a5a4a", "Thoughts"],
            ] as const
          ).map(([color, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: color }}
              />
              <Mono className="text-[11px]" style={{ color: "#7a7a6a" }}>
                {label}
              </Mono>
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
            <radialGradient id="gbg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0f0d09" />
              <stop offset="100%" stopColor="#080705" />
            </radialGradient>
            {nodes.map((n) => (
              <radialGradient
                key={`glow-${n.id}`}
                id={`glow-${n.id}`}
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor={n.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          <rect width="800" height="540" fill="url(#gbg)" />
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
                  isLit ? "rgba(240,237,230,0.22)" : "rgba(240,237,230,0.05)"
                }
                strokeWidth={isLit ? 1.5 : 1}
                style={{ transition: "stroke 0.2s ease" }}
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
                onClick={() =>
                  onContext(typeToContext[n.type] as ContextType, n.dataId)
                }
              >
                {isHov && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r * 2.8}
                    fill={`url(#glow-${n.id})`}
                  />
                )}
                {isHov && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r + 7}
                    fill="none"
                    stroke={n.color}
                    strokeWidth={1}
                    opacity={0.3}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={n.color}
                  opacity={isDimmed ? 0.1 : 1}
                  style={{ transition: "opacity 0.2s ease" }}
                />
                <text
                  x={n.x}
                  y={n.y + n.r + 15}
                  textAnchor="middle"
                  fill={isDimmed ? "rgba(240,237,230,0.12)" : "#9a9a88"}
                  fontSize="10.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                  style={{ transition: "fill 0.2s ease" }}
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
    <div className="p-5 md:p-8 pb-16 max-w-[680px] mx-auto">
      <h2
        className="text-[28px] text-foreground mb-8"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        Settings
      </h2>
      <div className="flex flex-col gap-7">
        {sections.map((section) => (
          <div key={section.title}>
            <Mono
              className="text-[10px] font-semibold uppercase tracking-[0.1em] block mb-3"
              style={{ color: "#4a4a40" }}
            >
              {section.title}
            </Mono>
            <FloatCard className="overflow-hidden">
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    borderTop:
                      i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <label className="text-[14px] font-medium text-foreground">
                    {item.label}
                  </label>
                  {item.type === "input" && (
                    <input
                      defaultValue={item.value}
                      className="text-[13px] bg-transparent rounded-xl px-3 h-8 text-right outline-none w-48"
                      style={{
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "#9a9a88",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                  )}
                  {item.type === "static" && (
                    <Mono className="text-[13px]" style={{ color: "#7a7a6a" }}>
                      {item.value}
                    </Mono>
                  )}
                  {item.type === "toggle" && (
                    <div
                      className="relative w-9 h-5 rounded-full cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <div
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full"
                        style={{ background: "#5a5a4a" }}
                      />
                    </div>
                  )}
                  {item.type === "action" && <GhostBtn>Export JSON</GhostBtn>}
                </div>
              ))}
            </FloatCard>
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  active,
  onNavigate,
  onPaletteOpen,
  onMaurice,
  onSignIn,
  isGuest,
  isMauriceActive,
  onClose,
}: {
  active: Module;
  onNavigate: (m: Module) => void;
  onPaletteOpen: () => void;
  onMaurice: () => void;
  onSignIn: () => void;
  isGuest: boolean;
  isMauriceActive: boolean;
  onClose?: () => void;
}) {
  return (
    <div
      className="w-[220px] flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(13,11,8,0.97)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow:
          "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center px-4 pt-5 pb-3">
        <span
          className="text-foreground"
          style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: "19px",
            letterSpacing: "-0.01em",
          }}
        >
          Workbench
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="w-[6px] h-[6px] rounded-full"
            style={{
              background: "#7ca982",
              boxShadow: "0 0 6px rgba(124,169,130,0.6)",
            }}
            title="All synced"
          />
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors lg:hidden ml-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <button
          onClick={onPaletteOpen}
          className="w-full flex items-center gap-2 px-3 h-8 rounded-xl text-[12px] transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#7a7a6a",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          <Search size={11} />
          <span className="flex-1 text-left">Search…</span>
          <Mono className="text-[10px] opacity-50">⌘K</Mono>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2">
        {NAV_ITEMS.map(({ id, label, Icon, count }) => {
          const isActive = active === id && !isMauriceActive;
          return (
            <button
              key={id}
              onClick={() => {
                onNavigate(id as Module);
                onClose?.();
              }}
              className="w-full flex items-center gap-2.5 h-9 text-[13px] rounded-xl mb-0.5 transition-all duration-150"
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                background: isActive ? "rgba(233,180,76,0.12)" : "transparent",
                color: isActive ? "#f0ede6" : "#7a7a6a",
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon
                size={16}
                style={{ color: isActive ? "#e9b44c" : "#5a5a4a" }}
              />
              <span className="flex-1 text-left">{label}</span>
              {count !== undefined && !isActive && (
                <Mono className="text-[10px]" style={{ color: "#4a4a40" }}>
                  {count}
                </Mono>
              )}
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{
                    background: "#e9b44c",
                    boxShadow: "0 0 4px rgba(233,180,76,0.8)",
                  }}
                />
              )}
            </button>
          );
        })}

        <div
          className="mx-2 my-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        />

        {/* Settings */}
        {(() => {
          const isActive = active === "settings" && !isMauriceActive;
          return (
            <button
              onClick={() => {
                onNavigate("settings");
                onClose?.();
              }}
              className="w-full flex items-center gap-2.5 h-9 text-[13px] rounded-xl mb-0.5 transition-all duration-150"
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                background: isActive ? "rgba(233,180,76,0.12)" : "transparent",
                color: isActive ? "#f0ede6" : "#7a7a6a",
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Settings
                size={16}
                style={{ color: isActive ? "#e9b44c" : "#5a5a4a" }}
              />
              <span className="flex-1 text-left">Settings</span>
            </button>
          );
        })()}

        {/* Maurice */}
        <button
          onClick={onMaurice}
          className="w-full flex items-center gap-2.5 h-9 text-[13px] rounded-xl mb-0.5 transition-all duration-150"
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            background: isMauriceActive
              ? "rgba(145,128,170,0.14)"
              : "transparent",
            color: isMauriceActive ? "#c9c5ba" : "#7a7a6a",
            fontWeight: isMauriceActive ? 600 : 500,
          }}
          onMouseEnter={(e) => {
            if (!isMauriceActive)
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            if (!isMauriceActive)
              e.currentTarget.style.background = "transparent";
          }}
        >
          <Bot
            size={16}
            style={{
              color: isMauriceActive ? "#9180aa" : "#5a5a4a",
              transition: "color 0.15s ease",
            }}
          />
          <span className="flex-1 text-left">Maurice</span>
          {isMauriceActive ? (
            <div
              className="w-1 h-1 rounded-full shrink-0"
              style={{
                background: "#9180aa",
                boxShadow: "0 0 4px rgba(145,128,170,0.8)",
              }}
            />
          ) : (
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "rgba(145,128,170,0.4)" }}
            />
          )}
        </button>
      </nav>

      {/* Bottom — guest or user */}
      <div
        className="p-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {isGuest ? (
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-[10px]" style={{ color: "#5a5a4a" }}>
                  G
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[12px] font-medium"
                  style={{ color: "#7a7a6a" }}
                >
                  Guest
                </div>
                <Mono className="text-[10px]" style={{ color: "#4a4a40" }}>
                  Browse only
                </Mono>
              </div>
            </div>
            <button
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-2 h-8 rounded-xl text-[12px] font-medium transition-all"
              style={{
                background: "rgba(233,180,76,0.08)",
                border: "1px solid rgba(233,180,76,0.18)",
                color: "#e9b44c",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(233,180,76,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(233,180,76,0.08)";
              }}
            >
              <LogIn size={12} /> Sign In
            </button>
          </div>
        ) : (
          <button
            className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl transition-colors"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, #e9b44c, #c9984a)",
                color: "#0d0b07",
              }}
            >
              J
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-[13px] font-semibold text-foreground leading-tight">
                Jamie Chen
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#7ca982" }}
                />
                <Mono className="text-[9px]" style={{ color: "#4a4a40" }}>
                  Online
                </Mono>
              </div>
            </div>
            <ChevronDown size={12} style={{ color: "#5a5a4a" }} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [module, setModule] = useState<Module>("dashboard");
  const [appMode, setAppMode] = useState<AppMode>("module");
  const [context, setContext] = useState<ContextPayload | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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

  const simulateResponse = useCallback(
    (contextType: ContextType | "workspace", userMsg: string) => {
      setTyping(true);
      setTimeout(
        () => {
          setTyping(false);
          const response = getMauriceResponse(contextType, userMsg);
          setMessages((prev) => [
            ...prev,
            { id: uid(), role: "assistant", content: response, ts: new Date() },
          ]);
        },
        900 + Math.random() * 600,
      );
    },
    [],
  );

  const enterWorkspace = useCallback(() => {
    setAppMode("workspace");
    setContext(null);
    const primer: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: WORKSPACE_PRIMER,
      ts: new Date(),
    };
    setMessages([primer]);
  }, []);

  const enterContext = useCallback((type: ContextType, id: string) => {
    setAppMode("context");
    setContext({ type, id });
    const primer = getMauricePrimer(type, id);
    setMessages([
      { id: uid(), role: "assistant", content: primer, ts: new Date() },
    ]);
  }, []);

  const exitConversation = useCallback(() => {
    setAppMode("module");
    setContext(null);
    setMessages([]);
    setTyping(false);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const msg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text,
        ts: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
      const ctype = context?.type ?? "workspace";
      simulateResponse(ctype, text);
    },
    [context, simulateResponse],
  );

  const guardedAction = useCallback(
    (action: () => void) => {
      if (!isGuest) {
        action();
        return;
      }
      setPendingAction(() => action);
      setAuthOpen(true);
    },
    [isGuest],
  );

  const handleAuth = useCallback(() => {
    setIsGuest(false);
    setAuthOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleNavigate = useCallback((m: Module) => {
    setModule(m);
    setAppMode("module");
    setContext(null);
    setMessages([]);
  }, []);

  const isMauriceActive = appMode === "workspace" || appMode === "context";

  const renderModule = () => {
    if (appMode === "workspace") {
      return (
        <WorkspaceConversation
          messages={messages}
          typing={typing}
          onSend={handleSend}
          onClose={exitConversation}
        />
      );
    }
    if (appMode === "context" && context) {
      return (
        <ContextConversation
          context={context}
          messages={messages}
          typing={typing}
          onSend={handleSend}
          onClose={exitConversation}
        />
      );
    }
    switch (module) {
      case "dashboard":
        return <DashboardModule onContext={enterContext} />;
      case "projects":
        return (
          <ProjectsModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "ideas":
        return (
          <IdeasModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "notebook":
        return (
          <NotebookModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "technologies":
        return (
          <TechnologiesModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "evolution":
        return <EvolutionModule />;
      case "thoughts":
        return (
          <ThoughtsModule
            onContext={enterContext}
            onGuardedAction={guardedAction}
          />
        );
      case "graph":
        return <GraphModule onContext={enterContext} />;
      case "settings":
        return <SettingsModule />;
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
      <Canvas />

      {/* Desktop floating sidebar */}
      <div className="hidden lg:flex p-3 shrink-0" style={{ zIndex: 10 }}>
        <Sidebar
          active={module}
          onNavigate={handleNavigate}
          onPaletteOpen={() => setPaletteOpen(true)}
          onMaurice={() =>
            appMode === "workspace" ? exitConversation() : enterWorkspace()
          }
          onSignIn={() => setAuthOpen(true)}
          isGuest={isGuest}
          isMauriceActive={isMauriceActive}
        />
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className="absolute left-0 top-0 bottom-0 p-3"
            style={{ width: "268px", zIndex: 41 }}
          >
            <Sidebar
              active={module}
              onNavigate={handleNavigate}
              onPaletteOpen={() => {
                setPaletteOpen(true);
                setMobileNavOpen(false);
              }}
              onMaurice={() => {
                appMode === "workspace" ? exitConversation() : enterWorkspace();
                setMobileNavOpen(false);
              }}
              onSignIn={() => {
                setAuthOpen(true);
                setMobileNavOpen(false);
              }}
              isGuest={isGuest}
              isMauriceActive={isMauriceActive}
              onClose={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className="relative flex flex-col flex-1 min-w-0 overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {/* Mobile header */}
        <div
          className="lg:hidden flex items-center justify-between px-4 h-14 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-xl"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#9a9a88",
            }}
          >
            <Menu size={16} />
          </button>
          <span
            className="text-[17px] text-foreground"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Workbench
          </span>
          <button
            onClick={() => setPaletteOpen(true)}
            className="p-2 rounded-xl"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#9a9a88",
            }}
          >
            <Search size={15} />
          </button>
        </div>

        <main
          className={`flex-1 overflow-y-auto ${module === "graph" && appMode === "module" ? "flex flex-col overflow-hidden" : ""} ${appMode !== "module" ? "flex flex-col overflow-hidden" : ""}`}
        >
          {renderModule()}
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onNavigate={handleNavigate}
        />
      )}
      {authOpen && (
        <AuthModal
          onAuth={handleAuth}
          onClose={() => {
            setAuthOpen(false);
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
}
