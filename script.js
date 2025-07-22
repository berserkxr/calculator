let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let firstOperand = '';
let waitingForOperand = false;

// Core arithmetic functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
}


//calculation functions
function performCalculation(firstOperand, secondOperand, operator){
    const a = parseFloat(firstOperand);
    const b = parseFloat(secondOperand);

    switch(operator){
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            throw new Error('Unknown operator');
    }
}

// Display functions
function updateDisplay(value){
    display.value = value;
}

function appendToDisplay(value){
    if (['+', '-', '*', '/'].includes(value)){
        handleOperator(value);
        return;
    }

    if (value === '.'){
        if(currentInput.indexOf('.') != -1)
            return; //Don't allow multiple decimal points
    }


    if (waitingForOperand){
        currentInput = value;
        waitingForOperand = false;
    } else{
        currentInput = currentInput === '0' ? value : currentInput + value;
    }

    updateDisplay(currentInput);
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    firstOperand = '';
    waitingForOperand = false;
    updateDisplay('0');
}

function clearEntry() {
    currentInput = '';
    updateDisplay('0');
}

function calculate() {
    if (firstOperand && operator && currentInput && !waitingForOperand) {
        try{
            const result = performCalculation(firstOperand, currentInput, operator);

            // Format result to avoid issues with floating point precision
            const formattedResult = Number(result.toPrecision(12));
            
            updateDisplay(formattedResult);
            currentInput = formattedResult.toString();
            operator = '';
            firstOperand = '';
            waitingForOperand = true;
        } catch (error) {
            updateDisplay('Error');
            clearDisplay();
        }
    } else if (operator) {
        waitingForOperand = true;
    }
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (firstOperand === '') {
        firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        try {
            const newValue = performCalculation(currentValue, inputValue, operator);
            const formattedValue = Number(newValue.toPrecision(12));

            updateDisplay(formattedValue);
            firstOperand = formattedValue;
        } catch (error) {
            updateDisplay('Error');
            clearDisplay();
            return;
        }
    }
    waitingForOperand = true;
    operator = nextOperator;
}

// Keyboard support 
document.addEventListener('keydown', function(e){
    if (e.key >= '0' && e.key <= '9' || e.key === '.'){
        appendToDisplay(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter' || e.key == '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        clearEntry();
    }
});

// Initialize display
updateDisplay('0');

