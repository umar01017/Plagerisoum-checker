import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-center px-4">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Meet <span className="text-blue-600 dark:text-blue-400">OriginalityAI</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          The most advanced AI rewriter. Make your text 100% unique, bypass AI detectors, and enhance readability in seconds.
        </p>
        <div className="flex justify-center gap-4 pt-8">
          <Link href="/register" className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Get Started Free
          </Link>
          <Link href="/login" className="px-8 py-4 text-lg font-semibold text-blue-600 bg-white dark:bg-gray-800 dark:text-blue-400 dark:border-gray-700 border border-transparent rounded-full hover:border-blue-200 transition-colors shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
