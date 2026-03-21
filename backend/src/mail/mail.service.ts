import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendGuardianSessionAlert(
    guardianEmail: string,
    guardianName: string,
    studentName: string,
    durationMinutes: number,
  ) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Learning Activity Alert</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;padding:0 16px;">

    <!-- Card -->
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:36px 30px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:1px;">EduSpark</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;letter-spacing:0.5px;">LEARNING ACTIVITY ALERT</p>
      </div>

      <!-- Body -->
      <div style="padding:32px 30px;">
        <p style="color:#111827;font-size:16px;margin:0 0 16px;">Hi <strong>${guardianName}</strong>,</p>

        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
          We noticed that <strong>${studentName}</strong> recently left EduSpark after only
          <strong>${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''}</strong> of learning today.
          They are currently <strong>not active</strong> on the platform.
        </p>

        <!-- Alert Banner -->
        <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:16px 20px;border-radius:6px;margin:0 0 24px;">
          <p style="color:#92400E;margin:0;font-size:14px;line-height:1.6;">
            <strong>Short session detected:</strong> Studies show that consistent daily sessions
            of at least 30 minutes significantly improve learning outcomes. Encourage
            <strong>${studentName}</strong> to continue today!
          </p>
        </div>

        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
          A quick check-in from you can make a big difference. Ask them what they were learning
          and encourage them to jump back in!
        </p>

        <!-- Tips Box -->
        <div style="background:#EFF6FF;border-radius:10px;padding:20px 24px;margin:0 0 24px;">
          <p style="color:#1E40AF;font-weight:bold;margin:0 0 12px;font-size:15px;">Tips to keep ${studentName} engaged:</p>
          <ul style="color:#374151;margin:0;padding-left:20px;font-size:14px;line-height:2;">
            <li>Set a consistent study time each day</li>
            <li>Celebrate their points and quiz achievements</li>
            <li>Ask them to teach you something they learned</li>
            <li>Make it fun — turn lessons into a family challenge!</li>
          </ul>
        </div>

        <p style="color:#9CA3AF;font-size:13px;line-height:1.6;margin:0;">
          You're receiving this email because you are registered as a guardian on EduSpark.
          We send these alerts when a session is shorter than 30 minutes to help you stay involved
          in your child's learning journey.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 30px;text-align:center;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;">© ${new Date().getFullYear()} EduSpark &mdash; Empowering Young Learners</p>
      </div>

    </div>
  </div>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: `"EduSpark" <${process.env.MAIL_USER}>`,
        to: guardianEmail,
        subject: `${studentName} left EduSpark after only ${durationMinutes} min`,
        html,
      });
    } catch (error) {
      this.logger.error(`Failed to send session alert email to ${guardianEmail}`, error);
    }
  }
}
