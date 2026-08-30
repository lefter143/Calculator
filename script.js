const numberButton = document.querySelectorAll('.number');
const plusOperator = document.querySelector('#plus-operator');
const minusOperator = document.querySelector('#minus-operator');
const multiplicationOperator = document.querySelector('#multiplication-operator');
const divisionOperator = document.querySelector('#division-operator');
const clearButton = document.querySelector('#clear');
const resultButton = document.querySelector('#equal-sign');

let display = document.querySelector('.calculator-screen');
let result = '';

console.log(numberButton)

plusOperator.addEventListener('click', function(e) {
    e.preventDefault();
    result += '+';
    display.textContent = result;
});

minusOperator.addEventListener('click', function(e) {
    e.preventDefault();
    result += '-';
    display.textContent = result;
});

multiplicationOperator.addEventListener('click', function(e) {
    e.preventDefault();
    result += '*';
    display.textContent = result;
});

divisionOperator.addEventListener('click', function(e) {
    e.preventDefault();
    result += '/';
    display.textContent = result;
});

numberButton.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        let number = button.textContent;
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

    console.log(`This is what is to be evaluated:${result}`);

    let calculation = eval(result);
    display.textContent = calculation;
});

