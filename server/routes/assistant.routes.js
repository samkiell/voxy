const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Assistant route placeholder" });
});

router.post("/query", (req, res) => {
  res.json({
    message: "Chat response placeholder",
    data: { reply: "I am your AI assistant. How can I help you today?" },
  });
});

module.exports = router;
