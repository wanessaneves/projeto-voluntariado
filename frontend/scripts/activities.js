const activityForm = document.getElementById("activity-form");

activityForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("date").value;
  const address = document.getElementById("address").value;
  const quantity = document.getElementById("quantity").value;

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMjZkYmMyODUtNzY3Ny00OWNkLTk2ZjgtYjFmMTAxMDcxMDlkIiwibmFtZSI6IkFiaWxpbyIsImVtYWlsIjoid2FuZXNzYUBlbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQwOCR5eGcyMnhkTlM1NnJLbmU3UC9xNW11cXNKVUN0UlJCbjF6U3U5a1BOLlZ4YzF2Q0UvWS9LTyIsImlzQWRtaW4iOnRydWV9LCJpYXQiOjE3NDEwNDM0NjIsImV4cCI6MTc0MTEyOTg2Mn0.Kt41wLJPHwah3fq73Y0OSG9ZXfbTqsxzNz5DpqAf8Gs";

  if (!token) {
    const messageElement = document.getElementById("message");
    messageElement.style.color = "red";
    messageElement.textContent = "Erro: Token de autenticação ausente";
    return;
  }

  const response = await fetch("http://localhost:3000/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, date, address, quantity }),
  });

  const result = await response.json();
  const messageElement = document.getElementById("message");

  if (response.ok) {
    messageElement.style.color = "green";
    messageElement.textContent = "Atividade criada com sucesso!";
    document.getElementById("activity-form").reset();
  } else {
    messageElement.style.color = "red";
    messageElement.textContent = "Erro ao criar atividade: " + result.error;
  }
});
