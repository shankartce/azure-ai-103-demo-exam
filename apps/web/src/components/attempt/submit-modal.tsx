import { Button } from "../ui/button";

export default function SubmitModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        <h2 className="text-xl font-semibold">Submit your attempt?</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Make sure you have reviewed all questions. You will see your score right after
          submitting.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Keep reviewing
          </Button>
          <Button onClick={onConfirm}>Confirm submit</Button>
        </div>
      </div>
    </div>
  );
}
