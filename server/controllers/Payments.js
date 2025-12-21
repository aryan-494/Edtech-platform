const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const {default: mongoose} = require("mongoose");
const { FaExclamationCircle } = require("react-icons/fa");


exports.capturePayment = async (req, res) =>  {

    const {courses} = req.body;
    const userId = req.user.id;

    if (courses.lenght === 0){
        return res.json({
            success:false ,
            message:"Plaese provide course id "}
        );
    }

    let totalAmount = 0;
    for (const course_id of courses){
        let course ;
        try{
            course = await Course.findById(course_id);
            if (!course){
                return res.status(200).json({
                    success:false ,
                    message:"could not find the course"
                });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)){
                return res.status(200).json({success:false , message:"Student is already Enrolled"});

            }
            totalAmount +=course.price;

        }
        catch(error){
            console.log(error);
            return res.status(500).json({success:false , message:error.message});
        }
    }

    const options = {
        amount : totalAmount * 100 ,
        currency : "INR",
        reciept : Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            mesasge:paymentResponse,

        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false , message:"could not initiate Order"})
    }


}

exports.verifyPayment = async (req , res ) =>{
      

    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id ;


    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(200).json({success:false , message:"Payment Failed "});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
             .createHmac ("sha256" , process.env.RAZORPAY_SECRET)
             .update(body.toString())
             .digest("hex");


   if(expectedSignature === razorpay_signature)   {
    // enroll the student 
    await enrollStudents(courses , userId , res)


    // return res 
    return res.status(200).json({success:true , message:"Payment verified"});

   }       
   return res.status(200).json({success:false , message:"payment failed" })
}

const enrollStudents = async (courses , userId , res)=>{

    if (!courses || !userId ){
        return res.status(400).json({success:false , message:"Please provide data for courses or userId " })

    }
    for (const courseId of courses ){
     try{
           // find the course and enroll the student 
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id : courseId},
            { $push:{
                    studentsEnrolled:userId
                }},
                {new:true},

        )
        if (!enrolledCourse){
            return res.status(500).json({success:false , message:"Course not Found"})
        }

        // find the user and update this course in their list 
        const enrolledStudent = await User.findByIdAndUpdate(userId,
        {$push:{
            courses : courseId,
        }}, {new:true}, ) 
    

        // send Mail to student that he is now succesfully enrolled for the course 
        const emailResponse = await mailSender(
            enrolledStudent.email,
            `successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName , `${enrolledStudent.firstName}`)
        )
        console.log("email sent sucessfully " , emailResponse.response);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false , message:error.message});
    }

     }
}












/* // capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {

    // get userid and courseid 
    const { course_id } = req.body;
    const userId = req.user.id;

    // validation 
    if (!course_id) {
        return res.json({
            seccess: false,
            message: "Please provide vaild course ID ",
        });
    };

    // validate courseDetails 
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: "could not find the course ",
            });
        }

        // check whether user already payed for the same course 
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }


    // create order
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        }
    };

    try {
        // initiate the payment using razor pay 
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        // return res 
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });

    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "could not initiate order"
        })
    }
};



// verify Signature of RazorPay And Server 
exports.verifySignature = async (req, res) => {

    // we made secret signature in server
    const webhookSecret = "12345678";

    // razorpay made secret signature 
    const signature = req.headers("x-razorpay-signature");

    const shasun = crypto.createHmac("sha256", webhookSecret);
    shasun.update(JSON.stringify(req.body));
    const digest = shasun.digest("hex");

    if (signature === digest) {
        console.log("Payment is Authorised");

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            // fullfill the action 
            // find the course and email the student in it 
            const enrolledCourse = await Course.findByIdAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            );

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found ",
                });
            }

            console.log(enrolledCourse);

            // find the student and add the course to their list enrolled courses me 
            const enrolledStudent = await User.findByIdAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true },
            );

            if (!enrolledStudent) {
                return res.status(500).json({
                    success: false,
                    message: "Student not found ",
                });
            }

            console.log(enrolledStudent);

            // mail send krna for the confirmation 
            const mailResponse = await mailSender(
                enrolledStudent.email,
                "congratulations for codehelp ",
                "congratulations , you are now enroled for the course ",
            );
            console.log(mailResponse);

            return res.status(200).json({
                success: true,
                message: "Signature verified and Course Added"
            });

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: true,
                message: error.message,
            });
        }

    }
    else {
        return res.status(400).json({
            success: false,
            message: "Invaild request  ",
        });
    }
};
 */