const Job = require("../models/Job");

// ✅ Create Job
exports.createJob = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const job = await Job.create({ ...req.body, user: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    console.error("❌ Error creating job:", err.message);
    res.status(500).json({ message: "Server error while creating job" });
  }
};

// ✅ Get all jobs for the authenticated user
exports.getJobs = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const jobs = await Job.find({ user: req.user._id }).sort({ dateApplied: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err.message);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};

// ✅ Get single job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }
    res.json(job);
  } catch (err) {
    console.error("❌ Error fetching job by ID:", err.message);
    res.status(500).json({ message: "Server error while fetching job" });
  }
};

// ✅ Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }
    res.json(job);
  } catch (err) {
    console.error("❌ Error updating job:", err.message);
    res.status(500).json({ message: "Server error while updating job" });
  }
};

// ✅ Delete job
exports.deleteJob = async (req, res) => {
  try {
    const deleted = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting job:", err.message);
    res.status(500).json({ message: "Server error while deleting job" });
  }
};
