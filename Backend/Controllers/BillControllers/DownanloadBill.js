const { validationResult, body } = require("express-validator");
const BillModel = require("../../Model/BillModel");
const { format } = require("date-fns");
const nodemailer = require("nodemailer");


function numberToWords(num) {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if ((num = num.toString()).length > 9) return "overflow";
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
      : "";
  return str.trim() + " Only";
}

const downloadBill = async (req, res) => {
  console.log("📄 Generating PDF Bill");
  let puppeteer, browser;

  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Bill Id is missing" });
    }

    // Fetch bill with staff details
    const bill = await BillModel.findById(id);
    if (!bill) return res.status(404).send("Bill not found");

    // College Header Info
    const society = "Progressive Education Society's";
    const college =
      "Modern College of Arts, Science, and Commerce (Autonomous),";
    const college2 = "Ganeshkhind, Pune - 411016";
    const logo =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiDX-TI_GWDRoSUoutAJU6HDoAwjH9sPY_PUd2yOYyYNdY6g6un5KNinkcCQmHdmuqIPg&usqp=CAU";

    // Batch Table
    const batchRow = `
      <tr>
        <th>Batch No</th>
        ${bill.batches.map((b, i) => `<th>${i + 1}</th>`).join("")}
        <th>Total</th>
      </tr>
      <tr>
        <td>No. of Students Present</td>
        ${bill.batches.map((b) => `<td>${b.studentsPresent}</td>`).join("")}
        <td>${bill.presentStudents}</td>
      </tr>
    `;

    // Staff Payments Table
    const staffRows = bill.staffPayments
      .map((sp, i) =>
        sp.persons
          .map(
            (p, j) => `
          <tr>
            <td>${j === 0 ? i + 1 : ""}</td>
            <td>${j === 0 ? sp.role : ""}</td>
            <td>${p.name}</td>
            <td>${p.rate} + ${p.extraAllowance || 0}</td>
            <td>${p.totalAmount}</td>
          </tr>`
          )
          .join("")
      )
      .join("");
    const examDate = new Date(bill?.examStartTime);
    const formattedDate = format(examDate, "dd MMMM yyyy, hh:mm a");

    const totalAmount = bill.totalAmount || 0;
    const amountInWords =
      bill.amountInWords || numberToWords(totalAmount).replace(/,/g, "");

    // Build PDF HTML
    const html = `
    <html>
    <head>
      <style>
        body { font-family: "Times New Roman", serif; margin: 20px; line-height: 1.5; }
        h2, h3 { text-align: center; margin: 10px 0; }
        h3 { text-decoration: underline; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 8px; text-align: center; font-size: 14px; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px; }
        .header img { height: 80px; display: block; margin: 0 auto 10px; }
        .society { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .college { font-size: 16px; font-weight: bold; margin: 3px 0; }
        .college-address { font-size: 14px; margin-top: 3px; }
        .signature { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature div { text-align: center; width: 30%; border-top: 1px solid black; padding-top: 5px; }
        .info-section { margin: 15px 0; }
        .info-section p { margin: 8px 0; }
        .total-row { font-weight: bold; }
        .amount-section { margin-top: 20px; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="society">${society}</div>
        <img src="${logo}" alt="College Logo" />
        <div class="college">${college}</div>
        <div class="college-address">${college2}</div>
      </div>

      <h3>${bill.examType} Examination Report (${bill.examSession || ""})</h3>

      <div class="info-section">
        <p><b>1) Name of the Department:</b> ${bill.department}</p>
        <p><b>2) Class:</b> ${bill.className}</p>
        <p><b>3) Total No. of present students:</b> ${bill.presentStudents}</p>
        <p><b>4) Total No. of batches:</b> ${bill.totalBatches}</p>
        <p><b>5) Duration of ${bill.examType} exam per batch:</b> ${
      bill.durationPerBatch
    } hrs</p>
         <p><b> Date :</b> ${formattedDate}</p>
         <p><b> Subject :</b> ${bill.subject}</p>
      </div>

      <table>${batchRow}</table>

      <h3>6) Statement of Staff Appointed and Remuneration Paid</h3>
      <table>
        <tr>
          <th>Sr. No.</th>
          <th>Particulars</th>
          <th>Name</th>
          <th>Rate (₹) + Allowance</th>
          <th>Total Amount (₹)</th>
        </tr>
        ${staffRows}
        <tr class="total-row">
          <td colspan="4" style="text-align:right;"><b>Total</b></td>
          <td><b>${totalAmount}</b></td>
        </tr>
      </table>

      <div class="amount-section">
        <p><b>Balance Payable:</b> ₹${totalAmount}.00 = ₹${totalAmount}/-</p>
        <p><b>(Amount in words):</b> ${amountInWords}</p>
      </div>

      <div class="signature">
        <div>In Charge</div>
        <div>Vice Principal</div>
        <div>Principal</div>
      </div>
    </body>
    </html>
    `;

    // Puppeteer Launch
    if (process.env.NODE_ENV === "production") {
      puppeteer = require("puppeteer-core");
      const chromium = require("@sparticuz/chromium");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      puppeteer = require("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "40px", left: "20px" },
    });

    await browser.close();

    // Stream PDF to client
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="bill_${bill.subject}_${formattedDate}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF generation error:", err);
    res.status(500).send("Error generating PDF");
  }
};
const downloadBankDetailForm = async (req, res) => {
  console.log("📄 Generating PDF Bank Detail Form");
  let puppeteer, browser;

  try {
    // Build PDF HTML
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bank Details Form</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            background-color: white;
            color: black;
            line-height: 1.6;
        }
        
        h1 {
            text-align: center;
            text-decoration: underline;
            margin-bottom: 40px;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        
        .form-row {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            min-height: 30px;
        }
        
        .label {
            font-size: 16px;
            font-weight: normal;
            min-width: 200px;
            flex-shrink: 0;
        }
        
        .line {
            flex: 1;
            border-bottom: 1px solid black;
            height: 1px;
            margin-left: 10px;
            position: relative;
        }
        
        .signature-row {
            margin-top: 50px;
            display: flex;
            align-items: flex-end;
        }
        
        .signature-label {
            font-size: 16px;
            margin-right: 10px;
        }
        
        .signature-line {
            width: 300px;
            border-bottom: 1px solid black;
            height: 40px;
            border: 1px solid black;
            border-top: none;
            border-left: none;
            border-right: none;
        }
        
        @media print {
            body {
                margin: 0.5in;
                padding: 0;
            }
            
            .form-row {
                page-break-inside: avoid;
            }
        }
        
        /* Hide any interactive elements for print */
        input, button {
            display: none;
        }
    </style>
</head>
<body>
    <h1>BANK DETAILS</h1>
    
    
    <div class="form-row">
        <span class="label">Name of Account Holder :</span>
        <div class="line"></div>
    </div>
    
    <div class="form-row">
        <span class="label">Bank Name :</span>
        <div class="line"></div>
    </div>
    
    <div class="form-row">
        <span class="label">Account No :</span>
        <div class="line"></div>
    </div>
    
    <div class="form-row">
        <span class="label">IFSC Code :</span>
        <div class="line"></div>
    </div>
    
    <div class="form-row">
        <span class="label">Mobile No :</span>
        <div class="line"></div>
    </div>
    
    <div class="form-row">
        <span class="label">Amount :</span>
        <div class="line"></div>
    </div>
    
    <div class="form-row">
        <span class="label">Amount in Words:</span>
        <div class="line"></div>
    </div>

    <div class="form-row">
        <span class="label">Nature of Payment(Optional) :</span>
        <div class="line"></div>
    </div>
    
    <div class="signature-row">
        <span class="signature-label">Signature:</span>
        <div class="signature-line"></div>
    </div>
</body>
</html>
    `;

    // Puppeteer Launch
    if (process.env.NODE_ENV === "production") {
      puppeteer = require("puppeteer-core");
      const chromium = require("@sparticuz/chromium");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      puppeteer = require("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "40px", left: "20px" },
    });

    await browser.close();

    // Stream PDF to client
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Bank_Detail_Form.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF generation error:", err);
    res.status(500).send("Error in Generating Bank Form PDF");
  }
};
const downloadPersonalBills = async (req, res) => {
  console.log("📄 Generating Personal Bills PDF");
  let puppeteer, browser;

  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Bill Id is missing" });
    }

    // Fetch bill with staff details
    const bill = await BillModel.findById(id);
    if (!bill) return res.status(404).send("Bill not found");

    // College Header Info
    const society = "Progressive Education Society's";
    const college =
      "Modern College of Arts, Science, and Commerce (Autonomous),";
    const college2 = "Ganeshkhind, Pune - 411016";
    const logo =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiDX-TI_GWDRoSUoutAJU6HDoAwjH9sPY_PUd2yOYyYNdY6g6un5KNinkcCQmHdmuqIPg&usqp=CAU";

    const examDate = new Date(bill?.examStartTime);
    const formattedDate = format(examDate, "dd MMMM yyyy, hh:mm a");

    // Generate HTML for each staff member with bank details form
    const personalBillsHTML = bill.staffPayments
      .flatMap((sp) =>
        sp.persons.map((person) => {
          const totalAmount = person.totalAmount;
          const amountInWords = numberToWords(totalAmount).replace(/,/g, "");

          return `
            <div style="page-break-after: always;">
              <div class="header">
                <div class="society">${society}</div>
                <img src="${logo}" alt="College Logo" />
                <div class="college">${college}</div>
                <div class="college-address">${college2}</div>
              </div>

              <h3>${bill.examType} Examination - Individual Bill (${
            bill.examSession || ""
          })</h3>

              <div class="info-section">
                <p><b>Staff Name:</b> ${person.name}</p>
                <p><b>Role:</b> ${sp.role}</p>
                <p><b>Department:</b> ${bill.department}</p>
                <p><b>Class:</b> ${bill.className}</p>
                <p><b>Subject:</b> ${bill.subject}</p>
                <p><b>Semester:</b> ${bill.semester}</p>
                <p><b>Exam Date:</b> ${formattedDate}</p>
              </div>

              <h3>Payment Details</h3>
              <table>
                <tr>
                  <th>Particulars</th>
                  <th>Details</th>
                  <th>Amount (₹)</th>
                </tr>
                <tr>
                  <td>No. of Present Students</td>
                  <td>${bill.presentStudents}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Rate per Student</td>
                  <td>₹${person.rate}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Base Amount</td>
                  <td>${bill.presentStudents} × ₹${person.rate}</td>
                  <td>₹${bill.presentStudents * person.rate}</td>
                </tr>
                <tr>
                  <td>Extra Allowance</td>
                  <td></td>
                  <td>₹${person.extraAllowance || 0}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="text-align:right;"><b>Total Amount</b></td>
                  <td><b>₹${totalAmount}</b></td>
                </tr>
              </table>

              <div class="amount-section">
                <p><b>(Amount in words):</b> ${amountInWords}</p>
              </div>

              <div class="signature">
                <div>Staff Signature</div>
                <div>In Charge</div>
                <div>Principal</div>
              </div>
            </div>

            <!-- Bank Details Form -->
            <div style="page-break-after: always;">
              <h1 style="text-align: center; text-decoration: underline; margin-bottom: 40px; font-size: 22px; font-weight: bold; letter-spacing: 2px;">BANK DETAILS</h1>          
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Name of Account Holder :</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Bank Name :</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Account No :</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">IFSC Code :</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Mobile No :</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Amount :</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Amount in Words:</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
                <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Nature of Payment(Optional) :</span>
                <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
              </div>

              <div style="margin-top: 50px; display: flex; align-items: flex-end;">
                <span style="font-size: 16px; margin-right: 10px;">Signature:</span>
                <div style="width: 300px; border-bottom: 1px solid black; height: 40px;"></div>
              </div>
            </div>
          `;
        })
      )
      .join("");

    // Build PDF HTML
    const html = `
    <html>
    <head>
      <style>
        body { 
          font-family: "Times New Roman", serif; 
          margin: 20px; 
          line-height: 1.5; 
        }
        h2, h3 { 
          text-align: center; 
          margin: 10px 0; 
        }
        h3 { 
          text-decoration: underline; 
          margin-top: 20px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 15px; 
        }
        table, th, td { 
          border: 1px solid black; 
        }
        th, td { 
          padding: 8px; 
          text-align: center; 
          font-size: 14px; 
        }
        th { 
          background-color: #f2f2f2; 
        }
        .header { 
          text-align: center; 
          margin-bottom: 20px; 
          border-bottom: 2px solid #000; 
          padding-bottom: 15px; 
        }
        .header img { 
          height: 80px; 
          display: block; 
          margin: 0 auto 10px; 
        }
        .society { 
          font-size: 18px; 
          font-weight: bold; 
          margin-bottom: 5px; 
        }
        .college { 
          font-size: 16px; 
          font-weight: bold; 
          margin: 3px 0; 
        }
        .college-address { 
          font-size: 14px; 
          margin-top: 3px; 
        }
        .signature { 
          margin-top: 50px; 
          display: flex; 
          justify-content: space-between; 
        }
        .signature div { 
          text-align: center; 
          width: 30%; 
          border-top: 1px solid black; 
          padding-top: 5px; 
        }
        .info-section { 
          margin: 15px 0; 
        }
        .info-section p { 
          margin: 8px 0; 
        }
        .total-row { 
          font-weight: bold; 
        }
        .amount-section { 
          margin-top: 20px; 
          padding: 10px; 
          border: 1px solid #000; 
        }
        @media print {
          .header { 
            page-break-before: avoid; 
          }
        }
      </style>
    </head>
    <body>
      ${personalBillsHTML}
    </body>
    </html>
    `;

    // Puppeteer Launch
    if (process.env.NODE_ENV === "production") {
      puppeteer = require("puppeteer-core");
      const chromium = require("@sparticuz/chromium");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      puppeteer = require("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "40px", left: "20px" },
    });

    await browser.close();

    // Stream PDF to client
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="personal_bills_${bill.subject}_${formattedDate}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ Personal bills PDF generation error:", err);
    res.status(500).send("Error generating personal bills PDF");
  }
};





module.exports = {
  // download bill
  downloadBill,
  // download personal bill single pdf for all persons
  downloadPersonalBills,
  // download bank form
  downloadBankDetailForm,
};