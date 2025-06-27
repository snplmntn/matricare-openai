const express = require("express");
const cors = require("cors");

// Utilities
const checkAuth = require("./utils/checkAuth");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/ErrorController");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const classifyRoute = require("./routes/classify");
const generateArticleRoute = require("./routes/generateArticle");
const relevanceCheckRoute = require("./routes/relevanceCheck");
const aliveRoute = require("./routes/alive");
const askObgynRoute = require("./routes/askObgyn");

app.use("/api/classify", classifyRoute);
app.use("/api/article", generateArticleRoute);
app.use("/api/relevance-check", relevanceCheckRoute);
app.use("/api/alive", aliveRoute);
app.use("/api/ask", askObgynRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
