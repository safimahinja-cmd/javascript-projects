// ===== Shared footer year (used on multiple pages) =====
(function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ===== Mobile nav toggle =====
(function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });
})();

// ===== Basic Calculator =====
(function initCalculator() {
  const display = document.getElementById("calcDisplay");
  const calculator = document.querySelector(".calculator");

  if (!display || !calculator) return;

  let firstNumber = null;
  let operator = null;
  let waitingForSecond = false;

  function updateDisplay(value) {
    display.value = value;
  }

  function inputDigit(digit) {
    if (waitingForSecond) {
      updateDisplay(digit);
      waitingForSecond = false;
      return;
    }

    const current = display.value;
    updateDisplay(current === "0" ? digit : current + digit);
  }

  function inputDecimal() {
    if (waitingForSecond) {
      updateDisplay("0.");
      waitingForSecond = false;
      return;
    }
    if (!display.value.includes(".")) updateDisplay(display.value + ".");
  }

  function clearAll() {
    firstNumber = null;
    operator = null;
    waitingForSecond = false;
    updateDisplay("0");
  }

  function deleteLast() {
    if (waitingForSecond) return;
    const current = display.value;
    if (current.length <= 1) updateDisplay("0");
    else updateDisplay(current.slice(0, -1));
  }

  function compute(a, op, b) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? "Error" : a / b;
    return b;
  }

  function handleOperator(nextOp) {
    const inputValue = Number(display.value);

    if (display.value === "Error") {
      clearAll();
      return;
    }

    if (operator && waitingForSecond) {
      operator = nextOp; // allow changing operator before typing 2nd number
      return;
    }

    if (firstNumber === null) {
      firstNumber = inputValue;
    } else if (operator) {
      const result = compute(firstNumber, operator, inputValue);
      if (result === "Error") {
        updateDisplay("Error");
        firstNumber = null;
        operator = null;
        waitingForSecond = false;
        return;
      }
      const rounded = Number.isFinite(result) ? parseFloat(result.toFixed(10)) : result;
      updateDisplay(String(rounded));
      firstNumber = rounded;
    }

    operator = nextOp;
    waitingForSecond = true;
  }

  function handleEquals() {
    if (operator === null || firstNumber === null) return;
    if (waitingForSecond) return;

    const secondNumber = Number(display.value);
    const result = compute(firstNumber, operator, secondNumber);

    if (result === "Error") {
      updateDisplay("Error");
    } else {
      const rounded = Number.isFinite(result) ? parseFloat(result.toFixed(10)) : result;
      updateDisplay(String(rounded));
      firstNumber = rounded;
    }

    operator = null;
    waitingForSecond = true;
  }

  calculator.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === "digit") inputDigit(value);
    if (action === "decimal") inputDecimal();
    if (action === "operator") handleOperator(value);
    if (action === "equals") handleEquals();
    if (action === "clear") clearAll();
    if (action === "delete") deleteLast();
  });
})();