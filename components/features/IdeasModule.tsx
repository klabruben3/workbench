import { Plus } from "lucide-react";
import { IDEAS } from "@/data/ideas";
import { Bar, IdeaBadge } from "../ui";

export function IdeasModule() {
  return (
    <div className="px-8 pt-12 pb-16 max-w-[1120px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-foreground">Ideas</h2>
        <button
          className="flex items-center gap-1.5 px-4 h-9 rounded-[6px] text-[14px] font-semibold"
          style={{ background: "#e9b44c", color: "#0d0d0b" }}
        >
          <Plus size={15} strokeWidth={2.5} /> New Idea
        </button>
      </div>
      <div className="columns-3 gap-4">
        {IDEAS.map((idea) => (
          <div
            key={idea.id}
            className="break-inside-avoid mb-4 rounded-[10px] border border-border p-5 cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-all duration-100"
            style={{ background: "#131310" }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="text-[15px] font-semibold text-foreground leading-snug">
                {idea.title}
              </div>
              <IdeaBadge status={idea.status} />
            </div>
            <p className="text-[13px] text-muted-foreground leading-[1.6] mb-4 line-clamp-4">
              {idea.description}
            </p>
            {idea.nextStep && (
              <div
                className="text-[12px] px-2.5 py-2 rounded-[6px] mb-4 leading-snug"
                style={{
                  background: "rgba(124,169,130,0.1)",
                  color: "#7ca982",
                }}
              >
                → {idea.nextStep}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide w-[72px]">
                  Confidence
                </span>
                <div className="flex-1">
                  <Bar filled={idea.confidence} total={5} color="#e9b44c" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide w-[72px]">
                  Importance
                </span>
                <div className="flex-1">
                  <Bar filled={idea.importance} total={5} color="#7ca982" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
