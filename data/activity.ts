import type { FeedEvent } from "../types";

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
