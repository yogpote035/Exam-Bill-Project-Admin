const express = require("express");
const router = express.Router();
const BillController = require("../Controllers/BillControllers/Bill");
const VerifyToken = require("../Middleware/VerifyToken");

router.get("/", VerifyToken, BillController.getBills);
router.get("/:id", VerifyToken, BillController.getBillById);
router.put("/:id", VerifyToken, BillController.updateBill);
router.delete("/:id", VerifyToken, BillController.deleteBill);

module.exports = router;
