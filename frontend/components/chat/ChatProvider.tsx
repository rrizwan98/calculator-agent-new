'use client'

import { ReactNode } from 'react'

interface ChatProviderProps {
  children: ReactNode
}

export default function ChatProvider({ children }: ChatProviderProps) {
  return <>{children}</>
}
