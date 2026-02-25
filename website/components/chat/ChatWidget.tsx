'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X } from 'lucide-react'

declare global {
  interface Window {
    customElements: any
  }
}

interface ChatKitElement extends HTMLElement {
  setOptions: (options: any) => void
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatKitLoaded, setIsChatKitLoaded] = useState(false)
  const chatKitRef = useRef<ChatKitElement | null>(null)

  useEffect(() => {
    // Check if ChatKit is loaded
    const checkChatKit = () => {
      if (typeof window !== 'undefined' && window.customElements?.get('openai-chatkit')) {
        setIsChatKitLoaded(true)
      }
    }

    checkChatKit()

    // Recheck periodically
    const interval = setInterval(checkChatKit, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOpen && isChatKitLoaded && !chatKitRef.current) {
      const chatContainer = document.getElementById('chatkit-container')
      if (chatContainer) {
        // Create ChatKit element
        const chatkit = document.createElement('openai-chatkit') as ChatKitElement
        chatkit.style.width = '100%'
        chatkit.style.height = '100%'

        chatContainer.appendChild(chatkit)
        chatKitRef.current = chatkit

        // Configure ChatKit with custom backend
        setTimeout(() => {
          if (chatkit.setOptions) {
            chatkit.setOptions({
              api: {
                url: process.env.NEXT_PUBLIC_CHATKIT_API_URL || 'http://localhost:8000/chatkit',
                domainKey: '', // Not needed for custom backend
              },
            })
          }
        }, 100)
      }
    }

    // Cleanup when closing
    if (!isOpen && chatKitRef.current) {
      const chatContainer = document.getElementById('chatkit-container')
      if (chatContainer) {
        chatContainer.innerHTML = ''
      }
      chatKitRef.current = null
    }
  }, [isOpen, isChatKitLoaded])

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200">
          {!isChatKitLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading ChatKit...</p>
              </div>
            </div>
          )}
          <div id="chatkit-container" className="w-full h-full"></div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
        {/* Pulse animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></span>
        )}
      </button>
    </>
  )
}
