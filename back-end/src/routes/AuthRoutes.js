const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");

router.get("/contato", AuthController.contato);
router.post(
  "/cadastro-funcionario",
  AuthController.cadastrarFuncionarioPublico,
);

// POST /api/login
router.post("/", AuthController.login);

module.exports = router;
