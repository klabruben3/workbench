export function IdeaBadge({ status }: { status: "active" | "promoted" | "archived" }) {
  const cfg = {
    active: { color: "#7ca982", label: "Active" },
    promoted: { color: "#e9b44c", label: "Promoted" },
    archived: { color: "#7a7a6a", label: "Archived" },
  };
  const { color, label } = cfg[status];
  return (
    <span
      className="text-[11px] font-medium tracking-wide uppercase px-2 py-[3px] rounded shrink-0"
      style={{ background: color + "26", color }}
    >
      {label}
    </span>
  );
}
