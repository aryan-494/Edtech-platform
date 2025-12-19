const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const Profile = require("../models/Profile");
const emialTemplate=require("../mail/templates/emailVerificationTemplate");
const mailSender = require("../utils/mailSender");
const passwordUpdated = require("../mail/templates/passwordUpdate");



// send otp 
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("➡️ Email received:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ email });
    console.log("👤 Existing user:", existingUser);

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("🔐 Generated OTP:", otp);

    await OTP.deleteMany({ email });
    console.log("🧹 Old OTPs deleted");

    const otpEntry = await OTP.create({ email, otp });
    console.log("✅ OTP saved in DB:", otpEntry);

    await mailSender(
      email,
      "Your OTP for verification",
      otp
    );
    console.log("📧 OTP email sent");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });

  } catch (error) {
    console.error("❌ SEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};


// sign up 
exports.signUp = async (req , res)=>{
    try{
        // fetch data from the req body 
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // validate 
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required to fill "
            })
        }

        // password match
        if (password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:'password and confirmPassword value does not match , please try again',
            })
        }

        // check user already exists
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });
        }

        // find the most recent OTP stored for the user 
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        // validate otp
        if (recentOtp.length == 0){
            return res.status(400).json({
                success:false,
                message:"OTP not found ",
            })
        }
        else if (otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invaild OTP",
            });
        }

        // Hash Password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // entry in Db   
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        // return res 
        return res.status(200).json({
            success:true,
            message:"User is registerd successfuly ",
            user,
        })

    } catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registerd , Please try again",
        });
    }
}



// login 
exports.login = async (req,res)=>{
    try{
        // get data from the req body 
        const {email,password}= req.body;

        // validate data 
        if (!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required , please try again ",
            });
        }

        // user check exist or not 
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registred , please sign up first .",
            });
        }

        // generate Jwt , after password matching 
        if (await bcrypt.compare(password , user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET, {
                expiresIn:"2h",
            });

            user.token = token ;
            user.password = undefined;

            // create cookie and send response 
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully ",
            })
        }

        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Error while loging in , please try again",
        });
    }
}



// change password 

exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(req.user.id, {
      password: encryptedPassword,
    });

    // ✅ Send email (do NOT break API if mail fails)
    try {
      await mailSender(
        userDetails.email,
        "Your password has been updated",
        passwordUpdated(
          userDetails.email,
          `${userDetails.firstName} ${userDetails.lastName}`
        )
      );
      console.log("📧 Password update email sent");
    } catch (mailError) {
      console.log("⚠️ Email failed but password updated");
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
    });
  }
};
