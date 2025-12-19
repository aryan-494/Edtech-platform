const User = require("../models/User");
const Tag = require("../models/tags");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Category = require("../models/Category");
const { convertSecondsToDuration } = require("../utils/secToDuration")


// create course ka handler function 
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id

    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status = "Draft",
      instructions,
    } = req.body

    const thumbnail = req.files?.thumbnail

    // ✅ VALIDATION
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      })
    }

    // ✅ Instructor check
    const instructorDetails = await User.findById(userId)
    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      })
    }

    // ✅ Category check
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    // ✅ Upload thumbnail
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )

    // ✅ CREATE COURSE
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: [tag],                 // 👈 wrap in array
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions: [instructions],
    })

    // ✅ Push course to instructor
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } }
    )

    // ✅ Push course to category
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } }
    )

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}

//  getAllCourses Handler function 
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "data for all courses fetched successfully ",
            data: allCourses,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "can not fetch course data ",
            error: error.message,
        });
    }
};


// getcourseDetails 
exports.getCourseDetails = async (req, res) => {
    try {
        // get id 
        const { courseId } = req.body;

        // find course deatils 
        const courseDetails = await Course.find(
            { _id: courseId }
        ).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            }
        }).populate("category")
        .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            }).exec();

        // valiadtion 
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `could not get the course with ${courseId}`,
            });
        }
     
        // return res 
        return res.status(200).json({
            success: true,
            message: "course details fetched successfully",
            data:{
                courseDetails,
                
            }
            
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
