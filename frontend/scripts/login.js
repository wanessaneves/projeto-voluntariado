import { showError, showSuccess } from "./app.js";
import { saveToken, saveUserLogged } from "./localstorage.js";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const responseData = await response.json();
    saveToken(responseData.token);
    saveUserLogged(responseData.user);
    showSuccess("Login efetuado com sucesso");

    if (responseData.user.isAdmin) {
      window.location.replace("/frontend/pages/admin/index.html");
    } else {
      window.location.replace("/frontend/pages/user/index.html");
    }
  } else {
    showError("Falha ao efetuar login");
  }
});
