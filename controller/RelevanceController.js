const openai = require("../connection");
const catchAsync = require("../utils/catchAsync");

// Check if comment content is related to post content
const relevance_check = catchAsync(async (req, res, next) => {
  const { postContent, commentContent, instruction } = req.body;

  const messages = [
    {
      role: "system",
      content: `You are an AI assistant that analyzes the relevance between post content and comments. You must be strict about determining relevance. A comment should ONLY be considered relevant if it meaningfully contributes to the discussion about the post content.

MARK AS IRRELEVANT (isRelevant: false) if the comment:
- Contains only nonsensical text, gibberish, or random words
- Is just testing phrases like "test", "hello", "bruh"
- Contains only slang, memes, or internet expressions without meaningful content
- Is completely off-topic from the post subject
- Contains only single words or very short phrases without context
- Is spam, promotional content, or completely unrelated
- Contains only emotional reactions without substance (just "lol", "wow", etc.)

MARK AS RELEVANT (isRelevant: true) ONLY if the comment:
- Directly addresses the topic discussed in the post
- Provides meaningful feedback, advice, or information related to the post
- Asks genuine questions related to the post content
- Shares relevant personal experiences related to the topic
- Contributes constructive discussion about the post subject`,
    },
    {
      role: "user",
      content: `${
        instruction ||
        "Determine if the comment is relevant and related to the post content. Return a simple JSON object with 'isRelevant' boolean field. Be very strict - only mark as relevant if the comment meaningfully contributes to discussion about the post topic."
      }

Post Content: "${postContent}"

Comment Content: "${commentContent}"

Please respond with only a JSON object containing the 'isRelevant' boolean field.`,
    },
  ];

  // Call OpenAI API to check relevance
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
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
