const alertBox = document.getElementById("alert");
const alertText = document.getElementById("alert-text");
const alertButton = document.getElementById("alert-button");

alertButton.addEventListener("click", function () {
  alertBox.style.display = "none";
});

function removeAlert() {
  alertText.innerText = "";
  alertBox.style.display = "none";
  alertBox.style.backgroundColor = "#ffffff";
}

export function showError(message) {
  alertText.innerText = message;
  alertBox.style.display = "flex";
  alertBox.style.backgroundColor = "#ff9e9e";

  setTimeout(() => {
    removeAlert();
  }, 2000);
}

export function showSuccess(message) {
  alertText.innerText = message;
  alertBox.style.display = "flex";
  alertBox.style.backgroundColor = "#60d668";

  setTimeout(() => {
    removeAlert();
  }, 2000);
}
