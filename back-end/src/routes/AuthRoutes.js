const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");

router.get("/contato", AuthController.contato);

// POST /api/login
router.post("/", AuthController.login);

module.exports = router;
