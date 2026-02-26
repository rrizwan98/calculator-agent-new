'use client'

import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-5xl h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🧮 Calculator Agent
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ask me anything in natural language - I'll calculate it for you!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                ● Online
              </span>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>

        {/* Footer */}
        <footer className="py-3 px-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Powered by OpenAI Agents SDK • Built with Next.js & ChatKit
          </p>
        </footer>
      </div>
    </main>
  )
}
