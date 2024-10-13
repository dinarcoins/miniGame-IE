const startGameBtn = document.getElementById("startGameBtn");
const board = document.getElementById("sudoku-board");
const gameContainer = document.getElementById("game-container");
const menuContainer = document.getElementById("menu-container");
let timer;
let startTime;
let currentDifficulty = "easy";
let highScore = localStorage.getItem("highScore") || 123;
const playerNameInput = document.getElementById("player-name");
let playerName = "";
const gameArea = document.getElementById("game-area");
const menu = document.getElementById("menu");
const namePlayer = document.getElementById("playerName");
const backToMenuBtn = document.getElementById("backToMenu");
let currentCell = null;

function showNotification(status, message) {
  var container = document.getElementById("notification-container");

  var notification = document.createElement("div");
  notification.classList.add("notification", status);
  notification.textContent = message;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

startGameBtn.addEventListener("click", function () {
  startGame();
});

backToMenuBtn.addEventListener("click", () => {
  gameArea.style.display = "none";
  menu.style.display = "block";
});

function setDifficulty(level) {
  currentDifficulty = level;
  const buttons = document.querySelectorAll("#difficulty .button");
  buttons.forEach((button) => {
    const buttonDifficulty = button.getAttribute("onclick").match(/'(.*?)'/)[1];
    if (buttonDifficulty === currentDifficulty) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    showNotification("error", "Please fill your name!");
    return;
  }
  menu.style.display = "none";
  gameArea.style.display = "block";
  document.getElementById("status").innerText = "";
  clearInterval(timer);
  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
  generateBoard(currentDifficulty);
}

function generateBoard(difficulty) {
  board.innerHTML = "";
  const presetBoard = generateSudokuBoard(difficulty);

  for (let row = 0; row < 9; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      // input.addEventListener("keydown", (event) => {
      //   event.preventDefault();
      // });
      input.type = "number";
      input.min = 1;
      input.max = 9;
      input.value = presetBoard[row][col] ? presetBoard[row][col] : "";
      input.disabled = presetBoard[row][col] !== 0;
      input.addEventListener("input", () => checkInput(row, col, input.value));
      input.addEventListener("focus", () => highlightCell(input));
      input.addEventListener("blur", () => removeHighlight(input));
      td.appendChild(input);
      tr.appendChild(td);
    }
    board.appendChild(tr);
  }
}

function generateSudokuBoard(difficulty) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  const currentMap = localStorage.getItem("currentMap");
  if (!fillBoard(board)) {
    showNotification("error", "Cannot generate the board! Try agani.");
    return null;
  }

  let cellsToRemove;
  switch (difficulty) {
    case "medium":
      cellsToRemove = 40;
      break;
    case "hard":
      cellsToRemove = 50;
      break;
    default:
      cellsToRemove = 30;
      break;
  }

  removeCells(board, cellsToRemove);

  return board
}

function fillBoard(board) {
  function canPlaceNumber(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) {
        return false;
      }

      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === num) {
        return false;
      }
    }
    return true;
  }

  function solve(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (canPlaceNumber(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  return solve(board);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function removeCells(board, cellsToRemove) {
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }
}

function checkInput(row, col, value) {
  const inputs = document.querySelectorAll("#sudoku-board input");
  let hasError = false;

  inputs.forEach((input) => {
    if (!input.classList.contains("selected")) {
      input.classList.remove("duplicate");
      input.classList.remove("correct");
    }
  });

  for (let i = 0; i < 9; i++) {
    if (i !== col && inputs[row * 9 + i].value == value) {
      inputs[row * 9 + i].classList.add("duplicate");
      hasError = true;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (i !== row && inputs[i * 9 + col].value == value) {
      inputs[i * 9 + col].classList.add("duplicate");
      hasError = true;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if ((i !== row || j !== col) && inputs[i * 9 + j].value == value) {
        inputs[i * 9 + j].classList.add("duplicate");
        hasError = true;
      }
    }
  }

  if (hasError) {
    inputs[row * 9 + col].classList.add("duplicate");
    inputs[row * 9 + col].classList.remove("correct");
    showNotification("error", "Duplicate number detected!!");
  } else {
    inputs[row * 9 + col].classList.add("correct");
    inputs[row * 9 + col].classList.remove("duplicate");
  }
}

function enterValue(value) {
  if (currentCell && !currentCell.disabled) {
    currentCell.value = value;
    const row = currentCell.parentElement.parentElement.rowIndex;
    const col = currentCell.parentElement.cellIndex;
    checkInput(row, col, value);
  }
}

function clearCell() {
  if (currentCell && !currentCell.disabled) {
    currentCell.value = "";
    const row = currentCell.parentElement.parentElement.rowIndex;
    const col = currentCell.parentElement.cellIndex;
    checkInput(row, col, "");
  }
}

function highlightCell(input) {
  currentCell = input;
  input.classList.add("highlight");
}

function removeHighlight(input) {
  input.classList.remove("highlight");
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").innerText = `Time: ${elapsedTime}s`;
}

function resetGame() {
  showNotification("success", "Game is reset!");
  clearInterval(timer);
  startGame();
}
