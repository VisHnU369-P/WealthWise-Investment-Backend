const jwt = require("jsonwebtoken");
const Investment = require("../models/Investment");
const axios = require("axios");

exports.createInvestment = async (req, res) => {
  try {
    const { assetType, symbol, quantity, purchasePrice, assetName, notes } =
      req.body;

    console.log(
      "req.body", req.body
    )

    const investment = await Investment.create({
      userId: req.user.id, // from decoded JWT
      assetType: assetType.toUpperCase(), // FIX ENUM CASE
      symbol: symbol.toUpperCase(),       // auto uppercase
      assetName,
      quantity,
      purchasePrice,
      currentPrice: purchasePrice, // initial same
      notes,
    });

    res.status(201).json(investment);
  } catch (error) {
    console.error("Create investment error:", error);
    res.status(400).json({ message: error.message });
  }
};



const API_KEY = process.env.ALPHA_VANTAGE_KEY;

console.log("🔑 Alpha Vantage API Key:", API_KEY);

exports.updateMarketPrices = async () => {
  try {
    console.log("📈 Updating market prices...");

    // 1️⃣ Get all unique symbols
    const investments = await Investment.find({ isActive: true });

    const uniqueSymbols = [...new Set(investments.map(i => i.symbol))];

    for (const symbol of uniqueSymbols) {
      console.log("Fetching:", symbol);

      const response = await axios.get(
        "https://www.alphavantage.co/query",
        {
          params: {
            function: "TIME_SERIES_DAILY",
            symbol,
            outputsize: "compact",
            apikey: API_KEY
          }
        }
      );

      const data = response.data["Time Series (Daily)"];
      if (!data) {
        console.log("⚠️ API limit reached or invalid symbol:", symbol);
        continue;
      }


      const latestDate = Object.keys(data)[0];
      const latestClose = parseFloat(data[latestDate]["4. close"]);

      // 2️⃣ Update all investments with this symbol
      await Investment.updateMany(
        { symbol },
        {
          $set: { currentPrice: latestClose },
          $addToSet: {
            priceHistory: {
              date: latestDate,
              close: latestClose
            }
          }
        }
      );

      // 3️⃣ Prevent API rate limit
      await new Promise(resolve => setTimeout(resolve, 15000));
    }

    console.log("✅ Market prices updated");
  } catch (error) {
    console.error("❌ Market update error:", error.message);
  }
};
