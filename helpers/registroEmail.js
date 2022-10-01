import nodemailer from 'nodemailer';

const emailRegistro = async ({nombre , email , token}) => {
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
    subject: 'Confirmación de la cuenta - No response',
    text: 'Comprueba tu cuenta en APV',
    html: `<p> Hola: ${nombre} , comprueba tu cuenta en  APV.</p>
      <p>Tu cuenta ya esta lista, solo debes confirmar con el siguente enlace:</p>
      <a href='${process.env.FRONT}/confirmar/${token}'>¡Confirmar aqui!</a>
    `
  });

  console.log("Mensaje envidado: %s" , info.messageId);

}

export default emailRegistro;