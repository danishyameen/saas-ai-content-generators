const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOTP = async (email, otp) => {
  try {
    const subject = 'Your Password Reset OTP - Genifai';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">Genifai</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">You requested a password reset. Here is your One Time Password (OTP):</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="margin: 0; color: #1f2937; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #6b7280;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; ${new Date().getFullYear()} Genifai. All rights reserved.</p>
      </div>
    `;

    // 1. Try Resend first (The Proper Fix for Vercel)
    if (resend) {
      console.log('Using Resend API to send OTP...');
      const { data, error } = await resend.emails.send({
        from: 'Genifai <onboarding@resend.dev>',
        to: email,
        subject,
        html,
      });

      if (error) {
        console.error('Resend Error:', error);
        // If Resend fails, it will fall through to Nodemailer
      } else {
        console.log('OTP sent successfully via Resend:', data.id);
        return data;
      }
    }

    // 2. Fallback to Nodemailer (For Localhost/Backup)
    console.log('Using Nodemailer/SMTP fallback...');
    const mailOptions = {
      from: `"Genifai" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully via Nodemailer:', info.response);
    return info;
  } catch (error) {
    console.error('CRITICAL: All Email methods failed:', error);
    throw error;
  }
};

module.exports = {
  sendOTP
};
