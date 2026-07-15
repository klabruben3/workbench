import type { Project, Idea, NEntry, Tech, Thought, FeedEvent } from "../types";

export const PROJECTS: Project[] = [
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

export const IDEAS: Idea[] = [
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

export const ENTRIES: NEntry[] = [
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

export const TECHNOLOGIES: Tech[] = [
  { id: "1", name: "TypeScript", mastery: 4, projectCount: 4, entryCount: 11 },
  { id: "2", name: "React", mastery: 4, projectCount: 3, entryCount: 7 },
  { id: "3", name: "Next.js", mastery: 3, projectCount: 1, entryCount: 4 },
  { id: "4", name: "Tailwind CSS", mastery: 3, projectCount: 3, entryCount: 3 },
  { id: "5", name: "Rust", mastery: 1, projectCount: 1, entryCount: 5 },
  { id: "6", name: "PostgreSQL", mastery: 2, projectCount: 2, entryCount: 6 },
  { id: "7", name: "Supabase", mastery: 2, projectCount: 1, entryCount: 4 },
  { id: "8", name: "WebRTC", mastery: 1, projectCount: 1, entryCount: 2 },
];

export const THOUGHTS: Thought[] = [
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

export const ACTIVITY: FeedEvent[] = [
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
