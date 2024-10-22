const express = require("express");
const { OpenAI } = require("openai");
const app = express();
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

// Middleware to parse JSON requests
app.use(express.json());
const port = process.env.PORT;

// Classification function using gpt-3.5-turbo
async function classifyPost(postContent) {
  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant that categorizes posts into one or more of the following categories:
        - Health & Wellness
        - Finance & Budgeting
        - Parenting & Family
        - Baby’s Essentials
        - Exercise & Fitness
        - Labor & Delivery
        Return all applicable categories separated by commas.`,
    },
    {
      role: "user",
      content: `Classify the following post:
      "${postContent}"
      Categories:`,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-3.5-turbo
      messages: messages,
      max_tokens: 50, // Allow more tokens to return multiple categories
      temperature: 0, // For deterministic output
    });

    const validCategories = [
      "Health & Wellness",
      "Finance & Budgeting",
      "Parenting & Family",
      "Baby’s Essentials",
      "Exercise & Fitness",
      "Labor & Delivery",
    ];

    const categories = response.choices[0].message.content
      .split(",")
      .map((category) => category.trim())
      .filter((category) => validCategories.includes(category));

    if (categories.length === 0) {
      return [];
    }
    return categories;
  } catch (error) {
    console.error("Error categorizing post:", error);
    throw error;
  }
}

// API Endpoint to classify a post
app.post("/api/classify", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Post content is required" });
  }

  try {
    const category = await classifyPost(content);
    return res.json({ content, category });
  } catch (error) {
    return res.status(500).json({ error: "Failed to classify the post" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
