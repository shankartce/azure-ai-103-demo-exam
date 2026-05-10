import Link from "next/link";

// Mock data - will be replaced with API calls
const mockExams = [
  {
    id: "1",
    title: "Azure AI-102: Designing and Implementing an Azure AI Solution",
    description: "Practice exam for the Azure AI Engineer Associate certification",
    questionCount: 50,
    durationMinutes: 120,
  },
];

export default function ExamsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Azure AI Practice
          </Link>
          <nav className="flex gap-4">
            <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice Exams</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose an exam to start your practice session
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockExams.map((exam) => (
            <Link
              key={exam.id}
              href={`/exams/${exam.id}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {exam.description}
              </p>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-500">
                <span>{exam.questionCount} questions</span>
                <span>•</span>
                <span>{exam.durationMinutes} minutes</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
