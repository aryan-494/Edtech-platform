// we want to send mail to user when user register or reset password
// which we are doing in otp model
// so we will create a utility function for sending mail

const nodemailer = require('nodemailer');

const mailSender = async (email , title , body )=>{
    try{
        // create transporter
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }


        })

        let info = await transporter.sendMail({
            from:'StudyNotion|| Aryan Mishra ',
            to:`${email}`,
            subject:`${title}`,
            html:`<h1>${body}</h1>`
        })
        console.log(info);
        return info;

    }
    catch (erorr){
        console.log("Error in mail sender utility", erorr.massage);
    }
}
module.exports = mailSender;