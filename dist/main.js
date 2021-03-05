let checkSciOperation = "";
let history = [];
let store = [];
class Calc {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }
  clear() {
    this.previousOperand = "";
    this.currentOperand = "";
    this.operation = undefined;

    //  for Sci. Mode
    this.sciOperand = "";
    this.SciOperation = "";
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) {
      return;
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
  chooseOperation(operation) {
    if (this.currentOperand === "") {
      return;
    }
    if (this.previousOperand != "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) {
      return;
    }
    switch (this.operation) {
      case "%":
        computation = prev % current;
        break;

      case "+":
        computation = prev + current;
        break;

      case "-":
        computation = prev - current;
        break;

      case "*":
        computation = prev * current;
        break;

      case "/":
        computation = prev / current;
        break;

      default:
        computation = "";
        break;
    }
    let addData = this.showHistory(prev, this.operation, current, computation);
    history.push(addData);
    sessionStorage.setItem("store", JSON.stringify(history));
    store.push(history);
    this.show();

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  addSession() {
    if (store === []) {
      sessionStorage.setItem("store", JSON.stringify(history));
    } else {
      store.push(history);
    }
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  deleteSci(operation) {
    this.printSciOperaion(operation);
    checkSciOperation = "";
  }

  // for Sci. Mode

  chooseOperationSci(operation) {
    let prevOperand = "";
    let prevOperation = "";
    if (this.previousOperand != "") {
      // for previously perform arithmatic operation and after perform sci. operation
      prevOperand = parseFloat(this.previousOperand);
      prevOperation = this.operation;
    }

    if (operation === ")") {
      //  use for end of Sci. operand
      this.currentOperandTextElement.innerText += operation;
    } else {
      if (operation === "=") {
        // at end of Sci. operation and then press equals button

        let sciResult = ""; //store only Sci. operand in form of number
        let curentSciOperand = ""; //store only Sci. operand in form of string
        let finalSciAnswer = ""; //store result of Sci. operaion only

        curentSciOperand = this.currentOperandTextElement.innerText;
        curentSciOperand = curentSciOperand.toString();
        sciResult = curentSciOperand.split("(")[1];
        sciResult = sciResult.split(")")[0];
        sciResult = parseFloat(sciResult);
        finalSciAnswer = this.computeSci(this.SciOperation, sciResult);
        this.updateDisplaySci(finalSciAnswer, prevOperand, prevOperation);
      } else {
        this.SciOperation = operation;
        this.printSciOperaion(this.SciOperation);
      }
    }
  }

  printSciOperaion(operation) {
    switch (operation) {
      case "e":
        this.currentOperandTextElement.innerText = "e(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "F":
        this.currentOperandTextElement.innerText = "n!(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "S":
        this.currentOperandTextElement.innerText = "sqrt(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "s":
        this.currentOperandTextElement.innerText = "sin(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "c":
        this.currentOperandTextElement.innerText = "cos(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "t":
        this.currentOperandTextElement.innerText = "tan(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "V":
        this.currentOperandTextElement.innerText = "X^2(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "C":
        this.currentOperandTextElement.innerText = "X^3(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "L":
        this.currentOperandTextElement.innerText = "Log(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "l":
        this.currentOperandTextElement.innerText = "ln(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "X":
        this.currentOperandTextElement.innerText = "1/X(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "Y":
        this.currentOperandTextElement.innerText = "1/Y(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "x":
        this.currentOperandTextElement.innerText = "10^x(";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      case "D":
        this.currentOperandTextElement.innerText = "";
        this.sciOperand = this.currentOperandTextElement.innerText;
        break;

      default:
        this.currentOperandTextElement.innerText = "";
    }
  }
  computeSci(operation, sciResult) {
    let result;
    switch (operation) {
      case "e":
        result = Math.exp(sciResult);
        break;

      case "F":
        let ans = 1;
        for (let i = sciResult; i >= 1; i--) {
          ans = ans * i;
        }
        result = ans;
        break;

      case "S":
        result = Math.sqrt(sciResult);
        break;

      case "s":
        result = Math.sin((sciResult * Math.PI) / 180.0);
        break;

      case "c":
        result = Math.cos((sciResult * Math.PI) / 180.0);
        break;

      case "t":
        result = Math.tan((sciResult * Math.PI) / 180.0);
        break;

      case "V":
        result = Math.pow(sciResult, 2);
        break;

      case "C":
        result = Math.pow(sciResult, 3);
        break;

      case "L":
        result = Math.log10(sciResult);
        break;

      case "l":
        result = Math.log(sciResult);
        break;

      case "X":
        result = 1 / sciResult;
        break;

      case "Y":
        result = sciResult * 3;
        break;

      case "x":
        result = Math.pow(10, sciResult);
        break;

      default:
        result = "";
    }
    if (this.previousOperand == "") {
      let addData = this.showHistorySci(operation, sciResult, result);
      history.push(addData);
      sessionStorage.setItem("store", JSON.stringify(history));
      store.push(history);
      this.show();
    }
    return result;
  }

  show() {
    let ans = JSON.parse(sessionStorage.getItem("store"));
    let data = document.querySelector(".list");
    let li = document.createElement("li");
    li.className = "delete";
    ans.forEach((item) => {
      li.innerHTML = `${item}`;
      data.appendChild(li);
    });
  }

  appendNumberSci(number) {
    this.sciOperand = this.sciOperand + number.toString();
    this.currentOperandTextElement.innerText = this.sciOperand;
  }

  updateDisplaySci(finalSciAnswer, prevOperand, prevOperation) {
    if (prevOperand != undefined && prevOperation != undefined) {
      this.currentOperand = finalSciAnswer;
      this.previousOperand = prevOperand;
      this.operation = prevOperation;
      this.compute();
      this.updateDisplay();
    } else {
      this.currentOperandTextElement.innerText = finalSciAnswer;
      this.currentOperand = this.currentOperandTextElement.innerText;
    }
    checkSciOperation = "";
    this.operation = undefined;
    this.SciOperation = undefined;
  }

  showHistory(prev, operation, current, computation) {
    return `${prev}${operation}${current}=${computation}`;
  }

  showHistorySci(operaion, sciResult, result) {
    return `${this.sciOperand})=${result}`;
  }

  historyClear(el) {
    let item = document.querySelectorAll(".delete");
    for (let i = 0; i < item.length; i++) {
      item[i].parentNode.removeChild(item[i]);
    }
    sessionStorage.clear();
    store = [];
    history = [];
  }
}
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const equalButton = document.querySelector("[data-equals]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);
const sciButtonsScript = document.querySelectorAll(
  "[data-sci-operation-script]"
);
const pButton = document.querySelector("[data-number-script]");
const calculator = new Calc(
  previousOperandTextElement,
  currentOperandTextElement
);
/* Events*/

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // check for whether number button is used for sci. operation or arithmatic operation
    if (checkSciOperation === "") {
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    } else {
      calculator.appendNumberSci(button.innerText);
    }
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalButton.addEventListener("click", () => {
  // check for pressed equal button is for Sci. operation or not
  if (checkSciOperation == 1) {
    calculator.chooseOperationSci(equalButton.innerText);
  } else {
    calculator.compute();
    calculator.updateDisplay();
  }
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  if (checkSciOperation == 1) {
    calculator.deleteSci(deleteButton.innerText);
  } else {
    calculator.delete();
    calculator.updateDisplay();
  }
});

// Sci. operation buttons

sciButtonsScript.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperationSci(button.firstElementChild.innerText);
    checkSciOperation = 1;
  });
});

pButton.addEventListener("click", () => {
  if (checkSciOperation == 1) {
    calculator.appendNumberSci("-");
  }
});

let showhistoryBar = document.querySelector(".show-history");
let historyBar = document.querySelector(".history");
let mainGrid = document.querySelector(".main-grid");
let trash = document.querySelector(".clear");
showhistoryBar.addEventListener("click", adddClass);
function adddClass(e) {
  historyBar.classList.toggle("show");
  mainGrid.classList.toggle("show");
  trash.classList.toggle("show");
}

const deleteHistory = document.querySelector(".fa-trash-alt");
deleteHistory.addEventListener("click", () => {
  calculator.historyClear();
});

// let div = document.createElement("div");
// div.appendChild(document.createTextNode("jay"));
// div.className = "alert";
// const container = document.querySelector(".container");
// const form = document.querySelector(".output");
// container.insertBefore(div, form);
document.addEventListener("DOMCOntentLoaded", () => {
  let d = document.querySelector(".message");
});

setTimeout(() => document.querySelector(".message").remove(), 5000);
