"""
CalculatorAgent - Agent Configuration with Custom Function Tools
"""

from agents import Agent, FunctionTool
from models import CalculationResult


# Custom calculator functions
def add_numbers(a: float, b: float) -> float:
    """
    Add two numbers together.

    Args:
        a: First number
        b: Second number

    Returns:
        The sum of a and b
    """
    return a + b


def subtract_numbers(a: float, b: float) -> float:
    """
    Subtract second number from first number.

    Args:
        a: First number
        b: Second number

    Returns:
        The difference (a - b)
    """
    return a - b


def multiply_numbers(a: float, b: float) -> float:
    """
    Multiply two numbers together.

    Args:
        a: First number
        b: Second number

    Returns:
        The product of a and b
    """
    return a * b


def divide_numbers(a: float, b: float) -> float:
    """
    Divide first number by second number.

    Args:
        a: Dividend (number to be divided)
        b: Divisor (number to divide by)

    Returns:
        The quotient (a / b)

    Raises:
        ValueError: If b is zero (division by zero)
    """
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


# Calculator Agent with custom function tools
agent = Agent(
    name="CalculatorAgent",
    instructions="""You are a helpful calculator agent. When users ask you to perform calculations in natural language, extract the numbers and operation, then use the appropriate function tool.

Available operations:
- Addition: Use add_numbers(a, b) for adding two numbers
- Subtraction: Use subtract_numbers(a, b) for subtracting b from a
- Multiplication: Use multiply_numbers(a, b) for multiplying two numbers
- Division: Use divide_numbers(a, b) for dividing a by b

Always return results in a structured JSON format with operation details. Parse natural language requests carefully to extract the correct numbers and operation.

Examples:
- "add 2 and 25" -> add_numbers(2, 25) -> result: 27
- "what is 100 minus 45?" -> subtract_numbers(100, 45) -> result: 55
- "multiply 7 by 8" -> multiply_numbers(7, 8) -> result: 56
- "divide 150 by 3" -> divide_numbers(150, 3) -> result: 50.0""",
    tools=[
        FunctionTool(add_numbers),
        FunctionTool(subtract_numbers),
        FunctionTool(multiply_numbers),
        FunctionTool(divide_numbers),
    ],
    output_type=CalculationResult,
)
