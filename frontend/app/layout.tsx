import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calculator Agent - AI-Powered Natural Language Calculator',
  description: 'Calculate anything in plain English with our AI-powered calculator agent. No complex formulas needed - just ask and get instant results.',
  keywords: ['calculator', 'AI calculator', 'natural language calculator', 'math AI', 'OpenAI', 'calculator agent'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* ChatKit JS Script */}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
