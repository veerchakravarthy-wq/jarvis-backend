import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";           // <-- add this line
import { fileURLToPath } from "url"; // <-- needed for __dirname in ES modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (your HTML, JS, CSS)
app.use(express.static(path.join(__dirname, "/"))); // <-- add this line

// Root route
app.get("/", (req, res) => {
  res.send("JARVIS backend is running");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: userMessage
      })
    });

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.find(c => c.type === "output_text")?.text ||
      "I am unable to respond right now.";

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Server error occurred." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JARVIS backend running on port ${PORT}`);
});
      
  