'use client'

interface CalculationCardProps {
  calculation: {
    operation: string
    operand1: number
    operand2: number
    result: number
    expression?: string
  }
}

export default function CalculationCard({ calculation }: CalculationCardProps) {
  const getOperationSymbol = (op: string): string => {
    const symbols: Record<string, string> = {
      '+': '+',
      '-': '-',
      '*': '×',
      '/': '÷',
    }
    return symbols[op] || op
  }

  const getOperationColor = (op: string): string => {
    const colors: Record<string, string> = {
      '+': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      '-': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      '*': 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      '/': 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    }
    return colors[op] || 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
  }

  return (
    <div
      className={`inline-block rounded-lg border p-4 ${getOperationColor(calculation.operation)}`}
    >
      <div className="flex items-center gap-4">
        {/* Operands and Operation */}
        <div className="flex items-center gap-2 text-lg font-mono">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {calculation.operand1}
          </span>
          <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {getOperationSymbol(calculation.operation)}
          </span>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {calculation.operand2}
          </span>
          <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">=</span>
        </div>

        {/* Result */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {calculation.result}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Expression (if available) */}
      {calculation.expression && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Expression: <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">{calculation.expression}</code>
        </div>
      )}
    </div>
  )
}
