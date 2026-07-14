import {
  Circle,
  CheckCircle2,
  PauseCircle,
  AlertCircle,
  Zap,
  Archive,
} from "lucide-react";
import type { Priority, ProjectStatus } from "../types";

export const STATUS_CFG: Record<
  ProjectStatus,
  { color: string; label: string; Icon: typeof Circle }
> = {
  idea: { color: "#7a7a6a", label: "Idea", Icon: Circle },
  active: { color: "#7ca982", label: "Active", Icon: CheckCircle2 },
  paused: { color: "#d4a24c", label: "Paused", Icon: PauseCircle },
  blocked: { color: "#c9614a", label: "Blocked", Icon: AlertCircle },
  shipped: { color: "#e9b44c", label: "Shipped", Icon: Zap },
  archived: { color: "#7a7a6a", label: "Archived", Icon: Archive },
};

export const PRIORITY_COLOR: Record<Priority, string> = {
  low: "#7a7a6a",
  medium: "#d4a24c",
  high: "#c9614a",
};

export const MASTERY_LABEL = ["", "Exploring", "Comfortable", "Proficient", "Expert"];
