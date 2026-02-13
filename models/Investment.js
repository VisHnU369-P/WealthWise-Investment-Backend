const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema(
  {
    date: {
      type: String, // "2026-02-14"
      required: true,
    },
    close: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // prevents extra _id for each history item
);

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
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true, // 🔥 faster symbol queries
    },

    assetName: {
      type: String,
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

    // 📈 Updated daily by cron
    currentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 📊 Store historical close prices
    priceHistory: {
      type: [priceHistorySchema],
      default: [],
    },

    // 📝 Optional
    notes: {
      type: String,
      trim: true,
    },

    // ❌ Soft delete
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Compound index for performance
InvestmentSchema.index({ userId: 1, symbol: 1 });

module.exports = mongoose.model("Investment", InvestmentSchema);
