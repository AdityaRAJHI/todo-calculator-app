// Todo List Functionality
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${todo.text}</span>
            <button><i class="fas fa-trash"></i></button>
        `;

        // Toggle completion
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => {
            todos[index].completed = checkbox.checked;
            li.classList.toggle('completed');
            saveTodos();
        });

        // Delete todo
        const deleteBtn = li.querySelector('button');
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });

        todoList.appendChild(li);
    });
}

addTodoBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        todoInput.value = '';
        saveTodos();
        renderTodos();
    }
});

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodoBtn.click();
    }
});

// Calculator Functionality
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator button');

let currentNumber = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    display.value = currentNumber || '0';
}

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        currentNumber = digit;
        waitingForSecondOperand = false;
    } else {
        currentNumber = currentNumber === '0' ? digit : currentNumber + digit;
    }
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        currentNumber = '0.';
        waitingForSecondOperand = false;
        return;
    }
    if (!currentNumber.includes('.')) {
        currentNumber += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentNumber);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        currentNumber = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

function calculate(first, second, op) {
    switch (op) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '×':
            return first * second;
        case '÷':
            return first / second;
        default:
            return second;
    }
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('number')) {
            inputDigit(button.textContent);
            updateDisplay();
        } else if (button.classList.contains('decimal')) {
            inputDecimal();
            updateDisplay();
        } else if (button.classList.contains('operator')) {
            handleOperator(button.textContent);
            updateDisplay();
        } else if (button.classList.contains('equals')) {
            if (operator && !waitingForSecondOperand) {
                const secondOperand = parseFloat(currentNumber);
                const result = calculate(firstOperand, secondOperand, operator);
                currentNumber = String(result);
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = false;
                updateDisplay();
            }
        } else if (button.classList.contains('clear')) {
            currentNumber = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            updateDisplay();
        }
    });
});

// Initial render
renderTodos();
updateDisplay();
