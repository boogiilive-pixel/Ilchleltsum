
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import cors from "cors";

async function startServer() {
  console.log("Starting server...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  const app = express();
  const PORT = 3000;
  const PRAYERS_FILE = path.join(process.cwd(), "prayers.json");
  
  console.log("PRAYERS_FILE path:", PRAYERS_FILE);

  app.use(express.json());
  app.use(cors());

  // Initialize prayers file if it doesn't exist
  if (!fs.existsSync(PRAYERS_FILE)) {
    console.log("Initializing prayers.json...");
    try {
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
      ], null, 2));
    } catch (err) {
      console.error("Failed to initialize prayers.json:", err);
    }
  } else {
    console.log("prayers.json already exists.");
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
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - Content-Type: ${req.headers['content-type']}`);
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  });

  app.get("/api/prayers", (req, res) => {
    console.log("Handling GET /api/prayers");
    try {
      const prayers = getPrayers();
      res.json(prayers);
    } catch (error) {
      console.error("GET /api/prayers error:", error);
      res.status(500).json({ error: "Failed to fetch prayers" });
    }
  });

  app.post("/api/prayers", (req, res) => {
    console.log(">>> POST /api/prayers <<<");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body));
    
    if (!req.body || typeof req.body !== 'object') {
      const errorMsg = `Invalid request body type: ${typeof req.body}`;
      console.error(errorMsg);
      return res.status(400).json({ error: "Хүсэлтийн формат буруу байна." });
    }

    const { author, text } = req.body;
    
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.error("Validation failed: text is missing or not a string", { text });
      return res.status(400).json({ error: "Залбирлын текст заавал байх ёстой." });
    }
    
    try {
      const prayers = getPrayers();
      if (!Array.isArray(prayers)) {
        console.error("Prayers data is not an array, resetting to empty array.");
        savePrayers([]);
        return res.status(500).json({ error: "Өгөгдлийн сангийн алдаа гарлаа. Дахин оролдоно уу." });
      }

      const newPrayer = {
        id: Math.random().toString(36).substr(2, 9),
        author: (typeof author === 'string' && author.trim() ? author.trim() : 'Зочин'),
        text: text.trim(),
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        prayCount: 0
      };
      
      prayers.unshift(newPrayer);
      savePrayers(prayers);
      
      console.log("Successfully added prayer:", newPrayer.id);
      res.status(201).json(newPrayer);
    } catch (error: any) {
      console.error("Failed to add prayer:", error);
      const msg = error?.message || "Unknown server error";
      res.status(500).json({ error: `Сервер дээр алдаа гарлаа: ${msg}` });
    }
  });

  app.post("/api/prayers/:id/pray", (req, res) => {
    const { id } = req.params;
    console.log(`POST /api/prayers/${id}/pray`);
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

  // Catch-all for API routes to ensure JSON response
  app.all("/api/*", (req, res) => {
    console.warn(`404 API Route: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware attached.");
    } catch (viteError) {
      console.error("Failed to start Vite server:", viteError);
    }
  } else {
    console.log("Starting in production mode...");
    const distPath = path.resolve("dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.error("Production mode enabled but 'dist' folder not found!");
      app.get("*", (req, res) => {
        res.status(500).send("Application is not built. Please run 'npm run build'.");
      });
    }
  }

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ error: "Сервер дээр тодорхойгүй алдаа гарлаа. " + (err.message || "") });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> Server is listening on port ${PORT} <<<`);
    console.log(`>>> Health check: http://localhost:${PORT}/api/health <<<`);
  });
}

console.log("Initializing startServer...");
startServer().catch(err => {
  console.error("CRITICAL: Failed to start server:", err);
});
