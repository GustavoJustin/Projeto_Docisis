const express = require("express");
const router = express.Router();
const ChamadoController = require("../controller/ChamadoController");
const exigirAdministrador = require("../middleware/roleMiddleware");

router.get("/historico", exigirAdministrador, ChamadoController.listarHistoricoChamados);
router.get("/", ChamadoController.listarChamados);
router.post("/", ChamadoController.cadastrarChamado);
router.patch("/:id/assumir", ChamadoController.assumirChamado);
router.patch("/:id/concluir", ChamadoController.concluirChamado);

module.exports = router;
