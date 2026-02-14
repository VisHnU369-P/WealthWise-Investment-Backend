const express = require("express");
const Investment = require("../models/Investment");
const auth = require("../middleware/authMiddleware");
const { createInvestment } = require("../controller/portfolioController");
const { updateMarketPrices } = require("../controller/portfolioController");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  if (req.user.role === "admin") {
    const allInvestments = await Investment.find();
    return res.json(allInvestments);
  }

  const userInvestments = await Investment.find({ userId: req.user.id });
  res.json(userInvestments);
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


// 🔥 TEMP ROUTE FOR TESTING
router.post("/trigger-update", auth, async (req, res) => {
  try {
    await updateMarketPrices();
    res.json({ message: "Market prices updated successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed ❌" });
  }
});



module.exports = router;
