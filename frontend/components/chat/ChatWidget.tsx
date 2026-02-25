'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  // ChatKit hook configuration
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        // For now, we'll use the direct backend URL
        // In production, you'd fetch a client secret from your backend
        return ''  // ChatKit will handle direct API calls
      },
    },
    // Configure to use your FastAPI backend
    config: {
      backend_url: process.env.NEXT_PUBLIC_CHATKIT_API_URL || 'http://localhost:8000/chatkit',
    },
  })

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-secondary-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Calculator Agent</h3>
                <p className="text-primary-100 text-xs">AI-powered calculator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ChatKit Component */}
          <div className="flex-1 overflow-hidden">
            <ChatKit
              control={control}
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
        {/* Pulse animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-20"></span>
        )}
      </button>
    </>
  )
}
