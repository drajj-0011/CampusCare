require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaints");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "CampusCare API is running." });
});

app.use("/api/complaints", complaintRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ success: false, message: messages.join(" ") });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid data supplied." });
  }
  res.status(500).json({ success: false, message: "Server error. Please try again." });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`CampusCare API running at http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error(`Could not start server: ${error.message}`);
    process.exit(1);
  });
