import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/APIResponse";

async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verification Email",
      react: VerificationEmail({ username, otp }),
    });
    return { success: true, message: "Email sent successfully!" };
  } catch (err) {
    console.error("error sending email", err);

    return { success: false, message: "Error sending email" };
  }
}

export default sendVerificationEmail;
