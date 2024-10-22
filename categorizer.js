const { Configuration, OpenAIApi } = require("openai");

// Initialize OpenAI API with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Store API key in environment variable
});
const openai = new OpenAIApi(configuration);
