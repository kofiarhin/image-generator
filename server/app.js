const express = require("express");
const { generateImage } = require("./generateImage");
const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  return res.json({ message: "hello world" });
});

app.post("/api/image-generator", async (req, res, next) => {
  const { prompt } = req.body;
  const result = await generateImage(prompt);
  return res.json({ result });
});

module.exports = app;
