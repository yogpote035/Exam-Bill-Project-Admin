const BillModel = require("../../Model/BillModel");
const { format } = require("date-fns");
const nodemailer = require("nodemailer");



const mailMainBillSelf = async (req, res) => {
  console.log("📧 Mailing Main Bill to Self");
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

    // Get user email from authenticated user
    const userEmail = req.user.email; // Assuming user is authenticated and email is available

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Email_Password,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.Email,
      to: userEmail,
      subject: `Main Bill - ${bill.subject} - ${formattedDate}`,
      text: `Please find attached the main bill for ${bill.subject} examination held on ${formattedDate}.`,
      attachments: [
        {
          filename: `main_bill_${bill.subject}_${formattedDate}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Main bill sent to your email successfully" });
  } catch (err) {
    console.error("❌ Error mailing main bill:", err);
    res.status(500).send("Error mailing main bill");
  }
};

const mailMainBillOther = async (req, res) => {
  console.log("📧 Mailing Main Bill to Provided Email");
  let puppeteer, browser;
  try {
    const id = req.params.id;
    const { email } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Bill Id is missing" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
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

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Email_Password,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.Email,
      to: email,
      subject: `Main Bill - ${bill.subject} - ${formattedDate}`,
      text: `Please find attached the main bill for ${bill.subject} examination held on ${formattedDate}.`,
      attachments: [
        {
          filename: `main_bill_${bill.subject}_${formattedDate}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: `Main bill sent to ${email} successfully` });
  } catch (err) {
    console.error("❌ Error mailing main bill:", err);
    res.status(500).send("Error mailing main bill");
  }
};

// mail personal bills
const mailPersonalBillsSelf = async (req, res) => {
  console.log("📧 Mailing Personal Bills to Self");
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

            
          `;
          // add form code upside if need
          // <!-- Bank Details Form -->
          //   <div style="page-break-after: always;">
          //     <h1 style="text-align: center; text-decoration: underline; margin-bottom: 40px; font-size: 22px; font-weight: bold; letter-spacing: 2px;">BANK DETAILS</h1>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Nature of Payment :</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Name of Account Holder :</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Bank Name :</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Account No :</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">IFSC Code :</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Mobile No :</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Amount :</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //       <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Amount in Words:</span>
          //       <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //     </div>

          //     <div style="margin-top: 50px; display: flex; align-items: flex-end;">
          //       <span style="font-size: 16px; margin-right: 10px;">Signature:</span>
          //       <div style="width: 300px; border-bottom: 1px solid black; height: 40px;"></div>
          //     </div>
          //   </div>
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
          border: 1px solid #ccc; 
          background-color: #f9f9f9; 
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

    // Get user email from authenticated user
    const userEmail = req.user.email; // Assuming user is authenticated and email is available

    // Configure email transporter (example using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Email_Password,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.Email,
      to: userEmail,
      subject: `Personal Bills - ${bill.subject} - ${formattedDate}`,
      text: `Please find attached the personal bills for ${bill.subject} examination held on ${formattedDate}.`,
      attachments: [
        {
          filename: `personal_bills_${bill.subject}_${formattedDate}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Personal bills sent to your email successfully" });
  } catch (err) {
    console.error("❌ Error mailing personal bills:", err);
    res.status(500).send("Error mailing personal bills");
  }
};

const mailPersonalBillsOther = async (req, res) => {
  console.log("📧 Mailing Personal Bills to Provided Email");
  let puppeteer, browser;

  try {
    const { email } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Bill Id is missing" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
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

            
          `;
          //  <!-- Bank Details Form -->
          //    <div style="page-break-after: always;">
          //      <h1 style="text-align: center; text-decoration: underline; margin-bottom: 40px; font-size: 22px; font-weight: bold; letter-spacing: 2px;">BANK DETAILS</h1>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Nature of Payment :</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Name of Account Holder :</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Bank Name :</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Account No :</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">IFSC Code :</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Mobile No :</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Amount :</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="display: flex; align-items: center; margin-bottom: 25px; min-height: 30px;">
          //        <span style="font-size: 16px; font-weight: normal; min-width: 200px; flex-shrink: 0;">Amount in Words:</span>
          //        <div style="flex: 1; border-bottom: 1px solid black; height: 1px; margin-left: 10px;"></div>
          //      </div>

          //      <div style="margin-top: 50px; display: flex; align-items: flex-end;">
          //        <span style="font-size: 16px; margin-right: 10px;">Signature:</span>
          //        <div style="width: 300px; border-bottom: 1px solid black; height: 40px;"></div>
          //      </div>
          //    </div>
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
          border: 1px solid #ccc; 
          background-color: #f9f9f9; 
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

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Email_Password,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.Email,
      to: email,
      subject: `Personal Bills - ${bill.subject} - ${formattedDate}`,
      text: `Please find attached the personal bills for ${bill.subject} examination held on ${formattedDate}.`,
      attachments: [
        {
          filename: `personal_bills_${bill.subject}_${formattedDate}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: `Personal bills sent to ${email} successfully` });
  } catch (err) {
    console.error("❌ Error mailing personal bills:", err);
    res.status(500).send("Error mailing personal bills");
  }
};




module.exports = {
  // mail personal bill single pdf for all persons [self and other]
  mailPersonalBillsSelf,
  mailPersonalBillsOther,

  // mail Main bill single pdf summery [self and other]
  mailMainBillSelf,
  mailMainBillOther,
  // download bank form
};