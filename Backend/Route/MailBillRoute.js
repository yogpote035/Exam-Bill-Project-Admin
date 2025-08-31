const express = require("express");
const router = express.Router();
const billController = require("../Controllers/BillControllers/MaillBill");
const VerifyToken = require("../Middleware/VerifyToken");

// mail personal bill
router.get(
  "/personalBill/:id",
  VerifyToken,
  billController.mailPersonalBillsSelf
);
router.post(
  "/personalBill/other/:id",
  VerifyToken,
  billController.mailPersonalBillsOther
);
// mail main bill
router.get("/mainBill/:id", VerifyToken, billController.mailMainBillSelf);

router.post(
  "/mainBill/other/:id",
  VerifyToken,
  billController.mailMainBillOther
);

module.exports = router;
