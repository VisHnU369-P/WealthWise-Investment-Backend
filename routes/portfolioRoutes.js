const express = require("express");
const Investment = require("../models/Investment");
const auth = require("../middleware/authMiddleware");
const { createInvestment } = require("../controller/portfolioController");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const investments = await Investment.find({ userId: req.user.id });
  res.json(investments);
});

router.post("/", auth, createInvestment);

router.delete("/:id", auth, async (req, res) => {
  await Investment.findByIdAndDelete(req.params.id);
  res.json({ message: "Investment removed" });
});

module.exports = router;
