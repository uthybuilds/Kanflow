const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP Connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ SMTP Connection failed:', error);
    return false;
  }
};

module.exports = { transporter, verifyConnection };
