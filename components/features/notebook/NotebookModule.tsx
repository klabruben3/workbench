import { useState } from "react";
import type { ContextType } from "@/types";
import { ENTRIES } from "@/data/mockData";
import { groupByDate, relativeTime } from "@/lib/helpers";

import { FloatCard, Mono, InlineTag, AmberBtn } from "@/components/ui";

export function NotebookModule({
  onContext,
  onGuardedAction,
}: {
  onContext: (type: ContextType, id: string) => void;
  onGuardedAction: (action: () => void) => void;
}) {
  const [composing, setComposing] = useState(false);
  const groups = groupByDate(ENTRIES);

  return (
    <div className="p-5 md:p-8 pb-16 max-w-[760px] mx-auto">
      {!composing ? (
        <FloatCard
          interactive
          className="mb-8 p-5 cursor-text"
          onClick={() => onGuardedAction(() => setComposing(true))}
        >
          <span
            style={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: "18px",
              color: "#4a4a40",
              fontStyle: "italic",
            }}
          >
            Jot something down…
          </span>
        </FloatCard>
      ) : (
        <FloatCard
          className="mb-8 p-6"
          style={{ borderColor: "rgba(233,180,76,0.3)" }}
        >
          <input
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[16px] font-semibold outline-none mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          />
          <textarea
            autoFocus
            placeholder="Start writing…"
            className="w-full bg-transparent text-foreground text-[14px] leading-[1.7] outline-none resize-none"
            style={{ minHeight: "120px" }}
          />
          <div
            className="flex items-center justify-between pt-3.5 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="flex gap-4 text-[12px]"
              style={{ color: "#7a7a6a" }}
            >
              <button className="hover:text-foreground transition-colors">
                Link to…
              </button>
              <span style={{ opacity: 0.4 }}>·</span>
              <button className="hover:text-foreground transition-colors">
                Add tags
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setComposing(false)}
                className="text-[12px] px-3 h-7 rounded-lg transition-colors"
                style={{ color: "#7a7a6a" }}
              >
                Cancel
              </button>
              <AmberBtn className="text-[12px] px-3 h-7">Save</AmberBtn>
            </div>
          </div>
        </FloatCard>
      )}

      {groups.map(({ label, entries }) => (
        <div key={label} className="mb-8">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-4 py-2 sticky top-0"
            style={{
              background: "#0a0907",
              color: "#4a4a40",
              fontFamily: "'JetBrains Mono', monospace",
              zIndex: 2,
            }}
          >
            {label}
          </div>
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <FloatCard
                key={e.id}
                interactive
                className="p-5 cursor-pointer group"
                onClick={() => onContext("notebook", e.id)}
              >
                {e.title && (
                  <div
                    className="text-[15px] font-semibold text-foreground mb-2 group-hover:text-foreground/80 transition-colors"
                    style={{ fontFamily: '"DM Serif Display", serif' }}
                  >
                    {e.title}
                  </div>
                )}
                <p
                  className="text-[13px] leading-[1.7] line-clamp-3"
                  style={{ color: "#7a7a6a" }}
                >
                  {e.preview}
                </p>
                <div className="flex items-center gap-2 mt-3.5">
                  {(e.linkedProject || e.linkedTech) && (
                    <InlineTag>{e.linkedProject || e.linkedTech}</InlineTag>
                  )}
                  <Mono
                    className="text-[10px] ml-auto"
                    style={{ color: "#4a4a40" }}
                  >
                    {relativeTime(e.createdAt)}
                  </Mono>
                </div>
              </FloatCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
