"""
CalculatorAgent - FastAPI Backend with ChatKit Streaming
"""

import os
import json
import asyncio
from typing import AsyncGenerator
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agents import Runner
from agents_config import agent  # Import from agents_config.py instead
from config import get_session
from models import CalculationResult

# Load environment variables
load_dotenv()

# Validate API key
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable not set")

# Create FastAPI app
app = FastAPI(
    title="CalculatorAgent ChatKit Backend",
    description="ChatKit-compatible streaming backend for Calculator Agent",
    version="2.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    result: CalculationResult


async def stream_chatkit_response(message: str, session_id: str) -> AsyncGenerator[str, None]:
    """
    Stream ChatKit-compatible SSE events for agent responses.

    ChatKit expects events in this format:
    data: {"type": "content", "content": "text chunk"}
    data: {"type": "done"}
    """
    try:
        # Get session for memory
        session = get_session(session_id)

        # Run agent
        result = await Runner.run(agent, message, session=session)

        # Get the structured calculation result
        calculation = result.final_output

        # Stream the text response first
        response_text = f"The result is **{calculation.result}**"

        # Send content chunk
        yield f"data: {json.dumps({'type': 'content', 'content': response_text})}\n\n"

        # Small delay for better UX
        await asyncio.sleep(0.1)

        # Send calculation breakdown as a structured message
        calc_breakdown = f"\n\n**Calculation:**\n{calculation.operand1} {calculation.operation} {calculation.operand2} = {calculation.result}"
        yield f"data: {json.dumps({'type': 'content', 'content': calc_breakdown})}\n\n"

        # Send done event
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception as e:
        # Send error message
        error_msg = f"❌ Sorry, I couldn't process that: {str(e)}"
        yield f"data: {json.dumps({'type': 'content', 'content': error_msg})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"


@app.get("/")
async def root():
    """Service information endpoint."""
    return {
        "service": "CalculatorAgent ChatKit Backend",
        "version": "2.0.0",
        "agent": "Calculator Agent",
        "endpoints": {
            "health": "/health",
            "chatkit": "/chatkit (POST)",
            "calculate": "/calculate (POST - legacy)",
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "CalculatorAgent ChatKit"}


@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    """
    ChatKit-compatible streaming endpoint.

    Accepts JSON: {"message": "user message", "session_id": "optional-session-id"}
    Returns: Server-Sent Events (SSE) stream
    """
    try:
        # Parse request body
        body = await request.json()
        message = body.get("message", "")
        session_id = body.get("session_id", "default")

        if not message:
            return {"error": "Message is required"}

        # Return streaming response
        return StreamingResponse(
            stream_chatkit_response(message, session_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )

    except Exception as e:
        return {"error": str(e)}


@app.post("/calculate")
async def calculate(request: ChatRequest):
    """
    Legacy non-streaming endpoint for backward compatibility.

    Example requests:
    - "can you add 2 + 25?"
    - "what is 10 minus 3?"
    - "multiply 5 by 7"
    - "divide 100 by 4"
    """
    try:
        # Get session for memory
        session = get_session(request.session_id)

        # Run agent
        result = await Runner.run(agent, request.message, session=session)

        return ChatResponse(result=result.final_output)

    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history/{session_id}")
async def get_history(session_id: str, limit: int = 10):
    """Get calculation history for a user session."""
    try:
        session = get_session(session_id)
        items = await session.get_items(limit=limit)

        return {
            "session_id": session_id,
            "history": items
        }

    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
