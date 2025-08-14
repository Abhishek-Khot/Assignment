const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const User = require("./models/User"); // adjust path as needed

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const corsOptions = {
//   origin: [
//     process.env.FRONTEND_URL,
//     "http://localhost:5173",
//     // "https://smartrecruit.vercel.app", // for quick testing purpose included this hardcoded urls
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization", "multipart/form-data"],
// };
// app.use(cors(corsOptions));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

// Connect to MongoDB
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

// Real-time text update logic
let currentText = "";

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial data
  res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);

  const intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.post("/api/update", (req, res) => {
  currentText = req.body.text;
  res.status(200).send("Text updated successfully");
});

// Other route imports
const signup = require("./routes/signup");
const login = require("./routes/login");
const productRoutes = require("./routes/product");
const reportRoutes = require("./routes/report");
const analyticsRoutes = require("./routes/analytics");
const exportRoutes = require("./routes/export");

// Use routes
app.use(signup);
app.use(login);
app.use(productRoutes);
app.use(reportRoutes);
app.use(analyticsRoutes);
app.use(exportRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));
// Test route for users
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.send("Error, check console");
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
