var openRule = document.getElementById("openRule");
var closeRule = document.getElementById("closeRule");
var ruleContainer = document.getElementById("ruleContainer");
var winnerContainer = document.querySelector(".winner-container");
var buttons = document.querySelectorAll("button");
var trickContainer = document.getElementById("tricks");
var ruleList = document.getElementById("rule-list");

var tricksList = [
  {
    img: "./img/trick1.png",
    alt: "trick1",
    desc: "'Last free cell' is the basic Sudoku solving technique. It's pretty simple and based on the fact that each 3×3 block, vertical column or horizontal row on Sudoku grid should contain numbers from 1 to 9 and each number can be used only once within 3×3 block, vertical column or horizontal row.",
  },
  {
    img: "./img/trick2.png",
    alt: "trick2",
    desc: "'Last possible number' is a simple strategy that is suitable for beginners. It is based on finding the missing number. To find the missing number you should take a look at the numbers that are already exist in the 3x3 block you are interested in, and in the rows and columns connected with it.",
  },
  {
    img: "./img/trick3.png",
    alt: "trick3",
    desc: "This strategy is based on the correct placement of Notes. Sometimes it is called Naked Singles. The point is that in a specific cell only one digit (from the Notes) remains possible.",
  },
  {
    img: "./img/trick4.png",
    alt: "trick4",
    desc: "'Obvious pairs' is based on the correct placement of Notes. The point is that you should find 2 cells with the same pairs of Notes within 3x3 block. This means that these pairs of Notes cannot be used in other cells within this 3x3 block. So they can be removed from your Notes. It will be easier to understand this strategy if you look at the example.",
  },
  {
    img: "./img/trick5.png",
    alt: "trick5",
    desc: "Look at the top left block. Its three bottom cells contain notes of 1, 5; 1, 8 & 5, 8. This means that these cells have number 1, 5 & 8 in them but we don't know yet where each number is exactly. What we know though, is that 1, 5 & 8 can't be in other cells of this block.",
  },
  {
    img: "./img/trick6.png",
    alt: "trick6",
    desc: "'Hidden pairs' technique works the same way as 'Hidden singles'. The only thing that changes is the number of cells and Notes. If you can find two cells within a row, column, or 3x3 block where two Notes appear nowhere outside these cells, these two Notes must be placed in the two cells. All other Notes can be eliminated from these two cells.",
  },
  {
    img: "./img/trick7.png",
    alt: "trick7",
    desc: "'Hidden triples' applies when three cells in a row, column, or 3x3 block contain the same three Notes. These three cells also contain other candidates, which may be removed from them.",
  },
];

var ruleLists = [
  {
    decs: "Sudoku is a popular logic puzzle with numbers. Its rules are quite simple, so even beginners can handle the simple levels.",
  },
  { decs: "Sudoku grid consists of 9x9 spaces." },
  { decs: "You can use only numbers from 1 to 9." },
  { decs: "Each 3×3 block can only contain numbers from 1 to 9." },
  { decs: "Each vertical column can only contain numbers from 1 to 9." },
  { decs: "Each horizontal row can only contain numbers from 1 to 9." },
  {
    decs: "Each number in the 3×3 block, vertical column or horizontal row can be used only once.",
  },
  {
    decs: "The game is over when the whole Sudoku grid is correctly filled with numbers.",
  },
  {
    decs: "Last free cell' is the basic Sudoku solving technique. It's pretty simple and based on the fact that each 3×3 block, vertical column or horizontal row on Sudoku grid should contain numbers from 1 to 9 and each number can be used only once within 3×3 block, vertical column or horizontal row. Therefore, if we see that there is only one free cell left in the 3×3 block, vertical column or horizontal row, then we have to define which number from 1 to 9 is missing and enter it in this empty cell.",
  },
  {
    decs: "Last remaining cell is another basic Sudoku strategy. It's based on the fact that numbers should not be repeated within 3×3 block, vertical column and horizontal row.Let's take a look at an example with the 3x3 block. There always must be number 8 - in each block, column and row. There's already 8 in the column and in the row. As we already know, we can't repeat numbers. So we can't place 8 there again. It means that there's only one cell remaining inside the block and we should put number 8 into it.",
  },
  {
    decs: "Last possible number is a simple strategy that is suitable for beginners. It is based on finding the missing number. To find the missing number you should take a look at the numbers that are already exist in the 3x3 block you are interested in, and in the rows and columns connected with it.",
  },
  {
    decs: "If you get stuck on Sudoku grid and don't see the obvious solutions for the rest of cells, you should use Notes. With the help of Notes you should fill in all the possible options for each blank cell, focusing on the numbers that are already on the Sudoku grid.",
  },
  {
    decs: "This strategy is based on the correct placement of Notes. Sometimes it is called Naked Singles. The point is that in a specific cell only one digit (from the Notes) remains possible.",
  },
  {
    decs: "Like the 'Obvious Singles' technique, 'Obvious pairs' is based on the correct placement of Notes. The point is that you should find 2 cells with the same pairs of Notes within 3x3 block. This means that these pairs of Notes cannot be used in other cells within this 3x3 block. So they can be removed from your Notes. It will be easier to understand this strategy if you look at the example.",
  },
  {
    decs: "This Sudoku solving technique is built upon the previous one - 'Obvious pairs'. But 'Obvious triples' is not based on two numbers from the Notes, it's based on three. This is the only difference. To understand better, let's take a look at the example.",
  },
  { decs: "" },
  { decs: "" },
  { decs: "" },
  { decs: "" },
];

ruleList.innerHTML = ruleLists
  .map((item) => {
    return `<li>${item.decs}</li>`;
  })
  .join("");

tricksList.forEach((items) => {
  const container = document.createElement("div");
  container.className = "image-trick-container";

  const img = document.createElement("img");
  img.src = items.img;
  img.alt = items.alt;

  const info = document.createElement("span");
  info.className = "info-trick";
  info.textContent = items.desc;

  container.appendChild(img);
  container.appendChild(info);
  trickContainer.appendChild(container);
});

function clickSound() {
  const sound = document.getElementById("click-sound");
  sound.currentTime = 0;
  sound.play();
}

buttons.forEach((button) => {
  button.addEventListener("click", clickSound);
});

openRule.addEventListener("click", function () {
  ruleContainer.style.display = "flex";
});

closeRule.addEventListener("click", function () {
  ruleContainer.style.display = "none";
});

function closeWinner() {
  winnerContainer.style.display = "none";
}
