import express from "express";
import cors from "cors";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { loadEnvFile } from "node:process";
import { connectDB } from "./config/database.ts";
import User from "./models/User.ts";
import SnapTradeCredentials from "./models/SnapTradeCredentials.ts";

loadEnvFile("./.env");

const app = express();

// Middleware
const corsOptions = { origin: ["http://localhost:5173"] };
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

const snaptrade = new Snaptrade({
  clientId: process.env.SNAPTRADE_CLIENT_ID,
  consumerKey: process.env.SNAPTRADE_SECRET,
});

// ============================================
// USER ROUTES
// ============================================

// Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create user
    const user = new User({
      email,
      firstName,
      lastName,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
});

app.get("/api", (req, res) => {
  // res.send("Hello, World!");
  res.json({
    accounts: [
      "Investment Account 1",
      "Investment Account 2",
      "Investment Account 3",
    ],
  });
});

app.post("/api/snapTrade/login", async (req, res) => {
  try {
    const { userId } = req.body;
    const userSecret = ""; // Retrieve from env for testing refactor for mongo db later

    const result = await snaptrade.authentication.loginSnapTradeUser({
      userId: process.env.SNAPTRADE_USER_ID || userId,
      userSecret: process.env.SNAPTRADE_USER_SECRET || userSecret,
    });

    res.json(result.data);
  } catch (error: unknown) {
    res.status(500).json({ error, message: "Failed to login to SnapTrade" });
  }
});

app.post("/api/snapTrade/registerUser", async (req, res) => {
  try {
    const { userId } = req.body;

    // Find user in our database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user already has SnapTrade credentials
    const existingCredentials = await SnapTradeCredentials.findOne({
      userId: user._id,
    });
    if (existingCredentials) {
      return res
        .status(400)
        .json({ error: "User already registered with SnapTrade" });
    }

    const result = await snaptrade.authentication.registerSnapTradeUser({
      userId,
    });
    console.log(result.data);

    // Save credentials to database
    const credentials = new SnapTradeCredentials({
      _id: user._id,
      snapTradeUserSecret: result.data.userSecret,
      isActive: true,
    });

    await credentials.save();

    res.status(201).json({
      message: "User registered with SnapTrade successfully",
      // snapTradeUserId: result.data.userId,
    });
  } catch (error: unknown) {
    console.error("Error registering with SnapTrade:", error);
    res.status(500).json({
      error: "Failed to register with SnapTrade",
      details: error,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
