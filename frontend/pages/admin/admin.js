import { verifiyUserLogged, logoutUser } from "../../scripts/localstorage.js";

window.onload = (event) => {
  verifiyUserLogged(true);
};

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
  logoutUser();
});
