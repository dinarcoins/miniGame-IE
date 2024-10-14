var board = document.getElementById("sudoku-board");
var gameContainer = document.getElementById("game-container");
var menuContainer = document.getElementById("menu-container");
var timer;
var startTime;
var currentDifficulty = "easy";
var playerNameInput = document.getElementById("player-name");
var playerName = "";
var gameArea = document.getElementById("game-area");
var menu = document.getElementById("menu");
var backToMenuBtn = document.getElementById("backToMenu");
var currentCell = null;
var displayTitle = document.getElementById("displayTitle");
var continueGame = document.getElementById("continueGame");
var highcore = document.getElementById("high-score");
var pauseResumeBtn = document.getElementById("pauseResumeBtn");
var isPaused = false;
let elapsedTime = 0;

function clickSound() {
  const sound = document.getElementById("click-sound");
  sound.currentTime = 0;
  sound.play();
}

function disableKeyboardInput() {
  const inputs = document.querySelectorAll("#sudoku-board input");
  inputs.forEach((input) => {
    input.addEventListener("keydown", (event) => {
      event.preventDefault();
    });
  });
}

function showNotification(status, message) {
  const container = document.getElementById("notification-container");

  const notification = document.createElement("div");
  const sound = document.createElement("audio");
  sound.src = "./audio/pop.mp3";
  notification.classList.add("notification", status);
  notification.textContent = message;

  container.appendChild(notification);
  sound.play();
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

backToMenuBtn.addEventListener("click", () => {
  clickSound();
  gameArea.style.display = "none";
  menu.style.display = "block";
  clearInterval(timer);
});

function setDifficulty(level) {
  clickSound();
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

function continueGameBtn() {
  const haveContinue = localStorage.getItem("currentMap");
  if (!haveContinue === null) {
    menu.style.display = "none";
    gameArea.style.display = "block";
  } else {
    showNotification("error", "Your don't have game");
  }
}

function startGame() {
  clickSound();
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    showNotification("error", "Please fill your name!");
    return;
  }
  displayTitle.textContent = playerName;
  menu.style.display = "none";
  gameArea.style.display = "block";
  clearInterval(timer);
  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
  generateBoard(currentDifficulty);
  disableKeyboardInput();
}

function generateBoard(difficulty) {
  board.innerHTML = "";
  const presetBoard = generateSudokuBoard(difficulty);

  for (let row = 0; row < 9; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.readOnly = true;
      input.min = 1;
      input.max = 9;
      input.value = presetBoard[row][col] ? presetBoard[row][col] : "";
      input.disabled = presetBoard[row][col] !== 0;
      input.addEventListener("input", () => checkInput(row, col, input.value));
      input.addEventListener("focus", () => highlightCell(input));
      input.addEventListener("blur", () => removeHighlight(input));
      if (presetBoard[row][col] !== 0) {
        input.classList.add("preset");
      }

      if (row % 3 === 0) {
        td.classList.add("top-border");
      }
      if (col % 3 === 0) {
        td.classList.add("left-border");
      }
      td.appendChild(input);
      tr.appendChild(td);
    }
    board.appendChild(tr);
  }
}

function generateSudokuBoard(difficulty) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
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
    case "hardest":
      cellsToRemove = 65;
      break;
    default:
      cellsToRemove = 30;
      break;
  }

  removeCells(board, cellsToRemove);

  return board;
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

function saveBoardToLocalStorage() {
  var inputs = document.querySelectorAll("#sudoku-board input");
  var boardState = [];

  for (var i = 0; i < 9; i++) {
    var row = [];
    for (var j = 0; j < 9; j++) {
      var index = i * 9 + j;
      var value = inputs[index].value;
      row.push(value ? parseInt(value) : 0);
    }
    boardState.push(row);
  }
  localStorage.setItem("currentMap", JSON.stringify(boardState));
  showNotification("success", "Game saved!");
}

function pauseGame() {
  clearInterval(timer);

  const inputs = document.querySelectorAll("#sudoku-board input");
  inputs.forEach((input) => {
    input.disabled = true;
  });

  showNotification("warning", "Game paused!");
}

pauseResumeBtn.addEventListener("click", () => {
  if (isPaused) {
    resumeGame();
    pauseResumeBtn.textContent = "Pause!";
  } else {
    pauseGame();
    pauseResumeBtn.textContent = "Resume!";
  }
  isPaused = !isPaused;
});

function pauseGame() {
  clearInterval(timer);
  const inputs = document.querySelectorAll("#sudoku-board input");
  inputs.forEach((input) => {
    input.disabled = true;
  });

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  showNotification("warning", "Game paused!");
}

function resumeGame() {
  startTime = Date.now() - elapsedTime * 1000;
  timer = setInterval(updateTimer, 1000);

  const inputs = document.querySelectorAll("#sudoku-board input");
  inputs.forEach((input) => {
    if (!input.classList.contains("preset")) {
      input.disabled = false;
    }
  });

  showNotification("warning", "Game resumed!");
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

    if (checkWinner()) {
      highcore.textContent = `High Score : ${Math.floor(
        (Date.now() - startTime) / 1000
      )}`;
      showNotification("success", "Winner! Winner...");
      showWinnerContainer();
      localStorage.setItem(
        "highScore",
        Math.floor((Date.now() - startTime) / 1000)
      );
    }
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

function changeMap() {
  showNotification("success", "Map changed!");
  clearInterval(timer);
  startGame();
}

function checkWinner() {
  const inputs = document.querySelectorAll("#sudoku-board input");

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = inputs[i * 9 + j];
      const value = parseInt(cell.value);

      if (!value || !isValid(i, j, value)) {
        return false;
      }
    }
  }

  clearInterval(timer);

  inputs.forEach((input) => {
    input.disabled = true;
  });

  return true;
}

function isValid(row, col, value) {
  const inputs = document.querySelectorAll("#sudoku-board input");

  for (let i = 0; i < 9; i++) {
    if (i !== col && parseInt(inputs[row * 9 + i].value) === value) {
      return false;
    }
    if (i !== row && parseInt(inputs[i * 9 + col].value) === value) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (
        (i !== row || j !== col) &&
        parseInt(inputs[i * 9 + j].value) === value
      ) {
        return false;
      }
    }
  }

  return true;
}
