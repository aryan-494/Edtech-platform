const express = require("express");
const router = express.Router();

const { capturePayment, verifySignature } = require("../controllers/Payments");
const { auth, isStudent } = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Payment routes
// ********************************************************************************************************

// Capture payment → create Razorpay order
router.post("/capturePayment", auth, isStudent, capturePayment);

// Verify payment signature (Razorpay webhook)
router.post("/verifyPayment", auth, isStudent, verifySignature);


module.exports = router;
