"""
CalculatorAgent - Memory Configuration
"""

from agents import SQLiteSession


def get_session(session_id: str) -> SQLiteSession:
    """Get or create a SQLite session for storing calculation history."""
    return SQLiteSession(
        session_id=session_id,
        db_path="calculations.db",
    )
