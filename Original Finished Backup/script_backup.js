const numberButton = document.querySelectorAll('.number');
const operator = document.querySelectorAll('.operator');
const clearButton = document.querySelector('#clear');
const resultButton = document.querySelector('#equal-sign');

let display = document.querySelector('.calculator-screen');
let result = '';

//console.log(numberButton)

// Make the keyboard keys equivalent to clicking the corresponding buttons on the calculator for keyboard support
document.addEventListener('keydown', function(e) {
    const workingKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '=', 'Enter', 'c', 'Delete'];
    if (workingKeys.includes(e.key)) e.preventDefault();
    if (e.key === '+') document.getElementById('plus-operator').click();
    else if (e.key === '-') document.getElementById('minus-operator').click();
    else if (e.key === '*') document.getElementById('multiplication-operator').click();
    else if (e.key === '/') document.getElementById('division-operator').click();
    else if (e.key === 'Enter' || e.key === '=') document.getElementById('equal-sign').click();
    else if (e.key === '0') document.getElementById('zero').click();
    else if (e.key === '1') document.getElementById('one').click();
    else if (e.key === '2') document.getElementById('two').click();
    else if (e.key === '3') document.getElementById('three').click();
    else if (e.key === '4') document.getElementById('four').click();
    else if (e.key === '5') document.getElementById('five').click();
    else if (e.key === '6') document.getElementById('six').click();
    else if (e.key === '7') document.getElementById('seven').click();
    else if (e.key === '8') document.getElementById('eight').click();
    else if (e.key === '9') document.getElementById('nine').click();
    else if (e.key === '.') document.getElementById('dot').click();
    else if (e.key === 'c' || e.key === 'Delete') document.getElementById('clear').click();
});

operator.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const operators = ['+', '-', '*', '/'];
        const lastChar = result.slice(-1), secondLastChar = result.slice(-2, -1); // Get the last and second last characters of the current result

        if (operators.includes(lastChar) || lastChar === '.') result = result.slice(0, -1);
        if (operators.includes(secondLastChar) && lastChar === '.') result = result.slice(0, -1);

        if (result !== '') {
            if (this.id === 'plus-operator') result += '+';
            else if (this.id === 'minus-operator') result += '-';
            else if (this.id === 'multiplication-operator') result += '*';
            else if (this.id === 'division-operator') result += '/';
        }
        
        display.textContent = result;
    });
});

numberButton.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const operators = ['+', '-', '*', '/'];
        const lastChar = result.slice(-1), secondLastChar = result.slice(-2, -1);
        let number = button.textContent;

        if ((operators.includes(secondLastChar) || secondLastChar === '') && lastChar === '0' && number !== '.') result = result.slice(0, -1);

        result += number;
        display.textContent = result;
        console.log(result);
    });
});

clearButton.addEventListener('click', function(e) {
    e.preventDefault();

    display.textContent = '';
    result = '';
});

resultButton.addEventListener('click', function(e) {
    e.preventDefault();
    //console.log(`This is what is to be evaluated:${result}`);
    const operators = ['+', '-', '*', '/'];
    const lastChar = result.slice(-1), secondLastChar = result.slice(-2, -1);

    if (operators.includes(lastChar)) result = result.slice(0, -1);
    if (operators.includes(secondLastChar) && lastChar === '.') result = result.slice(0, -2);

    let calculation = eval(result);
    result = calculation.toString();
    display.textContent = result;
});

