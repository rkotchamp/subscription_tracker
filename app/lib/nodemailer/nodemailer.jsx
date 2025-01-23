import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/recovery/reset?token=${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .button {
              background-color: hsl(24.6, 95%, 53.1%);
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              display: inline-block;
              margin: 16px 0;
              font-weight: 500;
            }
            .button:hover {
              background-color: hsl(24.6, 95%, 48%);
            }
            .footer {
              color: hsl(25, 5.3%, 44.7%);
              font-size: 14px;
            }
          </style>
        </head>
        <body style="font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 0;">
          <div style="background-color: hsl(60, 4.8%, 95.9%); padding: 40px 20px;">
            <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: hsl(24.6, 95%, 53.1%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Logo" style="width: 40px; height: 40px;">
                </div>
                <h1 style="color: hsl(20, 14.3%, 4.1%); font-size: 24px; margin: 0 0 10px;">Reset Your Password</h1>
                <p style="color: hsl(25, 5.3%, 44.7%); font-size: 16px; margin: 0;">We received a request to reset your password</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: hsl(20, 14.3%, 4.1%); font-size: 16px; margin-bottom: 20px;">
                  Hi there,<br>
                  Click the button below to reset your password. This link will expire in 1 hour.
                </p>
                <a href="${resetUrl}" class="button" style="background-color: hsl(24.6, 95%, 53.1%); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 16px 0; font-weight: 500;">
                  Reset Password
                </a>
              </div>
              
              <div style="text-align: center;" class="footer">
                <p style="margin: 0 0 10px;">If you didn't request this, you can safely ignore this email.</p>
                <p style="margin: 0;">
                  For security reasons, this link will expire in 1 hour.<br>
                  Need help? Contact our support team.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
