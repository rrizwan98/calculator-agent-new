'use client'

import { Message } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-blue-600 text-white ml-12'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-12'
        }`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Calculator Agent
            </span>
          </div>
        )}

        {/* Message Content */}
        <div className="text-sm whitespace-pre-wrap">
          {message.content.split('**').map((part, index) =>
            index % 2 === 0 ? (
              <span key={index}>{part}</span>
            ) : (
              <strong key={index} className="font-bold">{part}</strong>
            )
          )}
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
