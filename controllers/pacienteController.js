import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req , res) => {  
  const paciente = new Paciente(req.body);
  paciente.veterinario_id = req.veterinario._id;
  try {
    const pacienteGuardado = await paciente.save();
    res.json(pacienteGuardado);
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}

const obtenerPacientes = async (req , res) => { 
  const pacientes = await Paciente.find()
        .where('veterinario_id').equals(req.veterinario);
  res.json(pacientes);
}

const obtenerPaciente = async ( req , res ) => {
  const {id} = req.params;
  const paciente = await Paciente.findOne()
        .where('veterinario_id').equals(req.veterinario).
         where('_id').equals(id);
  res.json(paciente);
}
const actualizarPaciente = async ( req , res ) => {
  const {id} = req.params;
  const {nombre , propietario, email , sintomas} = req.body;
  const paciente = await Paciente.findOne()
        .where('veterinario_id').equals(req.veterinario).
         where('_id').equals(id);
  try {
    paciente.nombre = nombre;
    paciente.propietario = propietario;
    paciente.email = email;
    paciente.sintomas = sintomas;
    await paciente.save();
    res.json(paciente);
    
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}

const eliminarPaciente = async ( req , res ) => {
  const {id} = req.params;
  const paciente = await Paciente.findOne()
        .where('veterinario_id').equals(req.veterinario).
         where('_id').equals(id);
  try {
    const pacienteEliminado = await paciente.delete();
    res.json(pacienteEliminado);
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
}


export {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  eliminarPaciente,
  actualizarPaciente,
}