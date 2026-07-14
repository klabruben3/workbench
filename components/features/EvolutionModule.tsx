"use client";
import { useState } from "react";
import { PROJECTS } from "@/data/projects";
import { relativeTime } from "@/lib/helpers";

export function EvolutionModule() {
  const [selectedProject, setSelectedProject] = useState<string>("1");
  const project = PROJECTS.find((p) => p.id === selectedProject);
  const [now] = useState(() => Date.now());

  const events = [
    {
      date: new Date(now - 2 * 3600000),
      type: "status",
      color: "#7ca982",
      text: "Status changed from idea → active",
      note: undefined,
    },
    {
      date: new Date(now - 9 * 3600000),
      type: "link",
      color: "#e9b44c",
      text: "Linked TypeScript, React, Supabase",
      note: undefined,
    },
    {
      date: new Date(now - 3 * 86400000),
      type: "notebook",
      color: "#7a7a6a",
      text: "Debugging Supabase RLS policies",
      note: "Spent two hours chasing a 401 that turned out to be a missing auth.uid() check in the RLS policy for the media table.",
    },
    {
      date: new Date(now - 5 * 86400000),
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
