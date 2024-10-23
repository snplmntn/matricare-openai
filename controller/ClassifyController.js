const openai = require("../connection");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const classify_post = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  if (!content) return next(new AppError("Content is required", 400));

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
      "${content}"
      Categories:`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    max_tokens: 50,
    temperature: 0,
  });

  const validCategories = [
    "Health & Wellness",
    "Finance & Budgeting",
    "Parenting & Family",
    "Baby’s Essentials",
    "Exercise & Fitness",
    "Labor & Delivery",
  ];

  const category = response.choices[0].message.content
    .split(",")
    .map((category) => category.trim())
    .filter((category) => validCategories.includes(category));

  if (category.length === 0) {
    return next(new AppError("Failed to classify the post", 404));
  }
  return res.status(200).json({ content, category });
});

module.exports = { classify_post };
