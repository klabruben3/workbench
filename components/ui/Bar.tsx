export function Bar({
  filled,
  total,
  color,
}: {
  filled: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-[5px] flex-1 rounded-[2px]"
          style={{ background: i < filled ? color : "rgba(240,237,230,0.1)" }}
        />
      ))}
    </div>
  );
}
