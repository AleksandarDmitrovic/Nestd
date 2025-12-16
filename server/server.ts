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

    // Create user (UUID will be auto-generated)
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

// Get user by ID
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user", details: error.message });
  }
});

// ============================================
// SNAPTRADE ROUTES
// ============================================

app.get("/api", (req, res) => {
  res.json({
    accounts: [
      "Investment Account 1",
      "Investment Account 2",
      "Investment Account 3",
    ],
  });
});

// Generate Connection Portal URL
app.post("/api/snapTrade/login", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("serId :", userId);

    // Get SnapTrade credentials user secret
    const snapTradeCredentials = await SnapTradeCredentials.findById(userId);
    console.log("existingCredentials :", snapTradeCredentials);
    if (!snapTradeCredentials) {
      return res
        .status(404)
        .json({ error: "User not registered with SnapTrade" });
    }
    const userSecret = snapTradeCredentials.snapTradeUserSecret; // Now it exists!

    const result = await snaptrade.authentication.loginSnapTradeUser({
      userId,
      userSecret,
      darkMode: true,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("Error logging in to SnapTrade:", error);
    res.status(500).json({
      error: "Failed to login to SnapTrade",
      details: error.message,
    });
  }
});

// Register user with SnapTrade
app.post("/api/snapTrade/registerUser", async (req, res) => {
  try {
    const { userId } = req.body;

    // Find user in our database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user already has SnapTrade credentials
    const existingCredentials = await SnapTradeCredentials.findById(user._id);
    console.log("existingCredentials :", existingCredentials);
    if (existingCredentials) {
      return res
        .status(400)
        .json({ error: "User already registered with SnapTrade" });
    }

    // Register with SnapTrade API using the user's UUID
    const result = await snaptrade.authentication.registerSnapTradeUser({
      userId,
    });

    console.log("SnapTrade registration result:", result.data);

    // Save credentials to database with _id
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

// Get SnapTrade accounts for a user
app.get("/api/snapTrade/accounts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get credentials using _id (which is the userId)
    const credentials = await SnapTradeCredentials.findById(userId);
    if (!credentials) {
      return res.status(404).json({
        error: "User not registered with SnapTrade",
      });
    }

    // Fetch accounts from SnapTrade
    const result = await snaptrade.accountInformation.listUserAccounts({
      userId: userId,
      userSecret: credentials.snapTradeUserSecret,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("Error fetching SnapTrade accounts:", error);
    res.status(500).json({
      error: "Failed to fetch accounts",
      details: error.message,
    });
  }
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
