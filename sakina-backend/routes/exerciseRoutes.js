const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const recommendationService = require("../services/recommendationService");

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const result = await recommendationService.getRecommendations(
      req.user.id
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;