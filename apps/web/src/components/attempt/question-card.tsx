import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function QuestionCard({
  index,
  prompt,
}: {
  index: number;
  prompt: string;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Question {index}
        </p>
        <CardTitle>{prompt}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--muted)]">
          Select the best answer and mark for review if needed.
        </p>
      </CardContent>
    </Card>
  );
}
