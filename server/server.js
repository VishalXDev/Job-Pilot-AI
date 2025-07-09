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

// === TRUST PROXY IF BEHIND VERCEL/RENDER ===
app.set("trust proxy", 1);

// === ENHANCED CORS CONFIG ===
const allowedOrigins = [
  "https://job-pilot-ai.vercel.app", // ✅ deployed frontend
  "http://localhost:3000",            // ✅ local frontend
];

app.use((req, res, next) => {
  console.log("🔍 Incoming Origin:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS: " + origin));
      }
    },
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

// === MONGODB CONNECTION ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// === CRON JOB: Send reminders every day at 9 AM ===
cron.schedule("0 9 * * *", sendInterviewReminders);
