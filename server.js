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

  // Input validation
  if (!complaint || !cause || !correction) {
    return res.status(400).json({ 
      error: "All fields (complaint, cause, correction) are required." 
    });
  }

  if (complaint.length < 10 || cause.length < 10 || correction.length < 10) {
    return res.status(400).json({ 
      error: "Each field must contain at least 10 characters for better analysis." 
    });
  }

  const prompt = `You are a professional business analyst and technical writer. You are given:

COMPLAINT: ${complaint}
ROOT CAUSE: ${cause}
PROPOSED SOLUTION: ${correction}

Your task is to generate a comprehensive, professional summary with the following five sections (approximately 100 words each):

1. EXECUTIVE SUMMARY – A concise overview that combines the complaint, root cause, and proposed solution in professional business language.

2. DETAILED COMPLAINT ANALYSIS – Provide an in-depth explanation of the complaint, including its impact, scope, and implications for the business or organization.

3. ROOT CAUSE INVESTIGATION – Analyze the underlying factors that led to this issue, including any systemic problems, process failures, or contributing circumstances.

4. CORRECTIVE ACTION PLAN – Detail the specific steps, timeline, and resources required to implement the proposed solution, including any preventive measures.

5. BUSINESS IMPACT AND IMPORTANCE – Explain why resolving this issue is critical, including potential risks of inaction, benefits of resolution, and long-term implications.

Write in a professional, objective tone suitable for business reports, executive summaries, and technical documentation. Use clear, concise language and structure each section logically.`;

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
          maxOutputTokens: 2000,
          topP: 0.8,
          topK: 40,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const result =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
    
    res.json({ 
      summary: result,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    
    let errorMessage = "Failed to generate summary.";
    
    if (error.response?.status === 429) {
      errorMessage = "Service temporarily unavailable. Please try again in a few minutes.";
    } else if (error.response?.status === 400) {
      errorMessage = "Invalid request. Please check your input and try again.";
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = "Request timed out. Please try again.";
    } else if (!API_KEY) {
      errorMessage = "API configuration error. Please contact support.";
    }
    
    res.status(500).json({ 
      error: errorMessage,
      success: false
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    success: false
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found",
    success: false
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ AI Summary Pro Server running on http://localhost:${PORT}`);
  console.log(`📧 Support: support@aisummarypro.com`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
