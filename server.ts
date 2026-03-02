
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
  
  const savePrayers = (prayers: any) => fs.writeFileSync(PRAYERS_FILE, JSON.stringify(prayers, null, 2));

  // API routes
  app.get("/api/prayers", (req, res) => {
    res.json(getPrayers());
  });

  app.post("/api/prayers", (req, res) => {
    const { author, text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    
    const prayers = getPrayers();
    const newPrayer = {
      id: Math.random().toString(36).substr(2, 9),
      author: author || 'Зочин',
      text,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      prayCount: 0
    };
    prayers.unshift(newPrayer);
    savePrayers(prayers);
    res.json(newPrayer);
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
