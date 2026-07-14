import type { Idea } from "../types";

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
