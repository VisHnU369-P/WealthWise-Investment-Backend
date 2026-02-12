const jwt = require("jsonwebtoken");
const Investment = require("../models/Investment");

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
