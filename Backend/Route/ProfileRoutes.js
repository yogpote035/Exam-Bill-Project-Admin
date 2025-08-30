const express = require("express");
const router = express.Router();
const ProfileController = require("../Controllers/ProfileController/ProfileController");
const VerifyToken = require("../Middleware/VerifyToken");

router.get("/", VerifyToken, ProfileController.getProfile); //both role
router.put("/", VerifyToken, ProfileController.updateProfile); //both role

router.post("/change-password/send-otp", ProfileController.sendOtp);
router.post("/change-password/verify-otp", ProfileController.verifyOtpAndReset);

module.exports = router;
