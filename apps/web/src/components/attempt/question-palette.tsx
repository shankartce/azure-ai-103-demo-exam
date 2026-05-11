import { cn } from "../../lib/cn";

export type PaletteItem = {
  id: string;
  index: number;
  isCurrent: boolean;
  hasAnswer: boolean;
  isMarked: boolean;
};

export default function QuestionPalette({
  items,
  onSelect,
}: {
  items: PaletteItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            "h-10 rounded-xl border text-sm font-semibold transition",
            item.isCurrent && "ring-2 ring-[var(--accent)]",
            item.hasAnswer
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-strong)]",
            item.isMarked && "border-2 border-[var(--accent-strong)]"
          )}
          onClick={() => onSelect(item.id)}
        >
          {item.index}
        </button>
      ))}
    </div>
  );
}
