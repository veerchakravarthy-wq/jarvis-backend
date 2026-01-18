import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "/")));

// Root route
app.get("/", (req, res) => {
  res.send("JARVIS backend is running");
});

app.get("/jarvis_cinematic.html", (req, res) => {
  res.sendFile(path.join(__dirname, "jarvis_cinematic.html"));
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // System prompt: JARVIS is voice-aware
    const systemPrompt = `
You are JARVIS, a highly intelligent AI assistant.
- Always assume the user is speaking to you via voice input.
- Respond naturally, confidently, and politely as if you can hear them.
- Always address the user as "Commander".
- Never say that you cannot hear.
- Replies should be concise and human-like.
`;

    // Send to OpenAI
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `${systemPrompt}\nUser: ${userMessage}`
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