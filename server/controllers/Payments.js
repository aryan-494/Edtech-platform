const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");


// capture the payment and initiate the razorpay order
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
