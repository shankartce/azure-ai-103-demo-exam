import Link from "next/link";

// Mock data - will be replaced with API calls
const mockExam = {
  id: "1",
  title: "Azure AI-102: Designing and Implementing an Azure AI Solution",
  description: "Practice exam for the Azure AI Engineer Associate certification. This exam covers key topics including computer vision, natural language processing, knowledge mining, and conversational AI.",
  questionCount: 50,
  durationMinutes: 120,
};

export default function ExamDetailPage({ params }: { params: { examId: string } }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Azure AI Practice
          </Link>
          <nav className="flex gap-4">
            <Link href="/exams" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              All Exams
            </Link>
            <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <Link href="/exams" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to exams
          </Link>
          <h1 className="text-3xl font-bold mb-4">{mockExam.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {mockExam.description}
          </p>
        </div>

        <div className="border rounded-lg p-6 mb-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Questions</span>
              <span className="font-medium">{mockExam.questionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Duration</span>
              <span className="font-medium">{mockExam.durationMinutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Format</span>
              <span className="font-medium">Multiple choice</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-2">Before you start</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• Your answers will be automatically saved</li>
            <li>• You can navigate between questions freely</li>
            <li>• The exam will auto-submit when time expires</li>
            <li>• You'll see your results immediately after submission</li>
          </ul>
        </div>

        <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg">
          Start Exam
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-4">
          Sign in to start the exam and track your progress
        </p>
      </main>
    </div>
  );
}
