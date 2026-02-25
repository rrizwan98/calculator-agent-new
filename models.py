"""
CalculatorAgent - Pydantic Models
"""

from pydantic import BaseModel, Field
from typing import Optional


class CalculationResult(BaseModel):
    """Structured output for calculation results."""

    operation: str = Field(description="The operation performed (+, -, *, /)")
    operand1: float = Field(description="The first operand")
    operand2: float = Field(description="The second operand")
    result: float = Field(description="The result of the calculation")
    expression: Optional[str] = Field(default=None, description="The original expression")
