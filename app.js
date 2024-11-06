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
const aliveRoute = require("./routes/alive");

app.use("/api/classify", classifyRoute);
app.use("/api/article", checkAuth, generateArticleRoute);
app.use("/api/alive", aliveRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
