import {
  verifiyUserLogged,
  logoutUser,
  getToken,
} from "../../scripts/localstorage.js";

window.onload = (event) => {
  verifiyUserLogged();

  let activitiesBody = document.getElementById("activitiesBody");
  getActivities().then((data) => {
    for (const activity of data) {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.innerText = activity.title;

      const tdDescription = document.createElement("td");
      tdDescription.innerText = activity.description;

      const tdDate = document.createElement("td");
      tdDate.innerText = new Intl.DateTimeFormat("pt-br").format(
        new Date(activity.date)
      );

      const tdAddress = document.createElement("td");
      tdAddress.innerText = activity.address;

      const tdQuantity = document.createElement("td");
      tdQuantity.innerText = activity.quantity;

      tr.appendChild(tdName);
      tr.appendChild(tdDescription);
      tr.appendChild(tdDate);
      tr.appendChild(tdAddress);
      tr.appendChild(tdQuantity);
      activitiesBody.appendChild(tr);
    }
  });

  let myActivitiesBody = document.getElementById("myActivitiesBody");
  getMyActivities().then((data) => {
    for (const activity of data) {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.innerText = activity.title;

      const tdDescription = document.createElement("td");
      tdDescription.innerText = activity.description;

      const tdDate = document.createElement("td");
      tdDate.innerText = new Intl.DateTimeFormat("pt-br").format(
        new Date(activity.date)
      );

      const tdAddress = document.createElement("td");
      tdAddress.innerText = activity.address;

      const tdQuantity = document.createElement("td");
      tdQuantity.innerText = activity.quantity;

      tr.appendChild(tdName);
      tr.appendChild(tdDescription);
      tr.appendChild(tdDate);
      tr.appendChild(tdAddress);
      tr.appendChild(tdQuantity);
      myActivitiesBody.appendChild(tr);
    }
  });
};

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
  logoutUser();
});

async function getActivities() {
  const token = getToken();
  const response = await fetch("http://localhost:3000/activities", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const result = await response.json();
  return result;
}

async function getMyActivities() {
  const token = getToken();
  const response = await fetch("http://localhost:3000/my-activities", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const result = await response.json();
  return result;
}
