"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { THOUGHTS } from "@/data/thoughts";
import { relativeTime } from "@/lib/helpers";

export function ThoughtsModule() {
  const [composing, setComposing] = useState(false);

  return (
    <div className="px-8 pt-12 pb-16 max-w-[720px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-foreground">Thoughts</h2>
        <button
          onClick={() => setComposing(!composing)}
          className="flex items-center gap-1.5 px-4 h-9 rounded-[6px] text-[14px] font-semibold"
          style={{ background: "#e9b44c", color: "#0d0d0b" }}
        >
          <Plus size={15} strokeWidth={2.5} /> New Thought
        </button>
      </div>

      {composing && (
        <div
          className="mb-5 rounded-[10px] border p-5"
          style={{
            background: "#131310",
            borderColor: "rgba(124,169,130,0.4)",
          }}
        >
          <input
            autoFocus
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[15px] font-semibold outline-none placeholder:text-muted-foreground mb-3"
          />
          <textarea
            placeholder="A reflection, a pattern you've noticed, a belief worth examining..."
            className="w-full bg-transparent text-[14px] text-foreground leading-[1.6] outline-none placeholder:text-muted-foreground resize-none"
            style={{ minHeight: "100px" }}
          />
          <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-border">
            <button
              onClick={() => setComposing(false)}
              className="text-[13px] text-muted-foreground hover:text-foreground px-3 h-7 transition-colors"
            >
              Cancel
            </button>
            <button
              className="text-[13px] font-semibold px-3 h-7 rounded-[6px]"
              style={{ background: "#e9b44c", color: "#0d0d0b" }}
            >
              Save Thought
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {THOUGHTS.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-[10px] border border-border cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-colors"
            style={{
              background: "#131310",
              borderLeftWidth: "2px",
              borderLeftColor: "#7ca982",
            }}
          >
            {t.title && (
              <div className="text-[15px] font-semibold text-foreground mb-2">
                {t.title}
              </div>
            )}
            <p className="text-[14px] text-muted-foreground leading-[1.6]">
              {t.preview}
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {t.related.map((r) => (
                <span
                  key={r}
                  className="text-[11px] px-1.5 py-[2px] rounded font-medium"
                  style={{
                    background: "rgba(240,237,230,0.07)",
                    color: "#7a7a6a",
                  }}
                >
                  {r}
                </span>
              ))}
              <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">
                {relativeTime(t.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
