const display = document.getElementById("display");

// Get references to new elements
const scientificKeys = document.getElementById("scientific-keys");
const scientificToggle = document.getElementById("scientific-toggle");

function appendToDisplay(input) {
  const oldSelectionStart = display.selectionStart;
  const oldSelectionEnd = display.selectionEnd;
  const currentValue = display.value;

  const newValue = 
    currentValue.substring(0, oldSelectionStart) + 
    input + 
    currentValue.substring(oldSelectionEnd);

  display.value = newValue;

  // Set new cursor position
  const newCursorPos = oldSelectionStart + input.length;
  display.selectionStart = display.selectionEnd = newCursorPos;

  // Maintain focus on the display
  display.focus();
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  let expression = display.value;

  // Basic validation
  if (expression.trim() === "") {
    display.value = "";
    return;
  }

  // First, close any unclosed function calls
  expression = expression.replace(/(sin|cos|tan|sqrt|ln|log|abs|ceil|floor|round)\(([^)]*)$/g, (match, func, inner) => {
    return `${func}(${inner})`;
  });
  
  // Then close any remaining unclosed parentheses
  let openCount = 0;
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') openCount++;
    if (expression[i] === ')') openCount--;
  }
  
  // Add missing closing parentheses
  if (openCount > 0) {
    expression += ')'.repeat(openCount);
  }

  try {
    // Preprocess the expression to replace scientific notation with Math equivalents
    // WARNING: Using eval() with user input is potentially dangerous.
    // A dedicated math expression parser is recommended for better security and robustness.
    expression = expression.replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/ln\(/g, "Math.log(")     // Natural logarithm
      .replace(/log\(/g, "Math.log10(")   // Base 10 logarithm
    expression = expression.replace(/pi/g, "Math.PI"); // Replace pi constant
    expression = expression.replace(/e/g, "Math.E"); // Replace e constant
    expression = expression.replace(/\^/g, "**"); // Replace ^ with ** for exponentiation
    expression = expression.replace(/abs\(/g, "Math.abs(");
    expression = expression.replace(/ceil\(/g, "Math.ceil(");
    expression = expression.replace(/floor\(/g, "Math.floor(");
    expression = expression.replace(/round\(/g, "Math.round(");

    const result = eval(expression);

    // Check if the result is a finite number before displaying
    if (Number.isFinite(result)) {
      display.value = result;
    } else {
      // Handle cases like division by zero, operations resulting in Infinity or NaN
      display.value = "Error";
    }
  } catch (error) {
    // Catch syntax errors or other evaluation issues
    display.value = "Error";
    console.error("Calculation error:", error);
  }
}

// Toggle scientific mode function
// Toggle scientific mode
function toggleWissenschaftlichMode() {
  const calculator = document.getElementById("calculator");
  calculator.classList.toggle("scientific-mode");

  scientificToggle.textContent = calculator.classList.contains(
    "scientific-mode",
  )
    ? "Standard"
    : "Wissenschaftlich";
}

// Initialize calculator on page load
document.addEventListener("DOMContentLoaded", function () {
  // Ensure calculator starts in standard mode
  const calculator = document.getElementById("calculator");
  calculator.classList.remove("scientific-mode");
  scientificToggle.textContent = "Wissenschaftlich";

  // Add keydown event listener for direct keyboard input on the display
  display.addEventListener("keydown", function(event) {
    const key = event.key;

    // Handle Enter key for calculation
    if (key === "Enter") {
      calculate();
      event.preventDefault(); // Prevent default action (e.g., newline)
      return; // Stop further processing for Enter key
    }

    const allowedChars = "0123456789+-*/^().";
    const allowedControlKeys = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", 
      "Home", "End", "Tab"
    ];

    // Allow if the key is a number, an allowed operator/char, or an allowed control key
    if (allowedChars.includes(key) || allowedControlKeys.includes(key)) {
      // If it's an allowed key, let the default action proceed.
      // For numbers and operators, this means they will be inserted at the cursor.
      // For control keys, their default behavior (like deleting or moving cursor) will work.
      return; 
    }

    // If it's any other key (e.g., 'a', 'b', '$'), prevent it from being entered
    event.preventDefault();
  });
});
