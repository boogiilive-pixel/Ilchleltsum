
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const PRAYERS_FILE = path.join(process.cwd(), "prayers.json");

  app.use(express.json());
  app.use(cors());

  // Initialize prayers file if it doesn't exist
  if (!fs.existsSync(PRAYERS_FILE)) {
    fs.writeFileSync(PRAYERS_FILE, JSON.stringify([
      {
        id: '1',
        author: 'Зочин',
        text: 'Манай гэр бүлийн төлөө залбирч өгөөрэй. Бид бүгдээрээ эрүүл энх, аз жаргалтай байхыг хүсэж байна.',
        date: '2024.03.01',
        prayCount: 12
      },
      {
        id: '2',
        author: 'Дорж',
        text: 'Шинэ ажилд орох гэж байгаа тул амжилт хүсэж залбирч өгнө үү.',
        date: '2024.03.02',
        prayCount: 5
      }
    ]));
  }

  const getPrayers = () => {
    try {
      return JSON.parse(fs.readFileSync(PRAYERS_FILE, "utf-8"));
    } catch (e) {
      return [];
    }
  };
  
  const savePrayers = (prayers: any) => {
    try {
      fs.writeFileSync(PRAYERS_FILE, JSON.stringify(prayers, null, 2));
    } catch (e) {
      console.error("Failed to save prayers to file:", e);
      throw e;
    }
  };

  // API routes
  app.get("/api/prayers", (req, res) => {
    try {
      const prayers = getPrayers();
      res.json(prayers);
    } catch (error) {
      console.error("GET /api/prayers error:", error);
      res.status(500).json({ error: "Failed to fetch prayers" });
    }
  });

  app.post("/api/prayers", (req, res) => {
    console.log("POST /api/prayers body:", req.body);
    
    if (!req.body || typeof req.body !== 'object') {
      console.error("Invalid request body type:", typeof req.body);
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { author, text } = req.body;
    
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.error("Text is missing or invalid:", { text });
      return res.status(400).json({ error: "Залбирлын текст заавал байх ёстой." });
    }
    
    try {
      const prayers = getPrayers();
      if (!Array.isArray(prayers)) {
        console.error("Prayers data is not an array, resetting...");
        savePrayers([]);
        return res.status(500).json({ error: "Data corruption detected, please try again." });
      }

      const newPrayer = {
        id: Math.random().toString(36).substr(2, 9),
        author: (author && typeof author === 'string' ? author.trim() : 'Зочин'),
        text: text.trim(),
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        prayCount: 0
      };
      
      prayers.unshift(newPrayer);
      savePrayers(prayers);
      
      console.log("Successfully added prayer:", newPrayer.id);
      res.status(201).json(newPrayer);
    } catch (error) {
      console.error("Failed to add prayer:", error);
      res.status(500).json({ error: "Сервер дээр алдаа гарлаа. Дараа дахин оролдоно уу." });
    }
  });

  app.post("/api/prayers/:id/pray", (req, res) => {
    const { id } = req.params;
    const prayers = getPrayers();
    const prayer = prayers.find((p: any) => p.id === id);
    if (prayer) {
      prayer.prayCount += 1;
      savePrayers(prayers);
      res.json(prayer);
    } else {
      res.status(404).json({ error: "Prayer not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
