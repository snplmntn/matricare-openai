const express = require("express");
const { relevance_check } = require("../controller/RelevanceController");

const router = express.Router();

router.post("/", relevance_check);

module.exports = router;
