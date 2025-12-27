require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getRecentlyPlayed } = require("./spotify");

const app = express();
app.use(cors());

app.get("/spotify/recently-played", async (req, res) => {
  try {
    const data = await getRecentlyPlayed();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Spotify fetch failed" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://127.0.0.1:3001");
});
