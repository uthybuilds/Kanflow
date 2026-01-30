const { transporter } = require('../config/email');
const { generateContactEmail } = require('../templates/contactEmail');

class EmailService {
  /**
   * Send a contact form email
   * @param {Object} data - { name, email, subject, message }
   * @returns {Promise<Object>} - Nodemailer info object
   */
  async sendContactEmail(data) {
    const htmlContent = generateContactEmail(data);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: data.email,
      subject: `[KanFlow] ${data.subject}: ${data.name}`,
      html: htmlContent,
      text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`, // Fallback
    };

    return await transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
