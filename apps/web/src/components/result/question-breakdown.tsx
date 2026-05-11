import { Card, CardContent } from "../ui/card";

export type BreakdownItem = {
  questionId: string;
  prompt?: string;
  isCorrect: boolean;
  selectedOptionId: string | null;
  correctOptionId: string;
  topics: string[];
};

export default function QuestionBreakdown({ item }: { item: BreakdownItem }) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">{item.prompt ?? item.questionId}</p>
          <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>
            {item.isCorrect ? "Correct" : "Needs review"}
          </span>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Topics</p>
        <div className="flex flex-wrap gap-2">
          {item.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs"
            >
              {topic}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
