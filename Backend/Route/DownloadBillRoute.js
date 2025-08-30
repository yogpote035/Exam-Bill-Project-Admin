const express = require("express");
const router = express.Router();
const billController = require("../Controllers/BillControllers/DownloadBill");
const VerifyToken = require("../Middleware/VerifyToken");

// bank detail form
router.get(
  "/download/bank-detail-form",
  VerifyToken,
  billController.downloadBankDetailForm
);
router.get("/download/:id", VerifyToken, billController.downloadBill);
router.get(
  "/download/personalBill/:id",
  VerifyToken,
  billController.downloadPersonalBills
);

// add all teacher bill here later
module.exports = router;
