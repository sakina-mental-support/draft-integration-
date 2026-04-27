const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const messageService = require("../services/messageService");

// GET ALL MESSAGES
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const messages = await messageService.getMessages(req.user.id);
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

// SEND MESSAGE
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const result = await messageService.sendMessage(req.user.id, content);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
