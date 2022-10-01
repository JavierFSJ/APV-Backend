import jwt from 'jsonwebtoken';

const generarJWT = (usuario , id) => {
  return jwt.sign( {usuario , id} , process.env.JWT_SECRET , {
    expiresIn: "30d",
  })
};

export default generarJWT;