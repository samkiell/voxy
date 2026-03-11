const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Conversations list route placeholder" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "Conversation detail route placeholder" });
});

module.exports = router;
