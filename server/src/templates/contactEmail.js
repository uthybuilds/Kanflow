/**
 * Generates a sophisticated, responsive HTML email template
 * @param {Object} data - The email data { name, email, subject, message, date }
 * @returns {string} - The compiled HTML string
 */
const generateContactEmail = (data) => {
  const { name, email, subject, message } = data;
  const date = new Date().toLocaleString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>New Message from KanFlow</title>
  
  <style>
    /* Reset styles */
    html, body {
      margin: 0;
      padding: 0;
      height: 100% !important;
      width: 100% !important;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #09090b; /* Zinc 950 */
      color: #e4e4e7; /* Zinc 200 */
    }
    
    /* Client-specific resets */
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse !important;
    }
    
    /* Responsive styles */
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 20px !important;
      }
      .stack-column {
        display: block !important;
        width: 100% !important;
        direction: ltr !important;
      }
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b;">
  <center style="width: 100%; background-color: #09090b;">
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
      New contact form submission from ${name} regarding ${subject}...
    </div>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090b;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <!-- Main Card -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #18181b; border-radius: 16px; border: 1px solid #27272a; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            
            <!-- Header -->
            <tr>
              <td style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #27272a; background: linear-gradient(to right, #18181b, #27272a);">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">KanFlow</h1>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #a1a1aa;">New Contact Inquiry</p>
                    </td>
                    <td align="right">
                      <div style="background-color: #2563eb; color: white; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
                        ${subject}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="mobile-padding" style="padding: 40px;">
                <!-- Sender Info -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                  <tr>
                    <td width="40" valign="top">
                      <div style="width: 40px; height: 40px; background-color: #27272a; border-radius: 50%; text-align: center; line-height: 40px; color: #a1a1aa; font-weight: bold; font-size: 16px;">
                        ${name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td style="padding-left: 15px;" valign="middle">
                      <h3 style="margin: 0; font-size: 16px; color: #ffffff;">${name}</h3>
                      <a href="mailto:${email}" style="margin: 0; font-size: 14px; color: #3b82f6; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                </table>

                <!-- Message Box -->
                <div style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 25px;">
                  <h4 style="margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; color: #71717a; letter-spacing: 1px;">Message</h4>
                  <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap;">${message}</p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #09090b; padding: 20px 40px; border-top: 1px solid #27272a;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left" style="color: #71717a; font-size: 12px;">
                      Received on ${date}
                    </td>
                    <td align="right" style="color: #71717a; font-size: 12px;">
                      Sent via KanFlow Backend
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Legal/Unsubscribe text -->
          <p style="margin-top: 20px; color: #52525b; font-size: 12px;">
            This email was sent automatically from your KanFlow contact form.
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
};

module.exports = { generateContactEmail };
