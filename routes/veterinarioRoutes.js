import express from "express";

import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  cambioPassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  resetPwd,
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/auth.js";

const router = express.Router();

router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/autenticar", autenticar);
router.post("/cambio-password", cambioPassword);
router.route("/change-password/:token").get(comprobarToken).post(nuevoPassword);

/* Rutas para area privada */
router.get("/perfil", checkAuth , perfil);
router.put("/perfil/:id", checkAuth , actualizarPerfil);
router.put("/reset-password", checkAuth , resetPwd);

export default router;
