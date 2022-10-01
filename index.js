/* 
  Creando el servidor de express
*/

/* Modules */
import  express  from "express";
import dotenv  from "dotenv";
import  connectDb  from "./config/db.js";
import cors from 'cors';

import veterianarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoute from "./routes/pacientesRoute.js";

const app = express();
app.use(express.json());
dotenv.config();
connectDb();

const dominiosPermitidos = [process.env.FRONT_1 , process.env.FRONT_2];
const corsOptions = {
  origin: function(origin , callback){
    if(dominiosPermitidos.indexOf(origin) !== -1){
      //Origen permitido
      callback(null , true);
    }
    else{
      callback(new Error('No permitido por cors'))
    }
  },
};
app.use(cors(corsOptions)); 
app.use('/api/veterinarios' , veterianarioRoutes);
app.use('/api/pacientes' , pacienteRoute);

const port = process.env.PORT || 4000;
app.listen(port , ()=> {
  console.log(`Servidor funcionando en el puerto ${port}`);
});