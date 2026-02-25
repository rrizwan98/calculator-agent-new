"""
CalculatorAgent - Main Application
Natural language calculator using OpenAI Agents SDK
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents import Runner
from agents_config import agent
from config import get_session
from models import CalculationResult

# Load environment variables
load_dotenv()

# Validate API key
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable not set")

# Create FastAPI app
app = FastAPI(
    title="CalculatorAgent",
    description="Natural language calculator agent that performs basic math operations",
    version="1.0.0"
)


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    result: CalculationResult


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "CalculatorAgent"}


@app.post("/calculate", response_model=ChatResponse)
async def calculate(request: ChatRequest):
    """
    Calculate mathematical expressions from natural language.

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
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
