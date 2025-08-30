const BillModel = require("../../Model/BillModel");
const UserModel = require("../../Model/UserModel");

// Get all teachers
const getAllTeachers = async (req, res) => {
  console.log("Request to get all teachers");

  try {
    // Optional: Check if user has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const teachers = await UserModel.find({ role: 'teacher' }).sort({ createdAt: -1 });
    res.json({ success: true, data: teachers });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ success: false, error: "Server error while fetching teachers" });
  }
};

// Get single teacher
const getSingleTeacher = async (req, res) => {
  console.log("Request to get teacher by id");

  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Teacher ID is required" });
    }

    const teacher = await UserModel.findById(id);
    if (!teacher) {
      return res.status(404).json({ success: false, error: "Teacher not found" });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ success: false, error: "Server error while fetching teacher" });
  }
};

// Get all bills by teacher
const getAllBillsByTeacher = async (req, res) => {
  console.log("Request to get bills by teacher id");

  try {
    const teacherId = req.params.id;
    if (!teacherId) {
      return res.status(400).json({ success: false, message: "Teacher ID is required" });
    }

    // Verify teacher exists
    const teacher = await UserModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, error: "Teacher not found" });
    }

    const bills = await BillModel.find({ userId: teacherId }).sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      data: bills,
      teacherInfo: {
        name: teacher.name,
        email: teacher.email
      }
    });
  } catch (error) {
    console.error("Error fetching teacher bills:", error);
    res.status(500).json({ success: false, error: "Server error while fetching bills" });
  }
};

module.exports = {
  getAllTeachers,
  getSingleTeacher,
  getAllBillsByTeacher
};