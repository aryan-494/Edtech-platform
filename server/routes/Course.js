const express = require("express");
const router = express.Router();

// ------------------- Course Controllers -------------------
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

// ------------------- Category Controllers -------------------
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,   // ✅ Correct function name
} = require("../controllers/Category");

// ------------------- Section Controllers -------------------
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// ------------------- SubSection Controllers -------------------
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// ------------------- Rating Controllers -------------------
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

// ------------------- Course Progress -------------------
const {
  updateCourseProgress,
} = require("../controllers/courseProgress");

// ------------------- Middlewares -------------------
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/Auth");


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);

// Add Section
router.post("/addSection", auth, isInstructor, createSection);

// Edit Section
router.post("/updateSection", auth, isInstructor, updateSection);

// Delete Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Add Subsection
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Edit Subsection
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete Subsection
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Get All Courses
router.get("/getAllCourses", getAllCourses);

// Get Single Course Details
router.post("/getCourseDetails", getCourseDetails);

// Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


// ********************************************************************************************************
//                                      Category Routes
// ********************************************************************************************************

// Create Category
router.post("/createCategory", auth, isAdmin, createCategory);

// Show All Categories
router.get("/showAllCategories", showAllCategories);

// Category Page Details
router.post("/getCategoryPageDetails", categoryPageDetails);



// ********************************************************************************************************
//                                      Rating Routes
// ********************************************************************************************************

// Create Rating
router.post("/createRating", auth, isStudent, createRating);

// Get Average Rating
router.get("/getAverageRating", getAverageRating);

// Get All Rating
router.get("/getReviews", getAllRating);


module.exports = router;
