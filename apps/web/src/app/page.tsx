import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Azure AI Practice</h1>
          <nav className="flex gap-4">
            <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-4xl font-bold">
            Master Azure AI Certification
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Practice with realistic timed exams, get instant feedback, and track your progress with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Get Started
            </Link>
            <Link href="/exams" className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Browse Exams
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Azure AI Certification Practice Platform - MVP
        </div>
      </footer>
    </div>
  );
}
