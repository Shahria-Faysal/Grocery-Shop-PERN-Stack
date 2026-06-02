const sendEmail = async (options) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        if (!BREVO_API_KEY) {
            console.error("Missing BREVO_API_KEY environment variable");
            throw new Error("Missing Email Api Key");
        }

        const data = {
            sender: {
                name: "Grocery Shop",
                email: process.env.EMAIL_USER
            },
            to: [{ email: options.email }],
            subject: options.subject,
            htmlContent: options.message
        };

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Email sent successfully", result.messageId);
            return true;
        } else {
            console.error("Error sending email:", result.message);
            throw new Error(result.message || "Could not send email");
        }
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Could not send email");
    }
};

export default sendEmail;