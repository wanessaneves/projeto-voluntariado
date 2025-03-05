const localStorageTokeKey = "voluntariadoapp-token";
const localStorageUserKey = "voluntariadoapp-user";

export function verifiyUserLogged(isAdmin = false) {
  const token = getToken();
  const user = getUserLogged();

  if (!token || !user) {
    logoutUser();
  }

  if (isAdmin && !user.isAdmin) {
    logoutUser();
  }
}

export function logoutUser() {
  removeToken();
  removeUserLogged();
  window.location.replace("/frontend/pages/index.html");
}

export function getToken() {
  const token = localStorage.getItem(localStorageTokeKey);
  return token;
}

export function saveToken(token) {
  localStorage.setItem(localStorageTokeKey, token);
}

export function removeToken() {
  localStorage.removeItem(localStorageTokeKey);
}

export function getUserLogged() {
  const user = localStorage.getItem(localStorageUserKey);
  return JSON.parse(user);
}

export function saveUserLogged(user) {
  const userParsed = JSON.stringify(user);
  localStorage.setItem(localStorageUserKey, userParsed);
}

export function removeUserLogged() {
  localStorage.removeItem(localStorageUserKey);
}
