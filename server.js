import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_OPENAI_API_KEY";

app.post("/command", async (req, res) => {
    const userCommand = req.body.command;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are JARVIS, a smart AI assistant." },
                    { role: "user", content: userCommand }
                ]
            })
        });

        const data = await response.json();

        const reply = data.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        res.json({ reply: "Error connecting to AI" });
    }
});

app.listen(3000, () => console.log("Server running"));
