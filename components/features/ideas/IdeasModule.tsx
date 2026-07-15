import { Plus } from "lucide-react";
import type { ContextType } from "@/types";
import { IDEAS } from "@/data/mockData";

import { FloatCard, Mono, IdeaBadge, Bar, AmberBtn } from "@/components/ui";

export function IdeasModule({
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
          Ideas
        </h2>
        <AmberBtn onClick={() => onGuardedAction(() => {})}>
          <Plus size={14} strokeWidth={2.5} /> New Idea
        </AmberBtn>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {IDEAS.map((idea) => (
          <FloatCard
            key={idea.id}
            interactive
            className="break-inside-avoid mb-4 p-5 cursor-pointer"
            onClick={() => onContext("idea", idea.id)}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-[15px] font-semibold text-foreground leading-snug">
                {idea.title}
              </div>
              <IdeaBadge status={idea.status} />
            </div>
            <p
              className="text-[13px] leading-[1.65] mb-4 line-clamp-4"
              style={{ color: "#7a7a6a" }}
            >
              {idea.description}
            </p>
            {idea.nextStep && (
              <div
                className="text-[12px] px-3 py-2.5 rounded-xl mb-4 leading-snug"
                style={{
                  background: "rgba(124,169,130,0.1)",
                  color: "#7ca982",
                  border: "1px solid rgba(124,169,130,0.15)",
                }}
              >
                → {idea.nextStep}
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <Mono
                  className="text-[9px] uppercase tracking-[0.1em] w-[68px]"
                  style={{ color: "#4a4a40" }}
                >
                  Confidence
                </Mono>
                <div className="flex-1">
                  <Bar filled={idea.confidence} total={5} color="#e9b44c" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mono
                  className="text-[9px] uppercase tracking-[0.1em] w-[68px]"
                  style={{ color: "#4a4a40" }}
                >
                  Importance
                </Mono>
                <div className="flex-1">
                  <Bar filled={idea.importance} total={5} color="#7ca982" />
                </div>
              </div>
            </div>
          </FloatCard>
        ))}
      </div>
    </div>
  );
}
