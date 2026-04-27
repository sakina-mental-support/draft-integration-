const axios = require("axios");

// The Flask AI service URL
const PYTHON_AI_URL = "http://127.0.0.1:5000/chat";

/**
 * Get comprehensive AI insight (emotion + response) in one call
 * @param {string} text - User message
 * @returns {Promise<Object>} - { emotion, response }
 */
const getAIInsight = async (text) => {
  try {
    const response = await axios.post(PYTHON_AI_URL, { message: text });
    return {
      emotion: response.data.emotion || "neutral",
      response: response.data.response || "I hear you. Tell me more."
    };
  } catch (error) {
    console.error("AI Service Error:", error.message);
    const fallbackEmotion = keywordFallback(text).label;
    return {
      emotion: fallbackEmotion,
      response: getResponseTemplate(fallbackEmotion)
    };
  }
};

/**
 * Analyze text emotion using the local Python AI service
 * @param {string} text - The user message to analyze
 * @returns {Promise<Object>} - { label, score }
 */
const analyzeEmotion = async (text) => {
  try {
    // We could call getAIInsight and cache the result, but for simplicity:
    const response = await axios.post(PYTHON_AI_URL, { message: text });
    const { emotion } = response.data;
    console.log(`Python AI analysis: "${text}" -> ${emotion} ✅`);
    return { label: emotion, score: 0.95 };
  } catch (error) {
    return keywordFallback(text);
  }
};

/**
 * Generate an empathetic AI response using the local Python AI service
 * @param {string} userMessage - The user's message
 * @param {string} emotion - The detected emotion
 * @returns {Promise<string>} - AI-generated supportive response
 */
const generateResponse = async (userMessage, emotion) => {
  try {
    const response = await axios.post(PYTHON_AI_URL, { message: userMessage });
    const { response: aiText } = response.data;
    console.log("Python AI dynamic response generated ✅");
    return aiText;
  } catch (error) {
    return getResponseTemplate(emotion);
  }
};

/**
 * Fallback: Keyword-based emotion detection
 */
const keywordFallback = (text) => {
  const score = { joy: 0, sadness: 0, anger: 0, fear: 0, love: 0, surprise: 0, optimism: 0, gratitude: 0 };
  const keywords = {
    joy: ['happy', 'good', 'great', 'awesome', 'amazing', 'fine', 'better', 'wonderful', 'blessed'],
    sadness: ['sad', 'bad', 'unhappy', 'depressed', 'crying', 'lonely', 'hopeless', 'hurt', 'pain'],
    anger: ['angry', 'mad', 'hate', 'annoyed', 'furious', 'upset', 'worst'],
    fear: ['scared', 'afraid', 'anxious', 'panic', 'worry', 'worried', 'nervous', 'terrified'],
    love: ['love', 'like', 'care', 'thank', 'thanks', 'grateful', 'bless', 'heart'],
    optimism: ['hope', 'will', 'future', 'can', 'try', 'next', 'going', 'improve'],
    surprise: ['wow', 'what', 'unbelievable', 'suddenly', 'actually', 'really']
  };

  const lowerText = ` ${text.toLowerCase().replace(/[^\w\s]/g, ' ')} `;
  for (const [emotion, words] of Object.entries(keywords)) {
    words.forEach(word => {
      const regex = new RegExp(`\\s${word}\\s`, 'g');
      const matches = lowerText.match(regex);
      if (matches) score[emotion] += matches.length;
    });
  }

  let emotion = 'neutral';
  let maxScore = 0;
  for (const [e, s] of Object.entries(score)) {
    if (s > maxScore) { maxScore = s; emotion = e; }
  }
  return { label: emotion, score: 0.7, isFallback: true };
};

/**
 * Fallback template responses
 */
const getResponseTemplate = (emotion) => {
  const templates = {
    sadness: "I'm sorry to hear you're feeling this way. I'm here to listen. Would you like to try a breathing exercise?",
    joy: "That's wonderful! I'm so happy for you. What contributed to this positive feeling?",
    anger: "It sounds like you're going through a lot. It's okay to feel frustrated. Take a deep breath with me.",
    fear: "I understand that things feel scary right now. You're not alone. Let's focus on the present moment.",
    surprise: "Wow, that sounds like quite a development! How are you processing this?",
    love: "That's a beautiful sentiment. Love and connection are so important for our well-being.",
    neutral: "I hear you. Tell me more about that."
  };
  return templates[emotion] || "I'm still here for you. I'm having a little trouble connecting to my deep thinking center right now, but please tell me more about how you're feeling.";
};

module.exports = { analyzeEmotion, generateResponse, getAIInsight };
