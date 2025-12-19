const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");


const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // OTP expires in 5 minutes
    }
});


// NEver ever use thses two function inside the model because they get hitted before saveing entry in db s
/* 
// function to send OTP email
async function sendverificationEmail(email, otp) {
    try {
        await mailSender(
            email,
            "verification OTP from the studyNotion",
            emialTemplate(otp),
            
        );
    } catch (error) {
        console.log("Error in sending verification email", error);
        throw error;
    }
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendverificationEmail(this.email, this.otp);
	}
	next();
});
 */
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;