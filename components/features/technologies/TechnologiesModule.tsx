import { Plus } from "lucide-react";
import type { ContextType } from "@/types";
import { TECHNOLOGIES } from "@/data/mockData";
import { MASTERY_LABEL } from "@/lib/constants";

import { FloatCard, Mono, Bar, GhostBtn } from "@/components/ui";

export function TechnologiesModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  return (
    <div className="p-5 md:p-7 lg:p-8 pb-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[28px] text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Technologies
        </h2>
        <GhostBtn onClick={() => onGuardedAction(() => {})}>
          <Plus size={13} /> Add Technology
        </GhostBtn>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TECHNOLOGIES.map((t) => (
          <FloatCard
            key={t.id}
            interactive
            className="p-5 cursor-pointer"
            onClick={() => onContext("tech", t.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-[16px] font-semibold text-foreground">
                {t.name}
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  color:
                    t.mastery >= 3
                      ? "#e9b44c"
                      : t.mastery === 2
                        ? "#c9c5ba"
                        : "#7a7a6a",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {MASTERY_LABEL[t.mastery]}
              </span>
            </div>
            <div className="mb-4">
              <Bar filled={t.mastery} total={4} color="#e9b44c" />
            </div>
            <div className="flex gap-3">
              <Mono className="text-[11px]" style={{ color: "#7a7a6a" }}>
                {t.projectCount} {t.projectCount !== 1 ? "projects" : "project"}
              </Mono>
              <span style={{ color: "#4a4a40", opacity: 0.5 }}>·</span>
              <Mono className="text-[11px]" style={{ color: "#7a7a6a" }}>
                {t.entryCount} entries
              </Mono>
            </div>
          </FloatCard>
        ))}
      </div>
    </div>
  );
}
