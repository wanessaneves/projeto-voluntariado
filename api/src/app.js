const config = require("./config");
const express = require("express");
const app = express();
const port = config.PORT;

const routes = require("./routes");

app.use(express.json());

app.use(routes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
