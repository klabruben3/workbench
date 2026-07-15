import type { ProjectStatus } from "@/types";
import { STATUS_CFG } from "@/lib/constants";

export function StatusPill({ status }: { status: ProjectStatus }) {
  const { color, label, Icon } = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide uppercase"
      style={{
        background: color + "1a",
        color,
        border: `1px solid ${color}25`,
      }}
    >
      <Icon size={9} strokeWidth={2.5} />
      {label}
    </span>
  );
}
