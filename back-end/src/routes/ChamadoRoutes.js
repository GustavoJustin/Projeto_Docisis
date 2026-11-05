const express = require("express");
const router = express.Router();
const ChamadoController = require("../controller/ChamadoController");

router.get("/", ChamadoController.listarChamados);
router.post("/", ChamadoController.cadastrarChamado);
router.delete("/:id", ChamadoController.deletarChamado);

module.exports = router;
