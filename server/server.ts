import express from "express";
import cors from "cors";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { loadEnvFile } from "node:process";
loadEnvFile("./.env");

const app = express();

const corsOptions = { origin: ["http://localhost:5173"] };

app.use(cors(corsOptions));
app.use(express.json());

const snaptrade = new Snaptrade({
  clientId: process.env.SNAPTRADE_CLIENT_ID,
  consumerKey: process.env.SNAPTRADE_SECRET,
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

app.post("/api/snaptrade/login", async (req, res) => {
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

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
