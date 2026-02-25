"""
CalculatorAgent - FastAPI Backend with ChatKit SDK
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chatkit.server import ChatKitServer
from agents_config import agent
from agents import Runner

# Load environment variables
load_dotenv()

# Validate API key
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable not set")

# Create FastAPI app
app = FastAPI(
    title="CalculatorAgent ChatKit Backend",
    description="ChatKit-compatible backend for Calculator Agent using ChatKit SDK",
    version="3.0.0"
)

# Add CORS middleware
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

# Create ChatKit server instance
chatkit_server = ChatKitServer()


@chatkit_server.respond
async def handle_message(ctx):
    """
    Handle incoming messages from ChatKit.

    This function is called when a user sends a message.
    It runs the agent and streams the response back to ChatKit.
    """
    # Get the user's message
    user_message = ctx.user_message

    print(f"✅ Processing message: {user_message}")

    # Run the agent
    result = await Runner.run(agent, user_message)

    # Get the calculation result
    calculation = result.final_output

    # Stream response back to ChatKit
    response_text = f"The result is **{calculation.result}**\n\n**Calculation:** {calculation.operand1} {calculation.operation} {calculation.operand2} = {calculation.result}"

    await ctx.stream_agent_response(
        messages=[{"role": "assistant", "content": response_text}]
    )


@app.get("/")
async def root():
    """Service information endpoint."""
    return {
        "service": "CalculatorAgent ChatKit Backend",
        "version": "3.0.0",
        "agent": "Calculator Agent",
        "chatkit_sdk": "enabled",
        "endpoints": {
            "health": "/health",
            "chatkit": "/chatkit (POST)",
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "CalculatorAgent ChatKit"}


# Mount ChatKit server to FastAPI
app.mount("/chatkit", chatkit_server.app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
