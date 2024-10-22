const express = require('express');
const { OpenAI } = require('openai');
const app = express();
const PORT = 3000;

const openai = new OpenAI({
    apiKey: 'YOUR_OPENAI_API_KEY',  // Replace with your OpenAI API key
});

app.use(express.json());

app.post('/openai', async (req, res) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Please make a joke' }],
      model: 'gpt-3.5-turbo',
    });
    res.json(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});