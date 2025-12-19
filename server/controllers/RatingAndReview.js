const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");


// Creating rating 
exports.createRating = async (req, res) => {
    try {
        // get user id 
        const userId = req.user.id;

        // fetching data from req body 
        const { rating, review, courseId } = req.body;

        // check if user is ennrolled or not 
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }

        // check if user already reviewed the course 
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "course is lalready reviewed by the user . "
            });
        }

        // creating rating and review 
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });

        // update course with this rating / review 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true }
        );

        console.log(updatedCourseDetails);

        // return response 
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully ",
            ratingReview,
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// getAveragerating 
exports.getAverageRating = async (req, res) => {
    try {
        // get course id 
        const courseId = req.body.courseId;

        // calculate avg rating 
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ]);

        // return rating 
        if (result.lenght > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // if there is no rating exist 
        return res.status(401).json({
            success: false,
            message: "there is no rating so avg can't be get decided based on 0 rating , so please Rate first",
            averageRating: 0,
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// getAllRatingAndReveiw
exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched sucessfully ",
            data: allReviews,
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
