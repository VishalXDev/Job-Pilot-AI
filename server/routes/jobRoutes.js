const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");
const protect = require("../middleware/auth");

router.use(protect); // protect all routes

router.post("/", createJob);         // Create
router.get("/", getJobs);            // Read all
router.get("/:id", getJobById);      // Read one
router.put("/:id", updateJob);       // Update
router.delete("/:id", deleteJob);    // Delete

module.exports = router;
