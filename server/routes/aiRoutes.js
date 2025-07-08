const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Resume Suggestion Route
router.post("/resume", async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  try {
    const prompt = `Analyze this resume:\n${resumeText}\n\nFor this job:\n${jobDescription}\n\nSuggest improvements to make the resume better for the role.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content.trim();
    res.json({ result });
  } catch (err) {
    console.error("Resume AI Error:", err.message);
    res.status(500).json({ error: "Failed to generate resume suggestions" });
  }
});

// Cover Letter Route
router.post("/cover-letter", async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  try {
    const prompt = `Using this resume:\n${resumeText}\n\nAnd this job description:\n${jobDescription}\n\nWrite a personalized cover letter tailored to this job.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content.trim();
    res.json({ result });
  } catch (err) {
    console.error("Cover Letter AI Error:", err.message);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

module.exports = router;
