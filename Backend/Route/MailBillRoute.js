const express = require("express");
const router = express.Router();
const billController = require("../Controllers/BillControllers/MaillBill");
const VerifyToken = require("../Middleware/VerifyToken");

// mail personal bill
router.get(
  "/mail/personalBill/:id",
  VerifyToken,
  billController.mailPersonalBillsSelf
);
router.post(
  "/mail/personalBill/other/:id",
  VerifyToken,
  billController.mailPersonalBillsOther
);
// mail main bill
router.get("/mail/mainBill/:id", VerifyToken, billController.mailMainBillSelf);

router.post(
  "/mail/mainBill/other/:id",
  VerifyToken,
  billController.mailMainBillOther
);

module.exports = router;
