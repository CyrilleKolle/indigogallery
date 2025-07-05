"server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

export async function sendEmailOtp(to: string, code: string) {
      if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${to}: ${code}`);
    return;
  }
  // TODO: Find another mail service
  await resend.emails.send({
    from: "noreply@yourdomain.com",
    to,
    subject: "Your one‑time code",
    html: `
      <p>Hi there!</p>
      <p>Your verification code for the family photo library is:</p>
      <h2 style="font-size: 24px; letter-spacing: 2px;">${code}</h2>
      <p>It expires in 10&nbsp;minutes. If you didn't try to sign in, you can ignore this e‑mail.</p>
      <p>✨ Witmailerh love,<br />The Photo Library</p>
    `,
  });
}