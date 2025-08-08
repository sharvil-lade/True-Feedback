import { transporter } from "@/lib/nodemailer"; // Import your transporter
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";
import React from "react";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = await render(
      React.createElement(VerificationEmail, { username, otp: verifyCode })
    );
    // Send the email
    await transporter.sendMail({
      from: `"True Feedback" <${process.env.EMAIL}>`, // Use your email
      to: email,
      subject: "Verify your email address",
      html: emailHtml,
    });

    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: (error as Error).message || "Error sending verification email",
    };
  }
}
