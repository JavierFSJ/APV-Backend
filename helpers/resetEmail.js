import nodemailer from 'nodemailer';

const resetEmail = async ({nombre , email , token}) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //Enviar email
  const info = await transport.sendMail({
    from: 'APV - Administrador de pacientes de veterianria',
    to: email,
    subject: 'Restablece tu password  - No response',
    text: 'Restablece tu password de tu cuenta en APV',
    html: `<p> Hola: ${nombre}</p>
      <p>Hola, para poder restablecer tu password sigue el siguiente enlace</p>
      <a href='${process.env.FRONT}/olvide-password/${token}'>¡Restablecer aqui!</a>
    `
  });

  console.log("Mensaje envidado: %s" , info.messageId);

}

export default resetEmail;