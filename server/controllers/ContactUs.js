const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

// contact us controller (handler)
exports.contactUsController = async (req, res) => {
    try {
        // extract data from req body
        const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

        // validation
        if (!firstname || !lastname || !email || !phoneNo || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // contact us email logic
        const response = await mailSender(
            email,
            "Your message is received",
            `We have received your message: ${message}`
        );

        console.log("Email sent:", response);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.log("Error in contact us:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to send message, try again later"
        });
    }
};
