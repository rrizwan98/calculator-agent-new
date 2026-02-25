'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatKitLoaded, setIsChatKitLoaded] = useState(false)

  useEffect(() => {
    // Check if ChatKit is loaded
    const checkChatKit = () => {
      if (typeof window !== 'undefined' && window.customElements?.get('openai-chatkit')) {
        setIsChatKitLoaded(true)
      }
    }

    checkChatKit()

    // Recheck after a delay if not loaded
    const timer = setTimeout(checkChatKit, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen && isChatKitLoaded) {
      const chatContainer = document.getElementById('chatkit-container')
      if (chatContainer && !chatContainer.querySelector('openai-chatkit')) {
        const chatkit = document.createElement('openai-chatkit')
        chatkit.setAttribute('backend-url', process.env.NEXT_PUBLIC_CHATKIT_API_URL || 'http://localhost:8000/chatkit')
        chatkit.style.width = '100%'
        chatkit.style.height = '100%'
        chatContainer.appendChild(chatkit)
      }
    }
  }, [isOpen, isChatKitLoaded])

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
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
