require("dotenv").config();
const connectDB = require("../config/db");
const { updateMarketPrices } = require("../controller/portfolioController");

const run = async () => {
  await connectDB();
  await updateMarketPrices();
  process.exit();
};

run();
