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

router.get("/history/:symbol", auth, async (req, res) => {
  const { symbol } = req.params;

  const investment = await Investment.findOne({
    userId: req.user.id,
    symbol
  });

  if (!investment) return res.status(404).json({ message: "Not found" });

  const last7 = investment.priceHistory
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  res.json(last7);
});


module.exports = router;
