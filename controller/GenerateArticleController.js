const openai = require("../connection");
const catchAsync = require("../utils/catchAsync");

const generate_article = catchAsync(async (req, res, next) => {
  const { posts, category } = req.body;

  const messages = [
    {
      role: "system",
      content: `You are a professional OB-GYN and data analyst, skilled in writing well-researched health articles. As you write this article, use credible sources like CDC, Mayo Clinic, WHO, and peer-reviewed journals. Each major point should be supported by an in-text citation. Additionally, include a comprehensive list of references at the end, formatted in a consistent style. The article should be structured to provide accurate, well-sourced information and practical, empathetic advice.`,
    },
    {
      role: "user",
      content: `Write a detailed article based on the following discussion topics. Support each key point with citations from reputable sources, and include a list of references at the end for further reading. \nCategory: ${category}\n${posts
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
    max_tokens: 2000,
  });

  // Extract and return the summary
  const summary = response.choices[0].message.content.trim();
  return res.status(200).json({ summary });
});

module.exports = { generate_article };
