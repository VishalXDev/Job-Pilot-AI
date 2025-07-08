const sgMail = require('@sendgrid/mail');
const Job = require("../models/Job");
const User = require("../models/User");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInterviewReminders = async () => {
  try {
    const jobs = await Job.find({ status: "Interview" }).populate("user");

    if (!jobs.length) {
      console.log("📭 No interview reminders to send.");
      return;
    }

    for (let job of jobs) {
      const msg = {
        to: job.user.email,
        from: process.env.EMAIL_SENDER,
        subject: `📅 Interview Reminder: ${job.position} at ${job.company}`,
        text: `Hi ${job.user.name},\n\nThis is a reminder for your interview with ${job.company} for the role of ${job.position}.\n\nNotes: ${job.notes || "No notes provided"}\n\nAll the best!\n\n— Job Tracker`,
      };

      try {
        await sgMail.send(msg);
        console.log(`✅ Reminder sent to ${job.user.email}`);
      } catch (err) {
        console.error(`❌ Failed to send to ${job.user.email}:`, err.message);
      }
    }
  } catch (err) {
    console.error("❌ Error fetching interview jobs:", err);
  }
};

module.exports = sendInterviewReminders;
