const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ================= SECURITY =================
// Set secure HTTP headers
app.use(helmet());

// Basic rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const userRoutes = require("./routes/userRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const moodRoutes = require("./routes/moodRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");

app.use("/api/exercises", exerciseRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/users", userRoutes);
app.use("/api/surveys", surveyRoutes);

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.send("Sakina Backend is running 🚀");
});

// ================= GLOBAL ERROR HANDLER =================
// ⚠️ لازم ييجي بعد كل الـ routes
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// ================= MONGODB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});