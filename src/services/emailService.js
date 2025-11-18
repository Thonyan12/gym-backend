const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

function generarCodigoVerificacion() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function enviarCodigoVerificacion(email, codigo, tipo) {
  const asunto = tipo === 'registro' 
    ? '🔐 Código de Verificación - Utmach Gym'
    : '🔒 Código de Autenticación - Utmach Gym';
  
  const mensaje = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0a1a2e 0%, #14213d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fca311; margin: 0;">Utmach Gym</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
        <p style="font-size: 16px;">Tu código de verificación es:</p>
        <div style="background: #fca311; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; color: #14213d; border-radius: 8px; margin: 20px 0; letter-spacing: 8px;">
          ${codigo}
        </div>
        <p style="color: #666; font-size: 14px;">⏱️ Este código expira en <strong>10 minutos</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Si no solicitaste este código, ignora este mensaje.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Utmach Gym" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: asunto,
    html: mensaje
  });
}

module.exports = { generarCodigoVerificacion, enviarCodigoVerificacion };
