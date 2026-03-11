const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
  res.json({ message: "Business profile route placeholder" });
});

router.put("/profile", (req, res) => {
  res.json({ message: "Update business profile route placeholder" });
});

module.exports = router;
