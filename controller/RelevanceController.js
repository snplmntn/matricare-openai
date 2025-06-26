const openai = require("../connection");
const catchAsync = require("../utils/catchAsync");

// Check if comment content is related to post content
const relevance_check = catchAsync(async (req, res, next) => {
  const { postContent, commentContent, instruction } = req.body;

  const messages = [
    {
      role: "system",
      content: `You are an AI assistant that analyzes the relevance between post content and comments. You should determine if a comment is meaningfully related to the original post content.`,
    },
    {
      role: "user",
      content: `${
        instruction ||
        "Determine if the comment is relevant and related to the post content. Return a simple JSON object with 'isRelevant' boolean field. Consider the comment relevant if it discusses the same topic, provides meaningful feedback, asks related questions, or contributes to the discussion about the post content."
      }

Post Content: "${postContent}"

Comment Content: "${commentContent}"

Please respond with only a JSON object containing the 'isRelevant' boolean field.`,
    },
  ];

  // Call OpenAI API to check relevance
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: messages,
    max_tokens: 100,
    temperature: 0.1, // Low temperature for consistent results
  });

  try {
    // Extract and parse the response
    const result = response.choices[0].message.content.trim();
    const parsedResult = JSON.parse(result);

    return res.status(200).json({
      isRelevant: parsedResult.isRelevant === true,
    });
  } catch (error) {
    // If parsing fails, default to relevant to avoid blocking legitimate comments
    console.error("Failed to parse relevance check result:", error.message);
    return res.status(200).json({
      isRelevant: true,
    });
  }
});

module.exports = { relevance_check };
