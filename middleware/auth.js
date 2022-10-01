import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
  let token ="";
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer")) {
    try {
      token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-password -token -confirmado"
      );
      return next();
    } catch (e) {
      console.log(e);
      const error = new Error("Token no valio");
      res.status(403).json({ msg: error.message });
    }
  }

  if(!token){
    const error = new Error("Token no valido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
