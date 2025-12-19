const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();


// auth middleware
exports.auth = async (req, res, next) => {
  try {
    // extract token from cookie / body / header
    const token =
      req.cookies?.token ||
      req.body.token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    // if token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      // verify token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decode);
      req.user = decode; // attach info to req.user
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating token",
    });
  }
};



// isStudent 
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }

    next(); // VERY IMPORTANT
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};


// isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This route is for Instructors only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};


// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
