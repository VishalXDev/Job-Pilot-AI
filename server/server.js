// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");
require("dotenv").config();

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const sendInterviewReminders = require("./utils/emailReminder");

const app = express();

// === MIDDLEWARE ===
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// === ROUTES ===
app.get("/", (req, res) => {
  res.send("✅ JobPilot API backend is running.");
});
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// === SERVE FRONTEND (Production Only) ===
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// === MONGODB CONNECTION ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === CRON JOB (Reminder Emails at 9 AM daily) ===
cron.schedule("0 9 * * *", sendInterviewReminders);
