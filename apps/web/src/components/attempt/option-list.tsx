import { cn } from "../../lib/cn";

export type OptionItem = {
  id: string;
  text: string;
  position: number;
};

export default function OptionList({
  options,
  selectedOptionId,
  onSelect,
}: {
  options: OptionItem[];
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const isSelected = option.id === selectedOptionId;
        return (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
              isSelected
                ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--text-strong)] shadow-[var(--shadow)]"
                : "border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-strong)] hover:border-[var(--accent)]"
            )}
          >
            <input
              type="radio"
              name="option"
              className="h-4 w-4 accent-[var(--accent)]"
              checked={isSelected}
              onChange={() => onSelect(option.id)}
            />
            <span className="font-medium">{option.text}</span>
          </label>
        );
      })}
    </div>
  );
}
