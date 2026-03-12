'use client'

import { useState } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  // ChatKit configuration
  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        // Direct backend connection without client secret
        return ''
      },
    },
    config: {
      backend_url: process.env.NEXT_PUBLIC_CHATKIT_API_URL || 'http://localhost:8000/chatkit',
    },
  })

  return (
    <>
      {/* Pure ChatKit UI - No custom wrappers */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] z-50">
          <ChatKit control={control} className="h-full w-full rounded-2xl shadow-2xl" />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  )
}
