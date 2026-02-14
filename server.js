require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cron = require("node-cron");
const { updateMarketPrices } = require("./controller/portfolioController");
const { updatePredefinedMarketData } = require("./services/marketUpdater");
const marketDataRoutes = require("./routes/marketData");
const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://wealth-wise-investment.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("*", cors()); // Handle preflight


// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://wealth-wise-investment.vercel.app" // if deployed
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});


app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/market", marketDataRoutes);

const PORT = process.env.PORT || 5005;

// const startServer = async () => {
//   try {
//     await connectDB(); // ✅ WAIT for MongoDB
//     app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
//   } catch (error) {
//     console.error("❌ Server failed to start", error);
//   }
// };


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });

    // ✅ DAILY CRON JOB (1 AM)
    cron.schedule("0 1 * * *", async () => {
      console.log("⏰ Running daily market update...");
      await updateMarketPrices();
      await updatePredefinedMarketData();
    });

  } catch (error) {
    console.error("❌ Server failed to start", error);
  }
};

startServer();
