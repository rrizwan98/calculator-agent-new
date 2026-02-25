import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export interface CalculationResult {
  operation: string
  operand1: number
  operand2: number
  result: number
  expression?: string
}

export interface CalculateRequest {
  message: string
  session_id: string
}

export interface CalculateResponse {
  result: CalculationResult
}

export interface HistoryItem {
  role: string
  content: string
  timestamp?: string
}

export interface HistoryResponse {
  session_id: string
  history: HistoryItem[]
}

/**
 * Send a calculation request to the backend
 */
export async function calculate(message: string, sessionId: string): Promise<CalculateResponse> {
  try {
    const response = await axios.post<CalculateResponse>(
      `${BACKEND_URL}/calculate`,
      {
        message,
        session_id: sessionId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ||
        error.message ||
        'Failed to calculate'
      )
    }
    throw error
  }
}

/**
 * Get calculation history for a session
 */
export async function getHistory(sessionId: string, limit: number = 10): Promise<HistoryResponse> {
  try {
    const response = await axios.get<HistoryResponse>(
      `${BACKEND_URL}/history/${sessionId}`,
      {
        params: { limit },
        timeout: 10000,
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ||
        error.message ||
        'Failed to fetch history'
      )
    }
    throw error
  }
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 5000,
    })
    return response.data?.status === 'healthy'
  } catch {
    return false
  }
}
