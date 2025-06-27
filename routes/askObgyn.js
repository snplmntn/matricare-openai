const express = require("express");
const router = express.Router();
const { answer_obgyn_question } = require("../controller/AskObgynController");

// POST /api/ask-obgyn
router.post("/", answer_obgyn_question);

module.exports = router;
