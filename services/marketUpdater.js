const axios = require("axios");
const MarketData = require("../models/MarketData");

const API_KEY = process.env.ALPHA_VANTAGE_KEY;

const PREDEFINED_SYMBOLS = [
  "AAPL",
  "TSLA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "NVDA",
  "RELIANCE.NSE",
  "TCS.NSE",
  "INFY.NSE"
];

exports.updatePredefinedMarketData = async () => {
  try {
    console.log("📈 Updating predefined symbols...");

    for (const symbol of PREDEFINED_SYMBOLS) {
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
      if (!data) continue;

      const latestDate = Object.keys(data)[0];
      const latestClose = parseFloat(data[latestDate]["4. close"]);

      const last7 = Object.keys(data)
        .slice(0, 7)
        .map(date => ({
          date,
          close: parseFloat(data[date]["4. close"])
        }));

      await MarketData.findOneAndUpdate(
        { symbol },
        {
          symbol,
          currentPrice: latestClose,
          history: last7,
          lastUpdated: new Date()
        },
        { upsert: true }
      );

      await new Promise(r => setTimeout(r, 12000));
    }

    console.log("✅ Market dataset updated");
  } catch (error) {
    console.error("❌ Market update error:", error.message);
  }
};
