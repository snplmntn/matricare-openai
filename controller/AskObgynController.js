const openai = require("../connection");
const catchAsync = require("../utils/catchAsync");

// Answer user questions as a professional OB-GYN with real-world data and sources
const answer_obgyn_question = catchAsync(async (req, res, next) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const messages = [
    {
      role: "system",
      content: `You are a professional OB-GYN and data analyst. Answer user questions with accurate, up-to-date, and well-researched information. Use real-world data and cite reputable sources such as CDC, Mayo Clinic, WHO, and peer-reviewed journals. For each answer, provide in-text citations and a list of references at the end, formatted consistently. If the question is outside your expertise, say so and recommend consulting a healthcare professional.`,
    },
    {
      role: "user",
      content: `Question: ${question}`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    max_tokens: 800,
  });

  const answer = response.choices[0].message.content.trim();
  return res.status(200).json({ answer });
});

module.exports = { answer_obgyn_question };
