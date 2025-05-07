// index.js
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3005;

// 1) Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2) Configura Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'valdezemilio50@gmail.com',  // tu cuenta Gmail
    pass: 'ygae pzaj bhtv yfkk'         // tu contraseña de app
  }
});

// 3) Ruta de registro
app.post('/api/register', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name y email son obligatorios.' });
  }

  // Opcional: aquí guardarías el usuario en tu BD
  // await db.saveUser({ name, email });

  // Configura el email de confirmación
  const mailOptions = {
    from: 'Registro <valdezemilio50@gmail.com>',
    to: email,
    subject: '¡Registro exitoso!',
    html: `
      <h2>Hola ${name},</h2>
      <p>Gracias por registrarte. Tu cuenta ha sido creada correctamente.</p>
      <p>— El equipo de MiApp</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmación enviada:', info.response);
    res.json({ message: `¡Correo de confirmación enviado a ${email}!` });
  } catch (err) {
    console.error('❌ Error al enviar confirmación:', err);
    res.status(500).json({ message: 'No se pudo enviar el correo.' });
  }
});

// 4) Otra ruta de prueba (envío distinto)
app.post('/api/otra-accion', async (req, res) => {
  const { email } = req.body;
  // Ejemplo: envío de otro tipo de correo
  const mailOptions = {
    from: 'Soporte <valdezemilio50@gmail.com>',
    to: email,
    subject: 'Acción realizada',
    html: `<p>Esta es una notificación de que realizaste otra acción.</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo de notificación enviado.' });
  } catch (e) {
    res.status(500).json({ message: 'Error al enviar notificación.' });
  }
});

// 5) Levanta el servidor
app.listen(PORT, () => {
  console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});
