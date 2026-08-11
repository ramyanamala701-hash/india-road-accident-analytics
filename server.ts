import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Data Analyst assistant route
app.post("/api/ai-analyst", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured in environment settings."
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a Senior Data Analyst specializing in Traffic Safety and Transport Analytics for India's Ministry of Road Transport and Highways (MoRTH).

Context on the India Road Accident Dataset:
- Schema: accident_id, accident_date, state_name, district, road_type (National Highway, State Highway, Urban Road, Rural Road), vehicle_type (2-Wheeler, Car/SUV, Truck/Lorry, Bus, Auto-Rickshaw, Pedestrian), severity (Fatal, Severe Injury, Minor Injury, Non-Injury), casualties_count, fatalities_count, primary_cause (Over-speeding, Drunk Driving, Wrong-side Driving, Weather/Fog, Pothole/Bad Road, Red Light Jumping, Mobile Usage), time_slot, weather_condition, lighting_condition, helmet_belt_used (Yes/No).

User Query: ${prompt}
Dataset Context Provided: ${JSON.stringify(context || {})}

Instructions:
1. Provide a professional, structured, data-driven answer.
2. Include applicable SQL queries (MySQL format), Python Pandas/Seaborn code, or Power BI DAX code if helpful.
3. Keep recommendations practical for Indian road safety conditions (e.g. Blackspot identification, NHAI highway design, 2-wheeler helmet enforcement, automated speed camera placement).
`
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("AI Analyst Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`India Road Accident Analytics Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
