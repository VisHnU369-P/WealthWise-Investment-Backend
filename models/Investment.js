const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
  {
    // 🔗 User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 📊 Asset info
    assetType: {
      type: String,
      enum: ["STOCK", "CRYPTO", "MUTUAL_FUND"],
      required: true,
    },

    symbol: {
      type: String, // AAPL, BTC, NIFTY50
      required: true,
      uppercase: true,
      trim: true,
    },

    assetName: {
      type: String, // Apple Inc, Bitcoin
      trim: true,
    },

    // 💰 Investment details
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // 📈 Current value (can be mocked or updated later)
    currentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 📝 Optional
    notes: {
      type: String,
      trim: true,
    },

    // ❌ Soft delete (instead of hard delete)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

module.exports = mongoose.model("Investment", InvestmentSchema);
