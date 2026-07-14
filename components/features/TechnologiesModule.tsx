import { Plus } from "lucide-react";
import { TECHNOLOGIES } from "@/data/technologies";
import { MASTERY_LABEL } from "@/config/status";
import { Bar } from "../ui";

export function TechnologiesModule() {
  return (
    <div className="px-8 pt-12 pb-16 max-w-[1120px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-foreground">
          Technologies
        </h2>
        <button className="flex items-center gap-1.5 px-4 h-9 rounded-[6px] text-[14px] font-medium border border-border text-foreground hover:border-[rgba(240,237,230,0.18)] transition-colors">
          <Plus size={15} /> Add Technology
        </button>
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {TECHNOLOGIES.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-[10px] border border-border cursor-pointer hover:border-[rgba(240,237,230,0.18)] transition-colors"
            style={{ background: "#131310" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-[15px] font-semibold text-foreground">
                {t.name}
              </div>
              <span
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{
                  color:
                    t.mastery >= 3
                      ? "#e9b44c"
                      : t.mastery === 2
                        ? "#c9c5ba"
                        : "#7a7a6a",
                }}
              >
                {MASTERY_LABEL[t.mastery]}
              </span>
            </div>
            <div className="mb-4">
              <Bar filled={t.mastery} total={4} color="#e9b44c" />
            </div>
            <div className="flex gap-3 text-[12px] text-muted-foreground">
              <span>
                {t.projectCount} project{t.projectCount !== 1 ? "s" : ""}
              </span>
              <span className="opacity-40">·</span>
              <span>{t.entryCount} entries</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
