"use client";
import { useState } from "react";
import { ENTRIES } from "@/data/entries";
import { relativeTime, groupByDate } from "@/lib/helpers";

export function NotebookModule() {
  const [composing, setComposing] = useState(false);
  const groups = groupByDate(ENTRIES);

  return (
    <div className="px-8 pt-12 pb-16 max-w-[720px] mx-auto">
      {!composing ? (
        <div
          className="mb-8 p-5 rounded-[10px] border border-border cursor-text hover:border-[rgba(240,237,230,0.18)] transition-colors"
          style={{ background: "#131310" }}
          onClick={() => setComposing(true)}
        >
          <span
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: "18px",
              color: "#7a7a6a",
            }}
          >
            Jot something down...
          </span>
        </div>
      ) : (
        <div
          className="mb-8 rounded-[10px] border p-5 transition-colors"
          style={{ background: "#131310", borderColor: "rgba(233,180,76,0.4)" }}
        >
          <input
            placeholder="Title (optional)"
            className="w-full bg-transparent text-foreground text-[15px] font-semibold outline-none placeholder:text-muted-foreground mb-3"
          />
          <textarea
            autoFocus
            placeholder="Start writing..."
            className="w-full bg-transparent text-foreground text-[14px] leading-[1.6] outline-none placeholder:text-muted-foreground resize-none"
            style={{ minHeight: "120px" }}
          />
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
            <div className="flex gap-3 text-[12px] text-muted-foreground">
              <button className="hover:text-foreground transition-colors">
                Link to…
              </button>
              <span>·</span>
              <button className="hover:text-foreground transition-colors">
                Add tags
              </button>
            </div>
            <div className="flex gap-2">
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {groups.map(({ label, entries }) => (
        <div key={label} className="mb-8">
          <div
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-4 py-2 sticky top-0"
            style={{ background: "#0d0d0b" }}
          >
            {label}
          </div>
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <div
                key={e.id}
                className="p-5 rounded-[10px] border border-border cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-colors group"
                style={{ background: "#131310" }}
              >
                {e.title && (
                  <div className="text-[15px] font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {e.title}
                  </div>
                )}
                <p className="text-[14px] text-muted-foreground leading-[1.6] line-clamp-3">
                  {e.preview}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {(e.linkedProject || e.linkedTech) && (
                    <span
                      className="text-[11px] px-1.5 py-[2px] rounded font-medium"
                      style={{
                        background: "rgba(240,237,230,0.07)",
                        color: "#7a7a6a",
                      }}
                    >
                      {e.linkedProject || e.linkedTech}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">
                    {relativeTime(e.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
