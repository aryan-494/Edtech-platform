const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


// resetPassowordtoken 
exports.resetPasswordToken = async (req, res) => {
    try {
        // get email from the req body 
        const email = req.body.email;

        // check user for this email , email validation 
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "Your Email is not registerd with us "
            });
        }

        // generate token 
        const token = crypto.randomUUID();

        // update user by adding token and expiration time 
        const upadteDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );

        // create mail containing the url 
        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(
            email,
            "Password Reset Link",
            `Password reset link : ${url}`
        );

        // return response 
        return res.json({
            success: true,
            message: "Email sent Successfully , Please check email and change password"
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "somthing went wrong while sending reset password mail"
        });
    }
};




// restPassword 
exports.resetPassword = async (req, res) => {

    try {
        // data fetch 
        const { password, confirmPassword, token } = req.body;

        // validation 
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "password not matching ",
            });
        }

        // get userdetails form db using token 
        const userDetails = await User.findOne({ token: token });

        // if no enrty - invaild token 
        if (!userDetails) {
            return res.josn({
                success: false,
                message: "Token is invalid ",
            });
        }

        // token time check 
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired , please regenrate your token ",
            });
        }

        // hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // password update 
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        );

        // retrun res 
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong while sending the reset password mail"
        });
    }
};
