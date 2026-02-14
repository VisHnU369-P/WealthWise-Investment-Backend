const express = require("express");
const router = express.Router();
const MarketData = require("../models/MarketData");
const { updatePredefinedMarketData } = require("../services/marketUpdater");

router.get("/market-data", async (req, res) => {
  try {
    const data = await MarketData.find().sort({ symbol: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching market data" });
  }
});

// 🔥 TEMP TEST ROUTE
router.post("/trigger-update", async (req, res) => {
  try {
    await updatePredefinedMarketData();
    res.json({ message: "Predefined 10 symbols updated ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed ❌" });
  }
});


module.exports = router;
