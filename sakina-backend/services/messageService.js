const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const aiService = require("./aiService");

/**
 * Get or create a conversation for a user
 */
const getOrCreateConversation = async (userId) => {
  let conversation = await Conversation.findOne({ user: userId }).sort({ updatedAt: -1 });
  
  if (!conversation) {
    conversation = new Conversation({
      user: userId,
      title: "Mental Support Chat"
    });
    await conversation.save();

    // Create initial welcome message
    const welcomeMsg = new Message({
      conversationId: conversation._id,
      sender: "ai",
      content: "Hi! I'm your Sakina support assistant. I'm here to listen and help you through whatever you're experiencing. How are you feeling today?"
    });
    await welcomeMsg.save();
  }
  
  return conversation;
};

/**
 * Send a message and get AI analysis/response
 */
const sendMessage = async (userId, content) => {
  const conversation = await getOrCreateConversation(userId);

  // 1. Get AI Insight (Emotion + Response)
  let emotionTag = "neutral";
  let aiContent = "";
  
  try {
    const aiResult = await aiService.getAIInsight(content);
    emotionTag = aiResult.emotion;
    aiContent = aiResult.response;
  } catch (err) {
    console.error("AI Insight failed:", err.message);
    aiContent = "I'm here for you. Tell me more about how you're feeling.";
  }

  // 2. Save User Message
  const userMessage = new Message({
    conversationId: conversation._id,
    sender: "user",
    content: content,
    emotionTag: emotionTag
  });
  await userMessage.save();

  // 3. Save AI Response
  
  const aiMessage = new Message({
    conversationId: conversation._id,
    sender: "ai",
    content: aiContent
  });
  await aiMessage.save();

  return {
    userMessage,
    aiMessage
  };
};

/**
 * Get messages for a conversation
 */
const getMessages = async (userId) => {
  const conversation = await getOrCreateConversation(userId);
  return await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
};

module.exports = {
  getMessages,
  sendMessage,
};
