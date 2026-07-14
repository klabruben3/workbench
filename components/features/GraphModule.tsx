"use client";
import { useState } from "react";

export function GraphModule() {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = [
    { id: "aperture", x: 340, y: 200, label: "Aperture", color: "#e9b44c", r: 22, type: "project" },
    { id: "devfolio", x: 590, y: 130, label: "Devfolio", color: "#e9b44c", r: 16, type: "project" },
    { id: "zephyr", x: 170, y: 330, label: "Zephyr", color: "#e9b44c", r: 16, type: "project" },
    { id: "tessera", x: 480, y: 350, label: "Tessera", color: "#e9b44c", r: 14, type: "project" },
    { id: "typescript", x: 460, y: 240, label: "TypeScript", color: "#7ca982", r: 20, type: "tech" },
    { id: "rust", x: 220, y: 450, label: "Rust", color: "#7ca982", r: 15, type: "tech" },
    { id: "react", x: 580, y: 310, label: "React", color: "#7ca982", r: 18, type: "tech" },
    { id: "supabase", x: 400, y: 115, label: "Supabase", color: "#7ca982", r: 14, type: "tech" },
    { id: "webrtc", x: 580, y: 430, label: "WebRTC", color: "#7ca982", r: 12, type: "tech" },
    { id: "idea1", x: 700, y: 220, label: "Semantic search", color: "#9180aa", r: 12, type: "idea" },
    { id: "idea2", x: 100, y: 210, label: "TUI kanban", color: "#9180aa", r: 12, type: "idea" },
    { id: "thought1", x: 700, y: 380, label: "On Rust", color: "#5a5a4a", r: 10, type: "thought" },
  ];

  const edges = [
    ["aperture", "typescript"],
    ["aperture", "react"],
    ["aperture", "supabase"],
    ["devfolio", "typescript"],
    ["devfolio", "react"],
    ["zephyr", "rust"],
    ["tessera", "react"],
    ["tessera", "webrtc"],
    ["typescript", "idea1"],
    ["rust", "idea2"],
    ["zephyr", "thought1"],
  ];

  const connected = (id: string) =>
    edges.filter(([a, b]) => a === id || b === id).flatMap(([a, b]) => [a, b]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-border">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground">
            Knowledge Graph
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Your engineering life as a graph. Hover nodes to explore
            connections.
          </p>
        </div>
        <div className="flex items-center gap-5">
          {[
            ["#e9b44c", "Projects"],
            ["#7ca982", "Technologies"],
            ["#9180aa", "Ideas"],
            ["#5a5a4a", "Thoughts"],
          ].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: color }}
              />
              <span className="text-[12px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 540"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0"
        >
          <defs>
            <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0f0f0d" />
              <stop offset="100%" stopColor="#0a0a08" />
            </radialGradient>
          </defs>
          <rect width="800" height="540" fill="url(#bg-grad)" />

          {edges.map(([a, b], i) => {
            const na = nodes.find((n) => n.id === a)!;
            const nb = nodes.find((n) => n.id === b)!;
            const isLit = hovered && (hovered === a || hovered === b);
            return (
              <line
                key={i}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={
                  isLit ? "rgba(240,237,230,0.25)" : "rgba(240,237,230,0.06)"
                }
                strokeWidth={isLit ? 1.5 : 1}
              />
            );
          })}

          {nodes.map((n) => {
            const isHov = hovered === n.id;
            const neighbors = hovered ? connected(hovered) : [];
            const isDimmed =
              hovered && !neighbors.includes(n.id) && hovered !== n.id;
            return (
              <g
                key={n.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {isHov && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r + 6}
                    fill="none"
                    stroke={n.color}
                    strokeWidth={1}
                    opacity={0.35}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={n.color}
                  opacity={isDimmed ? 0.12 : 1}
                />
                <text
                  x={n.x}
                  y={n.y + n.r + 14}
                  textAnchor="middle"
                  fill={isDimmed ? "rgba(240,237,230,0.15)" : "#c9c5ba"}
                  fontSize="11"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="500"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
