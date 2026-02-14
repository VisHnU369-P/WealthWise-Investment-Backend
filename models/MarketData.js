const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    close: { type: Number, required: true }
  },
  { _id: false }
);

const MarketDataSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      index: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    history: {
      type: [historySchema],
      default: []
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketData", MarketDataSchema);
