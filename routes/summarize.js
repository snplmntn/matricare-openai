const express = require("express");
const router = express.Router();
const SummarizeController = require("../controller/SummarizeController");

// Summaizer
router.post("/", SummarizeController.summary_post);

module.exports = router;
