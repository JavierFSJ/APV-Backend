import express from "express";
const router = express.Router();

import {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from '../controllers/pacienteController.js'
import auth from '../middleware/auth.js';

router.route('/')
  .post(auth , agregarPaciente)
  .get(auth , obtenerPacientes);

router.route('/:id')
  .get(auth , obtenerPaciente)
  .put(auth , actualizarPaciente)
  .delete(auth , eliminarPaciente);
export default router;
