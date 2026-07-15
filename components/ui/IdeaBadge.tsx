export function IdeaBadge({
  status,
}: {
  status: "active" | "promoted" | "archived";
}) {
  const cfg = {
    active: { color: "#7ca982", label: "Active" },
    promoted: { color: "#e9b44c", label: "Promoted" },
    archived: { color: "#7a7a6a", label: "Archived" },
  };
  const { color, label } = cfg[status];
  return (
    <span
      className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-lg shrink-0"
      style={{
        background: color + "1a",
        color,
        border: `1px solid ${color}25`,
      }}
    >
      {label}
    </span>
  );
}
