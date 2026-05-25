const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true,
      maxConnections: 5,
      rateDelta: 20000,
      rateLimit: 5,
    });
  }

  async send(options) {
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '',
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId} to ${options.to}`);
      return info;
    } catch (error) {
      logger.error(`Email failed to ${options.to}: ${error.message}`);
      throw error;
    }
  }

  getBaseTemplate(content, title) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            <tr><td style="background:linear-gradient(135deg,#001F5E,#003d9e);padding:30px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:bold;">🏆 Bharat AI Olympiad</h1>
              <p style="color:#FF8C00;margin:5px 0 0;font-size:14px;">India's Premier AI Olympiad Platform</p>
            </td></tr>
            <tr><td style="padding:30px;">${content}</td></tr>
            <tr><td style="background:#f5f5f5;padding:20px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} Bharat AI Olympiad. All rights reserved.</p>
              <p style="color:#999;font-size:12px;margin:5px 0 0;">baio.in | support@baio.in</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;
  }

  async sendWelcome(student) {
    const content = `
      <h2 style="color:#001F5E;">Welcome, ${student.fullName}! 🎉</h2>
      <p style="color:#555;">Your registration at <strong>Bharat AI Olympiad</strong> is successful.</p>
      <div style="background:#f0f4ff;border-left:4px solid #001F5E;padding:15px;margin:20px 0;border-radius:4px;">
        <p style="margin:0;"><strong>Roll Number:</strong> ${student.rollNumber}</p>
        <p style="margin:5px 0 0;"><strong>Email:</strong> ${student.email}</p>
      </div>
      <p style="color:#555;">Please verify your email to activate your account.</p>
      <p style="color:#555;">All the best for your olympiad journey! 🚀</p>`;
    await this.send({ to: student.email, subject: '🎉 Welcome to Bharat AI Olympiad!', html: this.getBaseTemplate(content, 'Welcome') });
  }

  async sendEmailVerification(email, name, token) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const content = `
      <h2 style="color:#001F5E;">Verify Your Email</h2>
      <p style="color:#555;">Hi <strong>${name}</strong>, please verify your email address.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${verifyUrl}" style="background:linear-gradient(135deg,#001F5E,#003d9e);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Verify Email</a>
      </div>
      <p style="color:#999;font-size:12px;">This link expires in 24 hours. If you did not register, ignore this email.</p>`;
    await this.send({ to: email, subject: '✅ Verify Your Email - Bharat AI Olympiad', html: this.getBaseTemplate(content, 'Verify Email') });
  }

  async sendPasswordReset(email, name, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const content = `
      <h2 style="color:#001F5E;">Password Reset Request</h2>
      <p style="color:#555;">Hi <strong>${name}</strong>, you requested a password reset.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${resetUrl}" style="background:linear-gradient(135deg,#FF8C00,#e67e00);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Reset Password</a>
      </div>
      <p style="color:#999;font-size:12px;">This link expires in 10 minutes. If you did not request this, ignore this email.</p>`;
    await this.send({ to: email, subject: '🔐 Password Reset - Bharat AI Olympiad', html: this.getBaseTemplate(content, 'Password Reset') });
  }

  async sendResultNotification(student, olympiadTitle, rank) {
    const content = `
      <h2 style="color:#001F5E;">Your Result is Published! 📊</h2>
      <p style="color:#555;">Hi <strong>${student.fullName}</strong>, results for <strong>${olympiadTitle}</strong> are now available.</p>
      <div style="background:#f0fff4;border-left:4px solid #0B7F3B;padding:15px;margin:20px 0;border-radius:4px;">
        <p style="margin:0;"><strong>Rank:</strong> ${rank}</p>
        <p style="margin:5px 0 0;"><strong>Roll Number:</strong> ${student.rollNumber}</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.FRONTEND_URL}/results" style="background:linear-gradient(135deg,#0B7F3B,#0a6d32);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">View Result</a>
      </div>`;
    await this.send({ to: student.email, subject: `🏆 Result Published - ${olympiadTitle}`, html: this.getBaseTemplate(content, 'Result Published') });
  }
}

module.exports = new EmailService();
