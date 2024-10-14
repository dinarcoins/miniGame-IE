// var showRulesContainer = document.querySelector('.showRuleContainer');
var openRule = document.getElementById("openRule");
var closeRule = document.getElementById("closeRule");
var ruleContainer = document.getElementById("ruleContainer");

function clickSound() {
  const sound = document.getElementById("click-sound");
  sound.currentTime = 0;
  sound.play();
}

openRule.addEventListener("click", function () {
  clickSound();
  ruleContainer.style.display = "flex";
});

closeRule.addEventListener("click", function () {
  clickSound();
  ruleContainer.style.display = "none";
});
