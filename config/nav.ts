import {
  LayoutDashboard,
  FolderOpen,
  Lightbulb,
  BookOpen,
  Cpu,
  GitBranch,
  MessageSquare,
  Network,
} from "lucide-react";
import type { Module } from "../types";

export const NAV_ITEMS = [
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

export const MODULE_META: Record<Module, { crumbs: string[] }> = {
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
