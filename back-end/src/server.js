const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const routes = require("./routes/index");

const app = express();

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../../front-end")));
app.get("/", (req, res) => res.redirect("/tailwind/index.html"));

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
