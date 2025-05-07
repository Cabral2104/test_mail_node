// index.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

let users = []; // Simulación de base de datos temporal

// Transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'valdezemilio50@gmail.com',
    pass: 'ygae pzaj bhtv yfkk'
  }
});

// Página principal de registro
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

// Registro de usuario con nombre, correo y contraseña
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const userExists = users.find(u => u.email === email);

  if (userExists) return res.send('Ya existe ese correo');

  users.push({ name, email, password });

  transporter.sendMail({
    from: 'valdezemilio50@gmail.com',
    to: email,
    subject: 'Registro exitoso',
    html: `<h3>Hola ${name}, te has registrado correctamente</h3>`
  });

  res.send('Registro exitoso. Revisa tu correo.');
});

// Página de inicio de sesión
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.send('Correo o contraseña incorrectos');

  res.send(`Bienvenido de nuevo, ${user.name}`);
});

// Página para solicitar recuperación
app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/forgot-password.html'));
});

// Solicitud de recuperación
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.send('Usuario no encontrado');

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 15 * 60 * 1000;

  user.resetToken = token;
  user.resetTokenExpiry = expiry;

  const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;

  transporter.sendMail({
    from: 'valdezemilio50@gmail.com',
    to: email,
    subject: 'Recupera tu contraseña',
    html: `<p>Hola ${user.name}, haz clic para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`
  });

  res.send('Correo de recuperación enviado');
});

// Página para restablecer contraseña
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

// Restablecer contraseña
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  const user = users.find(
    u => u.resetToken === token && u.resetTokenExpiry > Date.now()
  );

  if (!user) return res.send('Token inválido o expirado');

  user.password = newPassword;
  delete user.resetToken;
  delete user.resetTokenExpiry;

  res.send('Contraseña actualizada con éxito');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
