import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serves index.html from /public

// Constants
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Route
app.post("/generate", async (req, res) => {
  const { complaint, cause, correction } = req.body;

  const prompt = `You are given:

Complaint: ${complaint}
Cause: ${cause}
Correction: ${correction}

Your task is to generate the following in 100 words each:
1. Summary – A concise overview combining the complaint, cause, and correction.
2. More about the Complaint – Explain only the complaint in more detail.
3. What Might Have Caused It – Focus only on the root or likely cause.
4. Planned Correction – Describe the corrective action being taken.
5. Why It Is Important to Fix It – Explain the importance of resolving this issue.

Write clearly and professionally.
`;

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
    res.json({ summary: result });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
