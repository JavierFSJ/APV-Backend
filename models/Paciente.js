import mongoose from "mongoose";
import Veterinario from "./Veterinario.js"

const pacienteSchema = mongoose.Schema({
  nombre: {type: String , required: true},
  propietario: {type: String , required: true},
  email: {type: String , required: true},
  fecha: {type: Date , default: Date.now() , required: true},
  sintomas: {type: String , required: true},
  veterinario_id: {
    type: mongoose.Schema.Types.ObjectId , 
    required: true,
    ref: Veterinario
  },
  
} , {timestamps: true});

const Paciente = mongoose.model("Paciente" , pacienteSchema);

export default Paciente;