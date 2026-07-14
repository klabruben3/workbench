import type { Project } from "../types";

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
