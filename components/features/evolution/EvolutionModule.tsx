import { useState } from "react";
import { PROJECTS } from "@/data/mockData";
import { STATUS_CFG } from "@/lib/constants";
import { relativeTime } from "@/lib/helpers";

import { FloatCard, Mono } from "@/components/ui";

export function EvolutionModule() {
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
