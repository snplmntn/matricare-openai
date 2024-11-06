const express = require("express");
const router = express.Router();
const GenerateArticleController = require("../controller/GenerateArticleController");

// Summaizer
router.post("/", GenerateArticleController.generate_article);

module.exports = router;
