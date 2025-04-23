const config = require("./config");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

const port = config.PORT;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
