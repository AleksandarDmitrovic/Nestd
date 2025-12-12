import express from "express";
import cors from "cors";

const app = express();

const corsOptions = { origin: ["http://localhost:5173"] };

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
