const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.updateProfile = async (req, res) => {

    try {
        // get data 
        const { dateOfBirth = "", about = "", contactNumber="", gender="" } = req.body;

        // get user id 
        const id = req.user.id;

        // validation 
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: true,
                message: "all feild required ",
            });
        }

        // find profile 
        // usershcema -> additiondeatils -> profiledetails 
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile 
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        // return response 
        return res.status(200).json({
            success: true,
            mesasge: "Profile Updated Successfully ",
            profileDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// delete account 

// explore how can we schedule this deletion operation 
exports.deleteAccount = async (req, res) => {
    try {
        // get id 
        const id = req.user.id;

        // validation 
        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "user not found ",
            });
        }

        // delete profile 
        await Profile.findByIdAndDelete({ _id: userDetails.additionaldetails });

        //HW :  unenroll user from the all entrolled courses 

        // delete User 
        await User.findByIdAndDelete({ _id: id });

        // return res 
        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Problem while deleting the User"
        });
    }
};



exports.getAllUserDetails = async (req, res) => {
    try {
        // get id 
        const id = req.user.id;

        // validation and get user details 
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);

        // retun res 
        return res.status(200).json({
            success: true,
            mesasge: "user details fetched successfully",
            data:userDetails,
        });
        

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "problem while getAllUserDeatils",
        });
    }
};
const cloudinary = require("cloudinary").v2;

exports.updateDisplayPicture = async (req, res) => {
   try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.instructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await Course.find({ instructor: instructorId })
      .populate("courseContent")
      .populate("studentsEnrolled")
      .exec();

    return res.status(200).json({
      success: true,
      data: courses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
