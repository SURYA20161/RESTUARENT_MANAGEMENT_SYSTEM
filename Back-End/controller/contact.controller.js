import { sendMail } from "../services/emailService.js";

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email content
    const subject = `Contact Form Submission from ${name}`;
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Send email to your email (or a support email)
    await sendMail("ravichandransurya040@gmail.com", subject, htmlContent);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
