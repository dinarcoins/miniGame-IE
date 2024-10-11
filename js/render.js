var ruleBtn = document.getElementById('ruleBtn')
var showRulesContainer = document.querySelector('.showRuleContainer')

ruleBtn.addEventListener('click', function() {
  console.log('showRulesContainer', showRulesContainer);
  
  showRulesContainer.style.display = 'flex'
})