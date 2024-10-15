var openRule = document.getElementById("openRule");
var closeRule = document.getElementById("closeRule");
var ruleContainer = document.getElementById("ruleContainer");
var winnerContainer = document.querySelector(".winner-container");
var buttons = document.querySelectorAll("button");

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


