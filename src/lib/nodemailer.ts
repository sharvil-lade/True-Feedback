import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD; // App password, not regular Gmail password

if (!EMAIL || !PASSWORD) {
  throw new Error("Missing EMAIL or PASSWORD in environment variables.");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates (optional)
  },
});
