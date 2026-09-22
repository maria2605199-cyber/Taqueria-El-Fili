export function BarList({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  if (items.length === 0) {
    return <p className="text-sm text-foreground/50">Sin datos todavía.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="truncate pr-2">{item.label}</span>
            <span className="font-medium text-foreground/60">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full gradient-bg"
              style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
