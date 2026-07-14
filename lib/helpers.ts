import type { NEntry } from "../types";

export function relativeTime(date: Date): string {
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

export function groupByDate(entries: NEntry[]) {
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
