'use client'

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { calculate, checkHealth } from '@/lib/api'
import { Message, ChatState } from '@/lib/types'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import CalculationCard from './CalculationCard'

export default function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    sessionId: typeof window !== 'undefined'
      ? localStorage.getItem('sessionId') || uuidv4()
      : uuidv4(),
  })

  const [isBackendOnline, setIsBackendOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Save session ID to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionId', chatState.sessionId)
    }
  }, [chatState.sessionId])

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isOnline = await checkHealth()
      setIsBackendOnline(isOnline)
    }
    checkBackend()
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatState.messages])

  // Add welcome message
  useEffect(() => {
    if (chatState.messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "👋 Hi! I'm your Calculator Agent. Ask me anything like:\n\n• \"Can you add 2 + 25?\"\n• \"What is 100 minus 45?\"\n• \"Multiply 7 by 8\"\n• \"Divide 150 by 3\"\n\nTry me out!",
        timestamp: new Date(),
      }
      setChatState(prev => ({
        ...prev,
        messages: [welcomeMessage],
      }))
    }
  }, [])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || chatState.isLoading) return

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      // Call backend API
      const response = await calculate(content, chatState.sessionId)

      // Format assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `The result is **${response.result.result}**`,
        timestamp: new Date(),
        calculation: response.result,
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }))

    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `❌ Sorry, I couldn't process that. ${error instanceof Error ? error.message : 'Please try again.'}`,
        timestamp: new Date(),
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  }

  const handleClearChat = () => {
    const newSessionId = uuidv4()
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
      sessionId: newSessionId,
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionId', newSessionId)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Backend Status Banner */}
      {!isBackendOnline && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-2">
          <p className="text-sm text-red-800 dark:text-red-200 text-center">
            ⚠️ Backend is offline. Please start the FastAPI server at http://localhost:8000
          </p>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {message.calculation && (
              <div className="mt-2 ml-12">
                <CalculationCard calculation={message.calculation} />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {chatState.isLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm">Calculating...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={chatState.isLoading}
          isBackendOnline={isBackendOnline}
          onClearChat={handleClearChat}
        />
      </div>
    </div>
  )
}
