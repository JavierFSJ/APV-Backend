import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/registroEmail.js";
import resetEmail from "../helpers/resetEmail.js";

const registrar = async (req, res) => {
  const { email } = req.body;
  //Prevenir usuario duplicado
  const existeUsuario = await Veterinario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Este email ya ha sido registrado!");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //Guardar un nuevo vet
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //Enviar email
    emailRegistro(veterinarioGuardado);

    res.json({ veterinarioGuardado });
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json(veterinario);
};

const actualizarPerfil = async (req, res) => {
  const { nombre, email, telefono, web } = req.body;
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("No se encontro el veterinario");
    return res.status(400).json({ msg: error.message });
  }

  if (veterinario.email !== email) {
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
      const error = new Error("El email ya esta registrado");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = nombre;
    veterinario.email = email;
    veterinario.telefono = telefono;
    veterinario.web = web;
    const veterianrioActualizado = await veterinario.save();
    res.json(veterianrioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Veterinario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Veterianrio Confirmado" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = Error("El usuario no existe");
    return res.status(403).json({ msg: error.message });
  }

  //Comprabar si un usuario ya esta confirmado
  if (!usuario.confirmado) {
    const error = Error("La cuenta no esta confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //Autenticar al usuario
  if (await usuario.comprobarPassword(password)) {
    //Autenticar JSON TOKEN
    res.json({
      _id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.nombre, usuario.id),
    });
  } else {
    const error = Error("Password Incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const cambioPassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email });
  if (!existeVeterinario) {
    const error = Error("Este correo no esta registrado");
    return res.status(403).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarId();
    await existeVeterinario.save();
    resetEmail(existeVeterinario);
    res.json({ msg: "Hemos envidado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });
  if (!tokenValido) {
    const error = Error("El token no es valido");
    return res.status(403).json({ msg: error.message });
  }
  res.json({ msg: `Token valido` });
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params,
    { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });

  //Verificar el token
  if (!veterinario) {
    const error = Error("El token no es valido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    veterinario.password = password;
    veterinario.token = null;
    await veterinario.save();
    res.json({ msg: `Su password ha sido restablecido correctamente` });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const resetPwd = async (req, res) => {
  const { id } = req.veterinario;
  const { pwd_actual, pwd_nuevo, pwd_confirm } = req.body;

  const veterinario = await Veterinario.findOne({id});

  if (pwd_nuevo.length < 6) {
    const error = Error("El password debe ser mayor a 6 caracteres");
    return res.status(403).json({ msg: error.message });
  }

  if (pwd_nuevo !== pwd_confirm) {
    const error = Error("El password no coincide");
    return res.status(403).json({ msg: error.message });
  }

  if (await veterinario.comprobarPassword(pwd_actual)) {
    try {
      veterinario.password = pwd_nuevo;
      await veterinario.save();
      res.json({ msg: "Password Actualizado" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  } else {
    const error = Error("Password incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  cambioPassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  resetPwd,
};
