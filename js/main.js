var inputName = document.getElementById("inputName");
var startGameBtn = document.getElementById("startGameBtn");
var namePlayerElement = document.getElementById("namePlayer");

function updateName() {
  startGameBtn.addEventListener("click", function () {
    namePlayerElement.textContent = inputName.value;
  });
}

inputName.addEventListener("input", updateName);

if (inputName.value === "") {
  startGameBtn.disabled = true;
  console.log("ko cos ten");
} else {
  startGameBtn.disabled = false;
  console.log("choi toi ben");
}
