const express = require("express");
const router = express.Router();

const { auth, isInstructor } = require("../middlewares/Auth");

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);

// Update Profile
router.put("/updateProfile", auth, updateProfile);

// Get All User Details
router.get("/getUserDetails", auth, getAllUserDetails);

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// Update Display Picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

// Instructor Dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);


module.exports = router;
