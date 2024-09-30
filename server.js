// server.js

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/openai", async (req, res) => {
  try {
    const { emailText, senderId } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a polite assistant." },
          { role: "user", content: emailText },
        ],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const aiResponse = data.choices[0].message.content;
      res.json({ aiResponse: aiResponse });
    } else {
      console.error("Error from OpenAI API:", data);
      res.status(500).json({ error: "Error from OpenAI API", details: data });
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Error calling OpenAI API" });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
