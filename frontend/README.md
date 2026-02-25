# Calculator Agent - Frontend

Beautiful Next.js frontend with ChatKit-inspired UI for the Calculator Agent backend.

## Features

✨ **Modern Chat Interface**
- Real-time chat UI with message bubbles
- Natural language input
- Example prompt suggestions
- Auto-scroll to latest messages

🎨 **Beautiful Design**
- Tailwind CSS styling
- Dark mode support
- Responsive design (mobile-friendly)
- Smooth animations and transitions

🔗 **Backend Integration**
- Connects to FastAPI backend
- Real-time calculation results
- Calculation history with session management
- Backend health monitoring

📊 **Calculation Display**
- Color-coded operation cards
- Visual result breakdown
- Operation symbols (×, ÷, +, -)
- Success indicators

## Quick Start

### Prerequisites

1. **Backend must be running** at `http://localhost:8000`
   ```bash
   # In the backend directory
   python main.py
   ```

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local if your backend is on a different URL
   ```

3. **Run development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Example Queries

Try these natural language queries:

- "Can you add 2 + 25?"
- "What is 100 minus 45?"
- "Multiply 7 by 8"
- "Divide 150 by 3"
- "Add 50 and 30"
- "What's 200 divided by 4?"

### Chat Features

- **Send Message**: Type your query and press Enter (or click Send)
- **New Line**: Press Shift + Enter for multi-line input
- **Clear Chat**: Click the trash icon to start fresh
- **Example Prompts**: Click any example to auto-fill input
- **Session Persistence**: Your conversation history is saved locally

## Architecture

```
frontend/
├── app/
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main chat page
│   └── globals.css        # Global styles + ChatKit custom CSS
├── components/
│   ├── ChatInterface.tsx  # Main chat container with state
│   ├── MessageBubble.tsx  # Individual message display
│   ├── ChatInput.tsx      # Input field with controls
│   └── CalculationCard.tsx # Calculation result display
├── lib/
│   ├── api.ts            # Backend API client (axios)
│   └── types.ts          # TypeScript interfaces
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS config
└── tsconfig.json         # TypeScript config
```

## API Integration

The frontend connects to the FastAPI backend:

### POST /calculate
```typescript
const response = await calculate("add 2 + 25", sessionId)
// Returns: { result: { operation: "+", operand1: 2, operand2: 25, result: 27 } }
```

### GET /history/{session_id}
```typescript
const history = await getHistory(sessionId, 10)
// Returns: { session_id: "...", history: [...] }
```

### GET /health
```typescript
const isOnline = await checkHealth()
// Returns: boolean
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional: Default session ID
NEXT_PUBLIC_DEFAULT_SESSION_ID=default
```

### Customization

**Colors** - Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#10a37f',  // Change primary color
      secondary: '#1a1a1a', // Change secondary color
    },
  },
}
```

**Backend URL** - Change in `.env.local` or `lib/api.ts`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_BACKEND_URL`
4. Deploy!

### Docker

```bash
# Build image
docker build -t calculator-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://backend:8000 \
  calculator-frontend
```

### Static Export

```bash
# Build static site
npm run build

# Files in /out directory
# Deploy to any static host (Netlify, Cloudflare Pages, etc.)
```

## Troubleshooting

### Backend Offline Error

**Problem**: Red banner shows "Backend is offline"

**Solution**:
1. Make sure FastAPI backend is running: `python main.py`
2. Check backend URL in `.env.local`
3. Verify backend is accessible at `http://localhost:8000/health`

### CORS Errors

**Problem**: Browser blocks API requests

**Solution**: Add CORS middleware to FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Slow Response Times

**Problem**: Calculations take too long

**Solution**:
- Check backend logs for errors
- Verify OpenAI API key is valid
- Check internet connection
- Increase timeout in `lib/api.ts`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Session Storage**: localStorage + UUID

## Contributing

Feel free to customize and extend:
- Add more calculation visualizations
- Implement voice input
- Add calculation history export
- Create mobile app version
- Add unit tests

---

**Built with ❤️ using Next.js & OpenAI Agents SDK**
