import express from "express";
import cors from "cors";

const app = express();

const corsOptions = { origin: ["http://localhost:5173"] };

app.use(cors(corsOptions));

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

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
