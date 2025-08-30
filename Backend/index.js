const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./Middleware/ConnectToDatabase");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  //   "https://click2-hire-remote-job-platform.vercel.app",
  //   "https://click2-hire-remote-job-platform-click2hires-projects.vercel.app",
  //   "https://click2-hire-remote-job-platform-git-main-click2hires-projects.vercel.app",
  //   "https://click2-hire-remote-job-platform-r0iq7z4zu-click2hires-projects.vercel.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 CORS Origin Check:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.error("❌ CORS Rejected:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.get("/health", (req, res) => res.status(200).send("ok"));
app.head("/health", (req, res) => res.status(200).send("ok"));

app.get("/", (req, res) => {
  res.json("Welcome to TripUp Backend Development!");
});

app.use("/api/admin", require("./Route/AuthenticationRoute"));
app.use("/api/admin/bill", require("./Route/BillRouteRoute"));
app.use("/api/admin/mail", require("./Route/MailBillRoute"));
app.use("/api/admin/teacher", require("./Route/TeachersRoute"));
app.use("/api/admin/download", require("./Route/DownloadBillRoute"));
app.use("/api/admin/profile", require("./Route/ProfileRoutes"));
// Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT} ⛳`);
});
