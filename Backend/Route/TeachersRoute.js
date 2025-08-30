const express = require("express");
const router = express.Router();
const TeacherController = require("../Controllers/BillControllers/Teachers");
const VerifyToken = require("../Middleware/VerifyToken");

router.get("/teachers", VerifyToken, TeacherController.getAllTeachers);
router.get("/teacher/:id", VerifyToken, TeacherController.getSingleTeacher);
router.get(
  "/teacher/bills/:id",
  VerifyToken,
  TeacherController.getAllBillsByTeacher
);

module.exports = router;
