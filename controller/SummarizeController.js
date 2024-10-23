const openai = require("../connection");
const catchAsync = require("../utils/catchAsync");

const summary_post = catchAsync(async (req, res, next) => {
  const { posts, category } = req.body;

  const messages = [
    {
      role: "system",
      content: `You are a professional OB-GYN and data analyst. Your expertise allows you to synthesize information from various sources regarding pregnancy and family health. When summarizing posts and comments, focus on providing a comprehensive and insightful overview that highlights key themes, advice, and emotional support shared by users. Use a tone that is empathetic, informative, and supportive.`,
    },
    {
      role: "user",
      content: `Summarize the following posts and comments. The Category is: ${category}\n${posts
        .map((post, index) => {
          const formattedComments = post.comments
            .map(
              (comment, commentIndex) =>
                `  - Comment ${commentIndex + 1}: ${comment}`
            )
            .join("\n");

          return `\nPost ${index + 1}: ${post.content}\n${formattedComments}\n`;
        })
        .join("")}`,
    },
  ];

  // Call OpenAI API to summarize
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: messages,
    max_tokens: 1000,
  });

  // Extract and return the summary
  const summary = response.choices[0].message.content.trim();
  return res.status(200).json({ summary });
});

module.exports = { summary_post };
