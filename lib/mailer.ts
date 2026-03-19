import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    // Basic nodemailer config. To work in production, provide SMTP_USER and SMTP_PASS.
    // For local testing, providing credentials isn't strictly necessary if using something like Mailtrap
    // but we use actual settings from env arrays.
    
    // In dev without env vars, you can test it directly or just mock it.
    let transporter;
    
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback for dev testing if no env vars are set. We use a test ethereal account. 
        // Generates ethereal test account every time (great for local test).
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    const mailOptions = {
        from: `"Techexotica Support" <${process.env.SMTP_USER || "noreply@techexotica.com"}>`,
        to,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log preview URL if using ethereal
    if (!process.env.SMTP_USER) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    
    return info;
};
