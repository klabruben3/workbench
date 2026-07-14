import { STATUS_CFG } from "@/config/status";
import type { ProjectStatus } from "@/types";

export function StatusPill({ status }: { status: ProjectStatus }) {
  const { color, label, Icon } = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded text-[11px] font-medium tracking-wide uppercase"
      style={{ background: color + "26", color }}
    >
      <Icon size={9} strokeWidth={2.5} />
      {label}
    </span>
  );
}
