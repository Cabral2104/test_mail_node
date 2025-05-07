const nodemailer = require('nodemailer');

// Configura el transporte con tu cuenta de Gmail y la contraseña de app
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'valdezemilio50@gmail.com', // ⚠️ Usa tu correo de Gmail
    pass: 'ygae pzaj bhtv yfkk' // ⚠️ No tu contraseña normal
  }
});

// Configura el correo que quieres enviar
const mailOptions = {
  from: '<valdezemilio50@gmail.com>', // remitente
  to: 'jfabela522@gmail.com',              // destinatario
  subject: 'Correo de prueba desde Node.js',
  html: `
    <h2>¡Hola!</h2>
    <p>Este correo fue enviado automáticamente usando <strong>Node.js + Nodemailer + Gmail</strong>.</p>
  `
};

// Envía el correo
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('❌ Error al enviar:', error);
  } else {
    console.log('✅ Correo enviado: ' + info.response);
  }
});
