const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route (For browser test)
app.get("/", (req, res) => {
  res.send("🚀 JARVIS Backend is Running Successfully");
});

// Chat Route (POST API)
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  // Simple AI Logic (temporary)
  let reply;

  if (message.toLowerCase().includes("hello")) {
    reply = "Hello Commander 👋";
  } else if (message.toLowerCase().includes("who are you")) {
    reply = "I am JARVIS, your personal AI assistant.";
  } else {
    reply = "I am still learning. Advanced AI mode coming soon.";
  }

  res.json({
    success: true,
    userMessage: message,
    reply: reply,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 JARVIS backend running on port ${PORT}`);
});
