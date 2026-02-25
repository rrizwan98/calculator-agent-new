'use client'

import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  isBackendOnline: boolean
  onClearChat: () => void
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  isBackendOnline,
  onClearChat,
}: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const examplePrompts = [
    'Add 25 + 17',
    'What is 100 - 45?',
    'Multiply 8 by 9',
    'Divide 200 by 4',
  ]

  return (
    <div className="space-y-3">
      {/* Example Prompts */}
      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => setInput(prompt)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isBackendOnline
                ? 'Ask me a calculation... (e.g., "add 2 + 25")'
                : 'Backend offline - please start the server'
            }
            disabled={isLoading || !isBackendOnline}
            rows={1}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || !isBackendOnline}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <span>Send</span>
            </>
          )}
        </button>

        {/* Clear Button */}
        <button
          onClick={onClearChat}
          disabled={isLoading}
          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Shift + Enter</kbd> for new line
      </p>
    </div>
  )
}
