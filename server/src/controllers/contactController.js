const emailService = require('../services/emailService');
const { validateContact } = require('../utils/validation');

exports.submitContactForm = async (req, res) => {
  try {
    // 1. Validate request body
    const { error, value } = validateContact(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.details.map(detail => detail.message)
      });
    }

    // 2. Send email
    const info = await emailService.sendContactEmail(value);
    
    console.log(`📧 Email sent successfully. ID: ${info.messageId}`);

    // 3. Send response
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Error in submitContactForm:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
