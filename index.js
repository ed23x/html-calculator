const display = document.getElementById("display");

// Get references to new elements
const scientificKeys = document.getElementById("scientific-keys");
const scientificToggle = document.getElementById("scientific-toggle");

function appendToDisplay(input) {
  display.value += input;
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

  try {
    // Preprocess the expression to replace scientific notation with Math equivalents
    // WARNING: Using eval() with user input is potentially dangerous.
    // A dedicated math expression parser is recommended for better security and robustness.
    expression = expression.replace(/sin\(/g, "Math.sin(");
    expression = expression.replace(/cos\(/g, "Math.cos(");
    expression = expression.replace(/tan\(/g, "Math.tan(");
    expression = expression.replace(/sqrt\(/g, "Math.sqrt(");
    expression = expression.replace(/ln\(/g, "Math.log("); // Natural logarithm (Math.log)
    expression = expression.replace(/log\(/g, "Math.log10("); // Base 10 logarithm (Math.log10)
    expression = expression.replace(/pi/g, "Math.PI"); // Replace pi constant
    expression = expression.replace(/e/g, "Math.E"); // Replace e constant
    expression = expression.replace(/\^/g, "**"); // Replace ^ with ** for exponentiation
    // Add new functions
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
});
