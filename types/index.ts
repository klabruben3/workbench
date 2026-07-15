export type Module =
  | "dashboard"
  | "projects"
  | "ideas"
  | "notebook"
  | "technologies"
  | "evolution"
  | "thoughts"
  | "graph"
  | "settings";

export type AppMode = "module" | "workspace" | "context";

export type ContextType = "project" | "idea" | "notebook" | "tech" | "thought";

export interface ContextPayload {
  type: ContextType;
  id: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: Date;
}

export type ProjectStatus =
  | "idea"
  | "active"
  | "paused"
  | "blocked"
  | "shipped"
  | "archived";

export type Priority = "low" | "medium" | "high";

export interface Project {
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

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: "active" | "promoted" | "archived";
  confidence: number;
  importance: number;
  nextStep?: string;
}

export interface NEntry {
  id: string;
  title?: string;
  preview: string;
  linkedProject?: string;
  linkedTech?: string;
  createdAt: Date;
}

export interface Tech {
  id: string;
  name: string;
  mastery: 1 | 2 | 3 | 4;
  projectCount: number;
  entryCount: number;
}

export interface Thought {
  id: string;
  title?: string;
  preview: string;
  related: string[];
  updatedAt: Date;
}

export interface FeedEvent {
  id: string;
  verb: string;
  entity: string;
  entityType: string;
  time: Date;
}
