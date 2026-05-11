import { Button } from "../ui/button";

export default function MarkForReview({
  isMarked,
  onToggle,
}: {
  isMarked: boolean;
  onToggle: () => void;
}) {
  return (
    <Button variant={isMarked ? "secondary" : "outline"} onClick={onToggle}>
      {isMarked ? "Marked for review" : "Mark for review"}
    </Button>
  );
}
