const express = require("express");
const router = express.Router();
const classifyController = require("../controller/ClassifyController");

// Summaizer
router.post("/", classifyController.classify_post);

module.exports = router;
