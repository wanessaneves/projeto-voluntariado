import { verifiyUserLogged, logoutUser } from "../../scripts/localstorage.js";

window.onload = (event) => {
  verifiyUserLogged();
};

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
  logoutUser();
});
