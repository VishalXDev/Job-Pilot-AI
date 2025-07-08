const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getResumeSuggestions = async (jobDescription, resumeText) => {
  const messages = [
    { role: "system", content: "You are a resume optimization expert." },
    {
      role: "user",
      content: `Based on the following job description and resume, suggest improvements:\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}\n\nSuggestions:`
    }
  ];

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    return res.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ Error in getResumeSuggestions:", err);
    return "Sorry, we couldn't generate suggestions at this time.";
  }
};

exports.generateCoverLetter = async (jobDescription, resumeText) => {
  const messages = [
    { role: "system", content: "You are a professional cover letter writer." },
    {
      role: "user",
      content: `Generate a personalized cover letter based on this resume and job description:\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}\n\nCover Letter:`
    }
  ];

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    return res.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ Error in generateCoverLetter:", err);
    return "Sorry, we couldn't generate the cover letter right now.";
  }
};
