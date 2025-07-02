const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// API Key should be set in the .env file
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.error('Error: OPENROUTER_API_KEY not found in environment variables');
}

// OpenRouter API client
async function generateWithOpenRouter(prompt, systemPrompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/cypher-alpha:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    if (error.response) {
      console.error('OpenRouter API error status:', error.response.status);
      console.error('OpenRouter API error data:', error.response.data);
      console.error('OpenRouter API error headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received from OpenRouter API:', error.request);
    } else {
      console.error('Error setting up OpenRouter API request:', error.message);
    }
    throw new Error('Failed to generate content from OpenRouter API');
  }
}

module.exports = { generateWithOpenRouter };