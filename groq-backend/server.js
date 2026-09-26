const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const GROQ_URL =
    "https://api.groq.com/openai/v1/chat/completions";

app.post("/api/groq", async (req, res) => {
    try {
        const { model, messages, temperature, max_tokens } = req.body;

        if (!model || !messages) {
            return res.status(400).json({
                error: {
                    message: "Missing model or messages."
                }
            });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                error: {
                    message: "GROQ_API_KEY is not configured."
                }
            });
        }

        const groqResponse = await fetch(GROQ_URL, {
            method: "POST",

            headers: {
                "Authorization":
                    `Bearer ${process.env.GROQ_API_KEY}`,

                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens
            })
        });

        const data = await groqResponse.json();

        return res
            .status(groqResponse.status)
            .json(data);

    } catch (error) {
        console.error("Groq backend error:", error);

        return res.status(500).json({
            error: {
                message:
                    error.message ||
                    "Unable to connect to Groq."
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `BharatYatra Groq backend running on http://localhost:${PORT}`
    );
});