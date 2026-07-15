import { useState } from "react";
import { Plus } from "lucide-react";
import type { ContextType } from "@/types";
import { THOUGHTS } from "@/data/mockData";
import { relativeTime } from "@/lib/helpers";

import { FloatCard, Mono, InlineTag, AmberBtn } from "@/components/ui";

export function ThoughtsModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  const [composing, setComposing] = useState(false);

  return (
    <div className="p-5 md:p-8 pb-16 max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[28px] text-foreground"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Thoughts
        </h2>
        <AmberBtn onClick={() => onGuardedAction(() => setComposing(true))}>
          <Plus size={14} strokeWidth={2.5} /> New Thought
        </AmberBtn>
      </div>
      {composing && (
        <FloatCard
          className="mb-5 p-6"
          style={{ borderColor: "rgba(124,169,130,0.3)" }}
        >
          <input
            autoFocus
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[16px] font-semibold outline-none mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          />
          <textarea
            placeholder="A reflection, a pattern you've noticed, a belief worth examining…"
            className="w-full bg-transparent text-[13px] text-foreground leading-[1.7] outline-none resize-none"
            style={{ minHeight: "100px" }}
          />
          <div
            className="flex items-center justify-end gap-2 pt-3.5 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={() => setComposing(false)}
              className="text-[12px] px-3 h-7 transition-colors"
              style={{ color: "#7a7a6a" }}
            >
              Cancel
            </button>
            <AmberBtn className="text-[12px] px-3 h-7">Save Thought</AmberBtn>
          </div>
        </FloatCard>
      )}
      <div className="flex flex-col gap-4">
        {THOUGHTS.map((t) => (
          <FloatCard
            key={t.id}
            interactive
            className="p-5 cursor-pointer"
            style={{
              borderLeftWidth: "2px",
              borderLeftColor: "rgba(124,169,130,0.45)",
            }}
            onClick={() => onContext("thought", t.id)}
          >
            {t.title && (
              <div
                className="text-[15px] font-semibold text-foreground mb-2"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                {t.title}
              </div>
            )}
            <p
              className="text-[13px] leading-[1.7]"
              style={{ color: "#7a7a6a" }}
            >
              {t.preview}
            </p>
            <div className="flex items-center gap-2 mt-3.5 flex-wrap">
              {t.related.map((r) => (
                <InlineTag key={r}>{r}</InlineTag>
              ))}
              <Mono
                className="text-[10px] ml-auto"
                style={{ color: "#4a4a40" }}
              >
                {relativeTime(t.updatedAt)}
              </Mono>
            </div>
          </FloatCard>
        ))}
      </div>
    </div>
  );
}
