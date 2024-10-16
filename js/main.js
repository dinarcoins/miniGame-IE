let elapsedTime = 0;
let timerInterval;
var playerName = "";
var isPausedGame = false;
var initialBoard = [];
var currentCell = null;
var currentDifficulty = "easy";
var menu = document.getElementById("menu");
var gameArea = document.getElementById("game-area");
var board = document.getElementById("sudoku-board");
var highcore = document.getElementById("high-score");
var restartBtn = document.getElementById("restartBtn");
var backToMenuBtn = document.getElementById("backToMenu");
var displayTitle = document.getElementById("displayTitle");
var continueGame = document.getElementById("continueGame");
var playerNameInput = document.getElementById("player-name");
var gameContainer = document.getElementById("game-container");
var menuContainer = document.getElementById("menu-container");
var pauseResumeBtn = document.getElementById("pauseResumeBtn");
var winnerContainer = document.querySelector(".winner-container");
const score = localStorage.getItem("highScore") || null;

function startTimer() {
  elapsedTime = 0;
  isPausedGame = false;
  updateTimer();
  timerInterval = setInterval(() => {
    if (!isPausedGame) {
      elapsedTime++;
      updateTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  updateTimer();
}

function updateTimer() {
  document.getElementById("timer").innerText = `Time: ${elapsedTime}s`;
}

function restartTimer() {
  elapsedTime = 0;
  clearInterval(timerInterval);
  updateTimer();
  startTimer();
}

function disableKeyboardInput() {
  const inputs = document.querySelectorAll("#sudoku-board input");
  inputs.forEach((input) => {
    input.addEventListener("keydown", (event) => {
      event.preventDefault();
    });
  });
}

function openWinner() {
  winnerContainer.style.display = "block";
  const sound = document.createElement("audio");
  sound.src = "./audio/winner.mp3";
  sound.play();
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

function confirmModal(confirmCallback) {
  const modal = document.createElement("div");
  const titleText = document.createElement("h2");
  const noButtonText = document.createElement("p");
  const yesButtonText = document.createElement("p");
  const noButton = document.createElement("button");
  const modalContent = document.createElement("div");
  const yesButton = document.createElement("button");
  const containerModal = document.createElement("div");

  containerModal.classList.add("containerModal");
  modal.classList.add("modal-confirm");
  modalContent.classList.add("modal-content");
  titleText.textContent = "Are you sure?";

  yesButtonText.textContent = "I'm sure!";
  yesButton.classList.add("button");
  yesButton.addEventListener("click", () => {
    confirmCallback();
    document.body.removeChild(containerModal);
  });

  noButtonText.textContent = "No!I'm not";
  noButton.classList.add("button");
  noButton.addEventListener("click", () => {
    document.body.removeChild(containerModal);
  });

  modal.appendChild(titleText);
  modalContent.appendChild(yesButton);
  modalContent.appendChild(noButton);
  yesButton.appendChild(yesButtonText);
  noButton.appendChild(noButtonText);
  modal.appendChild(modalContent);

  document.body.appendChild(containerModal);
  containerModal.appendChild(modal);
}

backToMenuBtn.addEventListener("click", () => {
  confirmModal(() => {
    gameArea.style.display = "none";
    menu.style.display = "block";
    resetTimer();
  });
});

restartBtn.addEventListener("click", () => {
  confirmModal(() => {
    restart();
  });
});

function restart() {
  const inputs = document.querySelectorAll("#sudoku-board input");
  restartTimer();
  // Khôi phục lại trạng thái gốc của bảng Sudoku
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = initialBoard[row][col];
      const input = inputs[row * 9 + col];
      if (value === 0) {
        input.value = ""; // Ô trống
        input.disabled = false; // Cho phép người chơi nhập lại giá trị
        input.classList.remove("duplicate", "correct"); // Xóa các class lỗi nếu có
      } else {
        input.value = value;
        input.disabled = true; // Không cho phép người chơi thay đổi các ô đã có giá trị
      }
    }
  }

  showNotification("success", "The game has been restarted!");
}

function pauseGame() {
  const inputs = document.querySelectorAll("#sudoku-board input");
  inputs.forEach((input) => {
    input.disabled = true;
  });
  showNotification("warning", "Game paused!");
}

pauseResumeBtn.addEventListener("click", () => {
  if (isPausedGame) {
    resumeGame();
    pauseResumeBtn.textContent = "Pause!";
  } else {
    pauseGame();
    pauseResumeBtn.textContent = "Resume!";
  }
  isPausedGame = !isPausedGame;
});

function resumeGame() {
  const inputs = document.querySelectorAll("#sudoku-board input");
  inputs.forEach((input) => {
    if (!input.classList.contains("preset")) {
      input.disabled = false;
    }
  });
  showNotification("warning", "Game resumed!");
}

// generated Board 9x9 logic code
// bắt đầu chơi game
function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    showNotification("error", "Please fill your name!");
    return;
  }
  displayTitle.textContent = playerName;
  menu.style.display = "none";
  gameArea.style.display = "block";
  displayHighScore();
  startTimer();
  generateBoard(currentDifficulty);
  disableKeyboardInput();
}
// generateBoard dùng để fill value vào table input 9x9
function generateBoard(difficulty) {
  board.innerHTML = "";
  const presetBoard = generateSudokuBoard(difficulty);
  // trả về ma trận đã được trộn, check logic
  initialBoard = presetBoard;
  // lưu map hiện tại để có thể restart game

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
// generateSudokuBoard dùng để tạo ma trận
function generateSudokuBoard(difficulty) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  // 9x9 tất cả value = 0
  if (!solve(board)) {
    showNotification("error", "Cannot generate the board! Try agani.");
    return null;
  }
  // dùng để check xem có thể tạo thành một bảng 9x9 hợp lệ hay ko

  let cellsToRemove;
  switch (difficulty) {
    case "medium":
      cellsToRemove = 35;
      break;
    case "hard":
      cellsToRemove = 45;
      break;
    case "hardest":
      cellsToRemove = 65;
      break;
    default:
      cellsToRemove = 30;
      break;
  }

  removeCells(board, cellsToRemove);
  // sử dụng để xoá đi số lượng ô theo như level
  return board;
}
// canPlaceNumber dùng để check số không cùng roư, col, 3x3
function canPlaceNumber(board, row, col, num) {
  // dùng để check số không cùng roư, col, 3x3
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }

    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    // xác định vị trí của value ở ô 3x3 : Vd 5/3 = 1 nằm ở ô thứ 2 3x3
    if (board[boxRow][boxCol] === num) {
      return false;
    }
  }
  return true;
}
// solve dùng để map ra board, tạo ma trận, dùng conPlaceNumber để check vị trí đó có thể fill value vào được không
function solve(board) {
  // sử dụng đệ quy và backTracking để check tính hợp lệ của board
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
// shuffle nhận vào array, trả về 1 array đã được swap random
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    // Tráo đổi (swap) phần tử i với phần tử j
  }
  return array;
}
// removeCells nhận vào board (ma trận đã trộn số), số lượng cần xoá, trả về board đã được xoá theo số lượng cần xoá một cách ngẫu nhiên
function removeCells(board, cellsToRemove) {
  let removed = 0;
  // biến removed để ghi nhận rằng một ô đã bị xóa.
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }
}
// checking value tại input đó dựa vào row col value, hiện thị các style dupplicate, correct, error
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
  // check col

  for (let i = 0; i < 9; i++) {
    if (i !== row && inputs[i * 9 + col].value == value) {
      inputs[i * 9 + col].classList.add("duplicate");
      hasError = true;
    }
  }
  // check row

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
  // check theo 3x3, ví dụ dùng row 5 / 3 = 1 => 5 đang ở ô thứ 2

  if (hasError) {
    inputs[row * 9 + col].classList.add("duplicate");
    inputs[row * 9 + col].classList.remove("correct");
    showNotification("error", "Duplicate number detected!!");
  } else {
    inputs[row * 9 + col].classList.add("correct");
    inputs[row * 9 + col].classList.remove("duplicate");
  }
}
// nhận giá trị value trả về giá trị đó
function enterValue(value) {
  if (currentCell && !currentCell.disabled) {
    currentCell.value = value;
    const row = currentCell.parentElement.parentElement.rowIndex;
    const col = currentCell.parentElement.cellIndex;
    checkInput(row, col, value);
  }
  if (checkWinner()) {
    checkHighScore();
    displayHighScore();
    showNotification("success", "Winner! Winner...");
    openWinner();
    isPausedGame = true;
  }
}
// clearCell xoá bỏ value trong ô input đó
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

function checkWinner() {
  // duyệt qua tất cả các ô xem có value, và tính hợp lệ trong logic
  const inputs = document.querySelectorAll("#sudoku-board input");

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = inputs[i * 9 + j];
      const value = parseInt(cell.value);

      if (!value || !isValidCheckWinner(i, j, value)) {
        return false;
      }
    }
  }

  inputs.forEach((input) => {
    input.disabled = true;
  });

  return true;
}

function isValidCheckWinner(row, col, value) {
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
// checkHighScore dùng để check điểm hiện tại trong local, nếu chưa có điểm cao hoặc điểm hiện tại tốt hơn điểm cao nhất đã lưu, cập nhật điểm cao nhất
function checkHighScore() {
  const currentHighScore = localStorage.getItem("highScore");
  if (!currentHighScore || elapsedTime < parseInt(currentHighScore)) {
    localStorage.setItem("highScore", elapsedTime);
  }
}
// displayHighScore dùng để render ra điểm cao nhất cho highcore
function displayHighScore() {
  const highScore = localStorage.getItem("highScore");
  if (highScore) {
    highcore.textContent = `High Score: ${highScore}s`;
  } else {
    highcore.textContent = "High Score: 0s";
  }
}
