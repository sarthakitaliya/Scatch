const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true, 
    port: 465,
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS // Your email password or app password
    }
});

const sendOrderUpdateEmail = (userEmail, orderId, newStatus) => {
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Update on Your Order Status',
        html: `
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                    <h1 style="color: #007BFF; text-align: center;">Scatch</h1>
                    <h2 style="color: #007BFF;">Order Status Update</h2>
                    <p>Dear Customer,</p>
                    <p>We wanted to let you know that the status of your order <strong>ID: ${orderId}</strong> has been updated to: <strong style="color: green;">${newStatus}</strong>.</p>
                    <p>If you have any questions or need further assistance, feel free to reply to this email or contact our <a href="mailto:support@scatch.com" style="color: #007BFF;">customer support</a>.</p>
                    <p> Thank you for shopping with us! </p>
                    <p>Best regards,<br>The Scatch Team</p>
                </div>
            </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendOrderUpdateEmail;
