require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://wealth-wise-investment.vercel.app/" // if deployed
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

const PORT = process.env.PORT || 5005;

const startServer = async () => {
  try {
    await connectDB(); // ✅ WAIT for MongoDB
    app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
  } catch (error) {
    console.error("❌ Server failed to start", error);
  }
};

startServer();
