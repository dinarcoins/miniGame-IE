// var showRulesContainer = document.querySelector('.showRuleContainer');
var openRule = document.getElementById("openRule");
var closeRule = document.getElementById("closeRule");
var ruleContainer = document.getElementById("ruleContainer");

openRule.addEventListener("click", function () {
  ruleContainer.style.display = "flex";
});

closeRule.addEventListener("click", function () {
  ruleContainer.style.display = "none";
});

