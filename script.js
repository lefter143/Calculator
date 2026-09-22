const numberButton = document.querySelectorAll('.number');
const operator = document.querySelectorAll('.operator');
const functionButton = document.querySelectorAll('.function');
const stateButton = document.querySelectorAll('.state');
const memoryButton = document.querySelectorAll('.memory');
const parenthesisButton = document.querySelectorAll('.parenthesis');

const clearButton = document.querySelector('#clear');
const resultButton = document.querySelector('#equal-sign');
const deleteButton = document.querySelector('#delete');
const markupButton = document.querySelector('#mark-up');
const factorialButton = document.querySelector('#factorial');
const answerButton = document.querySelector('#answer');
const gtButton = document.querySelector('#grand-total');


let display = document.querySelector('.calculator-screen');
let result = '', memory = 0, drgMode = 0; // 0=degrees, 1=radians, 2=gradians, default mode is degrees
let justCalculated = false, Ans = '', GT = 0, inv = 0; // 0=normal, 1=inverse, default mode is normal
const π = Math.PI, e = Math.E, memo = [1, 1]; // Factorials for 0! and 1!
document.getElementById('drg-d').style.color='black';

// console.log(numberButton)

// Make the keyboard keys equivalent to clicking the corresponding buttons on the calculator for keyboard support
document.addEventListener('keydown', function(e) {
    const workingKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '=', 'Enter', 'C', 'Delete', 'Backspace', '(', ')', 'e', 'p', '^', 's', 'c', 't', 'i', '%', 'g', 'Tab', 'f', '!', 'a'];
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
    else if (e.key === 'C' || e.key === 'Delete') document.getElementById('clear').click();
    else if (e.key === 'Backspace') document.getElementById('delete').click();
    else if (e.key === '(') document.getElementById('left-parenthesis').click();
    else if (e.key === ')') document.getElementById('right-parenthesis').click();
    else if (e.key === 'e') document.getElementById('e').click();
    else if (e.key === 'p') document.getElementById('pi').click();
    else if (e.key === '^') document.getElementById('power-operator').click();
    else if (e.key === 's') document.getElementById('sine').click();
    else if (e.key === 'c') document.getElementById('cosine').click();
    else if (e.key === 't') document.getElementById('tangent').click();
    else if (e.key === 'i') document.getElementById('inverse').click();
    else if (e.key === '%') document.getElementById('percent').click();
    else if (e.key === 'g') document.getElementById('grand-total').click();
    else if (e.key === 'Tab') document.getElementById('DRG').click();
    else if (e.key === 'f' || e.key === '!') document.getElementById('factorial').click();
    else if (e.key === 'a') document.getElementById('answer').click();
});

function evaluateExpression(expr) {
    const operators = ['+', '-', '*', '/', '^', 'E'];
    const lastChar = expr.slice(-1), secondLastChar = expr.slice(-2, -1);

    if (operators.includes(lastChar)) expr = expr.slice(0, -1); // Prevents evaluation if the last character is an operator
    if ((operators.includes(secondLastChar) && lastChar === '.')) expr = expr.slice(0, -2); // Prevents evaluation if the last character is a decimal point and the second last character is an operator

    // Prevents evaluation if the last characters are 'e+' and the character before that is a number
    if (/\de[\+\-]$/i.test(expr)) { // \d = 0-9, e, [\+\-] = + or - in regex, $ = ensures all the previous characters are at the end
        expr = expr.slice(0, -2);
    } else if (/E$/.test(expr)) { // Catches trailing E
        expr = expr.slice(0, -1);
    }

    let openParens = (result.match(/\(/g) || []).length;
    let closeParens = (result.match(/\)/g) || []).length;
    for (let i = 0; i < (openParens - closeParens); i++) {
        expr += ')';
    }

    expr = expr.replace(/\^/g, '**'); // g = global, replaces all instances of ^ with ** for exponentiation
    expr = expr.replace(/%/g, '/100');
    expr = expr.replace(/E/g, 'e'); // Just 'e', not 'e+'. '5e3' and '5e-3' are both valid in JS.
    expr = expr.replace(/√\(/g, 'Math.sqrt(');

    expr = expr.replace(/\(([^)]+)\)!/g, 'factorialMemoized($1)'); // Replaces e.g. (3+2)! with factorialMemoized(3+2) Yes I know that regex with more than 1 parentheses don't work but I couldn't think of anything better
    expr = expr.replace(/(\d+(?:\.\d+)?)!/g, 'factorialMemoized($1)'); // Replaces e.g. 5! with factorialMemoized(5)

    // Must replace asin before sin so they don't overlap
    expr = expr.replace(/asin\(/g, 'Asin(');
    expr = expr.replace(/acos\(/g, 'Acos(');
    expr = expr.replace(/atan\(/g, 'Atan(');
    expr = expr.replace(/sin\(/g, 'Sin(');
    expr = expr.replace(/cos\(/g, 'Cos(');
    expr = expr.replace(/tan\(/g, 'Tan(');

    // Must replace log before ln (to avoid ln -> Math.log -> Math.Math.log10)
    expr = expr.replace(/log\(/g, 'Math.log10(');
    expr = expr.replace(/ln\(/g, 'Math.log(');

    if (GT === NaN) GT = 0;
    return eval(expr); // eval works with scientific notation
}

function Sin(x) {
    let rad = x;
    if (drgMode === 0) rad = x * (Math.PI / 180); // Degrees to Radians
    else if (drgMode === 2) rad = x * (Math.PI / 200); // Gradians to Radians
    return Math.sin(rad);
}

function Cos(x) {
    let rad = x;
    if (drgMode === 0) rad = x * (Math.PI / 180);
    else if (drgMode === 2) rad = x * (Math.PI / 200);
    return Math.cos(rad);
}

function Tan(x) {
    let rad = x;
    if (drgMode === 0) rad = x * (Math.PI / 180);
    else if (drgMode === 2) rad = x * (Math.PI / 200);
    return Math.tan(rad);
}

function Asin(x) {
    let rad = Math.asin(x);
    if (drgMode === 0) return rad * (180 / Math.PI); // Radians to Degrees
    if (drgMode === 2) return rad * (200 / Math.PI); // Radians to Gradians
    return rad;
}

function Acos(x) {
    let rad = Math.acos(x);
    if (drgMode === 0) return rad * (180 / Math.PI);
    if (drgMode === 2) return rad * (200 / Math.PI);
    return rad;
}

function Atan(x) {
    let rad = Math.atan(x);
    if (drgMode === 0) return rad * (180 / Math.PI);
    if (drgMode === 2) return rad * (200 / Math.PI);
    return rad;
}

function factorialMemoized(n) { // Iterative memoized factorial function which stores previously calculated factorials in an array to avoid redundant calculations
    if (n < 0 || !Number.isInteger(n)) {
        result = '';
        display.textContent = 'Error';
        throw new Error("Invalid factorial input");
    }
    if (memo[n] !== undefined) return memo[n];
    
    for (let i = memo.length; i <= n; i++) {
        memo[i] = memo[i - 1] * i;
    }
    return memo[n];
}

function formatResult(result) {
    // Add the result to the grand total since formatResult is called after every =
    if (result === 0) return '0';

    let absNum = Math.abs(result);

    // Change the result's format to scientific notation if it's greater than 10 billion or closer to zero than 0.00000001
    if (absNum >= 1e10 || absNum < 1e-8) {
        // .toExponential(5) converts it to scientific notation and limits it to 5 decimal places
        let tmp1 = result.toExponential(5);
        GT += parseFloat(tmp1);
        return tmp1; 
    }

    // Use toFixed(8) to limit the number of decimal places to 8, then convert it back to a string after using ParseFloat(which returns a number) to remove any unnecessary trailing zeros
    let tmp2 = parseFloat(result.toFixed(8))
    GT += tmp2;
    return tmp2.toString();
}

operator.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        justCalculated = false;
        const operators = ['+', '-', '*', '/', '^', 'E'];
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'π', 'e'];
        const lastChar = result.slice(-1), secondLastChar = result.slice(-2, -1); // Get the last and second last characters of the current result

        // Prevents consecutive operators or an operator after a decimal point
        if (operators.includes(lastChar) || (lastChar === '.' && secondLastChar !== '(')) {
            result = result.slice(0, -1);
            lastChar = result.slice(-1);
        }
        if (operators.includes(secondLastChar) && lastChar === '.') {
            result = result.slice(0, -1);
            lastChar = result.slice(-1);
        }

        if (result !== '' && lastChar !== '(') {
            if (this.id === 'plus-operator') result += '+';
            else if (this.id === 'minus-operator') result += '-';
            else if (this.id === 'multiplication-operator') result += '*';
            else if (this.id === 'division-operator') result += '/';
            else if (this.id === 'power-operator') result += '^';
        } else if (lastChar === '(' || result === '') {
            // Allow negative or positive signs immediately after an open parenthesis or at the start
            if (this.id === 'minus-operator') result += '-';
            else if (this.id === 'plus-operator') result += '+';
        }

        if (result !== '' && (numbers.includes(lastChar) || lastChar === '!' || lastChar === '%' || lastChar === ')')) {
            if (this.id === 'square-operator') result += '^2';
            if (this.id === 'one-over-x') result += '^(-1)';
        }

        if (result !== '' && (numbers.includes(lastChar) || lastChar === '.') && this.id === 'EXP') result += 'E';
        if (result !== '' && operators.includes(lastChar) && this.id === 'EXP') result += 'E';
        if (secondLastChar === '%' && operators.includes(lastChar) && this.id === 'percent') result = result.slice(0, -1);
        if (result !== '' && lastChar !== '%' && this.id === 'percent') result += '%';
        if (lastChar === '(') return;

        display.textContent = result;
    });
});

numberButton.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const operators = ['+', '-', '*', '/'];
        const lastChar = result.slice(-1), secondLastChar = result.slice(-2, -1);
        let number = button.textContent;

        if (this.id === 'pi') number = 'π';
        
        if ((operators.includes(secondLastChar) || secondLastChar === '') && lastChar === '0' && number !== '.') {
            result = result.slice(0, -1); // Prevents leading zeros in numbers
            lastChar = result.slice(-1);
        }
        
        if (lastChar === '%') return; 
        if (lastChar === '.' && number === '.') return;

        if (number === '.') {
            if (['π', 'e', '!'].includes(lastChar)) return; // Prevent decimal after π, e, or !
            
            // Prevent multiple decimals in the same number (e.g., 5.2.3)
            const lastNumberMatch = result.match(/(\d+(?:\.\d+)?(?:e[\+\-]?\d*)?)$/i); // This regex grabs the last number and checks if it already has a dot
            if (lastNumberMatch && lastNumberMatch[0].includes('.')) return;
        }

        // Turn e.g. "5π" into "5*π"
        if (this.id === 'pi' || this.id === 'e') {
            if (/[0-9\)πe!]/.test(lastChar)) result += '*'; // If the last character is a digit (0-9), ')', '!',s 'π', or 'e'
        } 
        // Turn e.g. "π5" into "π*5"
        else if (lastChar === 'π' || lastChar === 'e') {
            if (/[0-9\.]/.test(number)) result += '*'; // If the user presses a digit or a .
        }

        result += number;
        display.textContent = result;
        // console.log(result);
    });
});

functionButton.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        justCalculated = false;
        const operators = ['+', '-', '*', '/', '^', '('];
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'π', 'e', ')', '%', '!'];
        const lastChar = result.slice(-1); // Get the last and second last characters of the current result

        if (operators.includes(lastChar) || numbers.includes(lastChar) || result === '') {
            if (numbers.includes(lastChar)) result += '*';
            if (this.id === 'square-root') result += '√(';
            if (inv === 0) {
                if (this.id === 'sine') result += 'sin(';
                else if (this.id === 'cosine') result += 'cos(';
                else if (this.id === 'tangent') result += 'tan(';
                else if (this.id === 'logarithm') result += 'log(';
                else if (this.id === 'natural-logarithm') result += 'ln(';
            }
            else
            {
                if (this.id === 'sine') result += 'asin(';
                else if (this.id === 'cosine') result += 'acos(';
                else if (this.id === 'tangent') result += 'atan(';
                else if (this.id === 'logarithm') result += '10^';
                else if (this.id === 'natural-logarithm') result += 'e^';
            }
        }

        display.textContent = result;
    });
});

stateButton.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
    
        if (this.id === 'DRG') drgMode = (drgMode + 1) % 3;
        else if (this.id === 'inverse') inv = (inv + 1) % 2;

        if (drgMode === 0) {
            document.getElementById('drg-d').style.color='black';
            document.getElementById('drg-r').style.color='#a3a3a3';
            document.getElementById('drg-g').style.color='#a3a3a3';
        }
        else if (drgMode === 1) {
            document.getElementById('drg-d').style.color='#a3a3a3';
            document.getElementById('drg-r').style.color='black';
            document.getElementById('drg-g').style.color='#a3a3a3';
        }
        else {
            document.getElementById('drg-d').style.color='#a3a3a3';
            document.getElementById('drg-r').style.color='#a3a3a3';
            document.getElementById('drg-g').style.color='black';
        }

        if (inv === 0) document.getElementById('state-inv').style.color='#a3a3a3';
        else document.getElementById('state-inv').style.color='black';

    });
});

factorialButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    const lastChar = result.slice(-1);

    // I can only add a factorial if lastChar digit or ')'
    if (!/[0-9\)s]/.test(lastChar)) return; 

    const lastNumberMatch = result.match(/(\d+(?:\.\d+)?(?:[eE][\+\-]\d+)?)$/); // Prevent factorials on scientific notation
    // $ = look only at the end of the string, \d+ = 1 or more digits, \.\d+ = . followed by digits, (?:  )? makes the decimal part optional, e[\+\-]\d+ -> the letter e and +/- and \d+ digit after

    if (lastNumberMatch) {
        const lastNumber = lastNumberMatch[0];
        if (lastNumber.includes('e') || lastNumber.includes('E')) return; // Reject if it's in scientific notation
    }

    result += '!';
    display.textContent = result;
    justCalculated = false;
});

markupButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Match string ending strictly in '+' or '/' as we can only apply mark-up to such expressions 
    // Mark-up has 2 use cases S(A is baseExpr and B is marginValue):
    // 1.  A + B MU is Mark-up on Cost: A * (1 + B %) -> e.g. 100 + 15 MU -> 115 (Adds 15% tax/mark-up)
    // 2. A / B MU is Selling Price for Target Margin: A / (1 - B%) -> e.g. 100 / 20 MU -> 125 (Price that's needed for a 20% profit margin on a 100€ cost)
    // Group 1: Base expression (A) (e.g. "√(16)+10" or "5^2")
    // Group 2: Operator ('+' or '/')
    // Group 3: Margin value (B) (e.g. "20")
    const match = result.match(/^(.+?)([\+\/])(\d+(?:\.\d+)?)$/);
    // ^ = start of string, (.+?) = baseExpr, . = match any character, + = one or more times, ? = stop as soon as the last + or / is hit
    // ([\+\/]) = operator, \+ = + or \/ = /
    // (\d+(?:\.\d+)?) = value, \d+ one or more digits(0-9), (?:\.\d+)? -> ?: non-capturing group that groups a subpattern and does not memorize the matched text to the RegExpMatchArray, \. = ., \d+ one or more digits(0-9) and ? matches both e.g. 10 and 10.5
    // $ = do this until the end of string
    if (!match) return; 
    const [_, baseExpr, operator, value] = match; // Split the values of the match RegExpMatchArray to 3 strings

    try {
        const base = evaluateExpression(baseExpr);
        const marginValue = parseFloat(value);
        let calculateResult = 0;

        if (operator === '/') calculateResult = base / (1 - marginValue / 100);
        else if (operator === '+') calculateResult = base * (1 + marginValue / 100);
        // Same as in resultButton
        result = formatResult(calculateResult);
        Ans = result;
        display.textContent = result;
        justCalculated = true;

    } catch (error) {
        result = "";
        display.textContent = "Error";
    }
});

parenthesisButton.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const operators = ['+', '-', '*', '/', '^', 'E', '('];
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'π', 'e', '%', ')'];
        const lastChar = result.slice(-1);

        if (this.id === 'left-parenthesis') {
            if (operators.includes(lastChar) || result === '') result += '(';
            else if (numbers.includes(lastChar)) result += '*(';
        }
        else if (this.id === 'right-parenthesis') {
            let openParens = (result.match(/\(/g) || []).length;
            let closeParens = (result.match(/\)/g) || []).length;
            if ((openParens - closeParens) <= 0 || lastChar === '(') return;
            if (operators.includes(lastChar)) {
                result = result.slice(0, -1);
                result += ') ';
            }
            else if (numbers.includes(lastChar) || lastChar === ')') result += ')';
        }

        display.textContent = result;
    });
});

answerButton.addEventListener('click', function(e) {
    e.preventDefault();

    if (justCalculated) {
        result = '';
        justCalculated = false;
    }

    result += Ans;
    display.textContent = result;
});

gtButton.addEventListener('click', function(e) {
    e.preventDefault();

    result = GT.toString();
    display.textContent = result;
});

memoryButton.forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        let clicked = button.textContent;

        // Evaluate the current screen to get a number for storing to memory with M+, M-
        let tmp = 0;
        if (result !== '') {
            try {
                tmp = evaluateExpression(result) || 0;
            } 
            catch (error) {
                tmp = 0;
            }
        }

        if (clicked === 'MC') memory = 0;
        else if (clicked === 'MR') {
            result = formatResult(memory);
            display.textContent = result;
            justCalculated = true; 
        } 
        else if (clicked === 'M+') memory += tmp;
        else if (clicked === 'M-') memory -= tmp;

        if (memory !== 0) document.getElementById("state-mem").style.color = 'black';
        else document.getElementById("state-mem").style.color = '#a3a3a3';
    });
});

deleteButton.addEventListener('click', function(e) {
    e.preventDefault();

    if (result.endsWith('asin(') || result.endsWith('acos(') || result.endsWith('atan(')) {
        result = result.slice(0, -5);
    } 
    else if (result.endsWith('sin(') || result.endsWith('cos(') || result.endsWith('tan(') || result.endsWith('log(')) {
        result = result.slice(0, -4);
    } 
    else if (result.endsWith('ln(')) {
        result = result.slice(0, -3);
    } 
    else if (result.endsWith('√(') || result.endsWith('e+') || result.endsWith('MU')) {
        result = result.slice(0, -2);
    } 
    else {
        result = result.slice(0, -1);
    }

    display.textContent = result || "0";
});

clearButton.addEventListener('click', function(e) {
    e.preventDefault();

    result = '';
    display.textContent = result;
});

resultButton.addEventListener('click', function(e) {
    e.preventDefault();

    try {
        let calculation = evaluateExpression(result);
        
        result = formatResult(calculation);
        Ans = result; // Store the result in the Ans variable for later use
        justCalculated = true; // Set justCalculated to true after a calculation is made
        display.textContent = result;
        
    } catch (error) {
        if (display.textContent !== 'Error') {
            result = "";
            display.textContent = "Error";
        }
    }
});