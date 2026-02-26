export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  calculation?: {
    operation: string
    operand1: number
    operand2: number
    result: number
    expression?: string
  }
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sessionId: string
}
