import { useState } from "react";
import type { ContextType } from "@/types";
import { Mono } from "@/components/ui";

const NODES = [
  {
    id: "aperture",
    x: 340,
    y: 200,
    label: "Aperture",
    color: "#e9b44c",
    r: 22,
    type: "project",
    dataId: "1",
  },
  {
    id: "devfolio",
    x: 590,
    y: 130,
    label: "Devfolio",
    color: "#e9b44c",
    r: 16,
    type: "project",
    dataId: "2",
  },
  {
    id: "zephyr",
    x: 170,
    y: 330,
    label: "Zephyr",
    color: "#e9b44c",
    r: 16,
    type: "project",
    dataId: "3",
  },
  {
    id: "tessera",
    x: 480,
    y: 355,
    label: "Tessera",
    color: "#e9b44c",
    r: 14,
    type: "project",
    dataId: "4",
  },
  {
    id: "typescript",
    x: 460,
    y: 245,
    label: "TypeScript",
    color: "#7ca982",
    r: 20,
    type: "tech",
    dataId: "1",
  },
  {
    id: "rust",
    x: 220,
    y: 450,
    label: "Rust",
    color: "#7ca982",
    r: 15,
    type: "tech",
    dataId: "5",
  },
  {
    id: "react",
    x: 580,
    y: 310,
    label: "React",
    color: "#7ca982",
    r: 18,
    type: "tech",
    dataId: "2",
  },
  {
    id: "supabase",
    x: 400,
    y: 110,
    label: "Supabase",
    color: "#7ca982",
    r: 14,
    type: "tech",
    dataId: "7",
  },
  {
    id: "webrtc",
    x: 580,
    y: 430,
    label: "WebRTC",
    color: "#7ca982",
    r: 12,
    type: "tech",
    dataId: "8",
  },
  {
    id: "idea1",
    x: 700,
    y: 220,
    label: "Semantic search",
    color: "#9180aa",
    r: 12,
    type: "idea",
    dataId: "1",
  },
  {
    id: "idea2",
    x: 100,
    y: 215,
    label: "TUI kanban",
    color: "#9180aa",
    r: 12,
    type: "idea",
    dataId: "3",
  },
  {
    id: "thought1",
    x: 700,
    y: 385,
    label: "On Rust",
    color: "#5a5a4a",
    r: 10,
    type: "thought",
    dataId: "1",
  },
];

const EDGES = [
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

const TYPE_TO_CONTEXT: Record<string, ContextType> = {
  project: "project",
  tech: "tech",
  idea: "idea",
  thought: "thought",
};

export function GraphModule({
  onContext,
}: {
  onContext: (type: ContextType, id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const connected = (id: string) =>
    EDGES.filter(([a, b]) => a === id || b === id).flatMap(([a, b]) => [a, b]);

  return (
    <div className="flex flex-col h-full">
      <div
        className="px-7 pt-7 pb-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <h2
            className="text-[28px] text-foreground"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Knowledge Graph
          </h2>
          <p className="text-[12px] mt-1" style={{ color: "#7a7a6a" }}>
            Your engineering life as a graph. Click nodes to open a
            conversation.
          </p>
        </div>
        <div className="flex items-center gap-5">
          {(
            [
              ["#e9b44c", "Projects"],
              ["#7ca982", "Technologies"],
              ["#9180aa", "Ideas"],
              ["#5a5a4a", "Thoughts"],
            ] as const
          ).map(([color, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: color }}
              />
              <Mono className="text-[11px]" style={{ color: "#7a7a6a" }}>
                {label}
              </Mono>
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
            <radialGradient id="gbg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0f0d09" />
              <stop offset="100%" stopColor="#080705" />
            </radialGradient>
            {NODES.map((n) => (
              <radialGradient
                key={`glow-${n.id}`}
                id={`glow-${n.id}`}
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor={n.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          <rect width="800" height="540" fill="url(#gbg)" />
          {EDGES.map(([a, b], i) => {
            const na = NODES.find((n) => n.id === a)!;
            const nb = NODES.find((n) => n.id === b)!;
            const isLit = hovered && (hovered === a || hovered === b);
            return (
              <line
                key={i}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={
                  isLit ? "rgba(240,237,230,0.22)" : "rgba(240,237,230,0.05)"
                }
                strokeWidth={isLit ? 1.5 : 1}
                style={{ transition: "stroke 0.2s ease" }}
              />
            );
          })}
          {NODES.map((n) => {
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
                onClick={() =>
                  onContext(TYPE_TO_CONTEXT[n.type] as ContextType, n.dataId)
                }
              >
                {isHov && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r * 2.8}
                    fill={`url(#glow-${n.id})`}
                  />
                )}
                {isHov && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r + 7}
                    fill="none"
                    stroke={n.color}
                    strokeWidth={1}
                    opacity={0.3}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={n.color}
                  opacity={isDimmed ? 0.1 : 1}
                  style={{ transition: "opacity 0.2s ease" }}
                />
                <text
                  x={n.x}
                  y={n.y + n.r + 15}
                  textAnchor="middle"
                  fill={isDimmed ? "rgba(240,237,230,0.12)" : "#9a9a88"}
                  fontSize="10.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                  style={{ transition: "fill 0.2s ease" }}
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
