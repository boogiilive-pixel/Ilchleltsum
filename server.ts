
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import cors from "cors";

console.log("SERVER.TS LOADED - " + new Date().toISOString());

async function startServer() {
  console.log("Starting server...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("APP_URL:", process.env.APP_URL);
  
  const app = express();
  const PORT = 3000;
  
  // Ensure data directory exists
  const DATA_DIR = path.resolve("data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // 2. CORS - Extremely permissive and explicit for cross-domain debugging
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Log for debugging
    console.log(`[CORS DEBUG] ${req.method} ${req.url} - Origin: ${origin}`);

    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'false'); // Changed to false as we use 'omit'
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, Origin');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      console.log(`[CORS DEBUG] Handling OPTIONS preflight for ${req.url}`);
      return res.status(204).send();
    }
    next();
  });

  // 1. Request logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Host: ${req.headers.host} - Origin: ${req.headers.origin}`);
    next();
  });

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Body parsing error handler
  app.get("/api/test", (req, res) => {
    res.send("API IS WORKING");
  });

  app.get("/api/ping", (req, res) => {
    res.json({ status: "pong", time: new Date().toISOString() });
  });

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      v: 6,
      time: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  });

  // --- Data Management Helpers ---
  const getFilePath = (filename: string) => path.join(DATA_DIR, filename);
  
  const readData = (filename: string) => {
    try {
      const filePath = getFilePath(filename);
      if (!fs.existsSync(filePath)) return [];
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content || "[]");
    } catch (e) {
      console.error(`Error reading ${filename}:`, e);
      return [];
    }
  };

  const writeData = (filename: string, data: any) => {
    try {
      const filePath = getFilePath(filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error(`Error writing ${filename}:`, e);
      return false;
    }
  };

  // --- API Routes ---

  // News
  app.get("/api/news", (req, res) => {
    res.json(readData("news.json"));
  });

  app.post("/api/news", (req, res) => {
    const news = readData("news.json");
    const newItem = { 
      id: Date.now().toString(), 
      ...req.body, 
      createdAt: new Date().toISOString() 
    };
    news.unshift(newItem);
    writeData("news.json", news);
    res.status(201).json(newItem);
  });

  app.delete("/api/news/:id", (req, res) => {
    let news = readData("news.json");
    news = news.filter((item: any) => item.id !== req.params.id);
    writeData("news.json", news);
    res.status(204).send();
  });

  // Sermons (Custom added ones)
  app.get("/api/sermons", (req, res) => {
    res.json(readData("sermons.json"));
  });

  app.post("/api/sermons", (req, res) => {
    const sermons = readData("sermons.json");
    const newSermon = { 
      id: Date.now().toString(), 
      ...req.body, 
      createdAt: new Date().toISOString() 
    };
    sermons.unshift(newSermon);
    writeData("sermons.json", sermons);
    res.status(201).json(newSermon);
  });

  app.delete("/api/sermons/:id", (req, res) => {
    let sermons = readData("sermons.json");
    sermons = sermons.filter((item: any) => item.id !== req.params.id);
    writeData("sermons.json", sermons);
    res.status(204).send();
  });

  // Messages
  app.get("/api/messages", (req, res) => {
    res.json(readData("messages.json"));
  });

  app.post("/api/messages", (req, res) => {
    const messages = readData("messages.json");
    const newMessage = { 
      id: Date.now().toString(), 
      ...req.body, 
      createdAt: new Date().toISOString() 
    };
    messages.unshift(newMessage);
    writeData("messages.json", messages);
    res.status(201).json(newMessage);
  });

  app.delete("/api/messages/:id", (req, res) => {
    let messages = readData("messages.json");
    messages = messages.filter((item: any) => item.id !== req.params.id);
    writeData("messages.json", messages);
    res.status(204).send();
  });

  // Gallery
  app.get("/api/gallery", (req, res) => {
    res.json(readData("gallery.json"));
  });

  app.post("/api/gallery", (req, res) => {
    const gallery = readData("gallery.json");
    const newItem = { 
      id: Date.now().toString(), 
      ...req.body, 
      createdAt: new Date().toISOString() 
    };
    gallery.unshift(newItem);
    writeData("gallery.json", gallery);
    res.status(201).json(newItem);
  });

  app.delete("/api/gallery/:id", (req, res) => {
    let gallery = readData("gallery.json");
    gallery = gallery.filter((item: any) => item.id !== req.params.id);
    writeData("gallery.json", gallery);
    res.status(204).send();
  });

  // Admin Login (Simple)
  app.get("/api/admin/login", (req, res) => {
    res.json({ message: "Admin login endpoint is active. Use POST to login." });
  });

  app.post(["/api/admin/login", "/api/admin/login/"], (req, res) => {
    console.log(`[ADMIN LOGIN ATTEMPT] - ${new Date().toISOString()} - Method: ${req.method} - URL: ${req.url}`);
    const { password } = req.body;
    
    if (!password) {
      console.log("[ADMIN LOGIN] No password provided in request body");
      return res.status(400).json({ success: false, message: "Нууц үг оруулна уу." });
    }

    // For demo purposes, we use a simple password. 
    // In a real app, this would be a hashed password in a DB.
    if (password === "admin123") {
      console.log("[ADMIN LOGIN] Success");
      res.json({ success: true, token: "mock-admin-token-" + Date.now() });
    } else {
      console.log(`[ADMIN LOGIN] Failed - Incorrect password: ${password}`);
      res.status(401).json({ success: false, message: "Нууц үг буруу байна." });
    }
  });

  app.get("/api/debug", (req, res) => {
    res.json({ 
      message: "API is reachable", 
      time: new Date().toISOString(),
      routes: ["/api/news", "/api/sermons", "/api/messages", "/api/gallery", "/api/admin/login"]
    });
  });

  app.get("/api/sermons-rss", async (req, res) => {
    try {
      const CHANNEL_ID = 'UCcuWVaHkayGyttxoPDuaa1Q';
      const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      
      console.log(`[RSS Proxy] Fetching from YouTube: ${RSS_URL}`);
      
      const response = await fetch(RSS_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`YouTube RSS fetch failed with status: ${response.status}`);
      }
      
      const xml = await response.text();
      
      // Basic validation that it's actually XML
      if (!xml.trim().startsWith('<?xml') && !xml.trim().startsWith('<feed')) {
        console.error("[RSS Proxy] Received non-XML content:", xml.substring(0, 200));
        throw new Error("Received non-XML content from YouTube");
      }

      res.set("Content-Type", "text/xml");
      res.send(xml);
    } catch (error: any) {
      console.error("[RSS Proxy] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for API routes
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  const isProd = process.env.NODE_ENV === "production";
  
  // Vite middleware for development
  if (!isProd) {
    console.log("Starting Vite in middleware mode...");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
        root: process.cwd(),
      });
      app.use(vite.middlewares);
      console.log("Vite middleware attached.");

      // Explicitly serve index.html for non-API routes in dev mode
      app.use('*', async (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
          return next();
        }
        try {
          console.log(`[DEV] Serving index.html for ${req.originalUrl}`);
          let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
          template = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          console.error(`[DEV] Error serving index.html:`, e);
          next(e);
        }
      });
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
    console.error("!!! GLOBAL ERROR !!!");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("Request URL:", req.url);
    console.error("Request Method:", req.method);
    
    res.status(500).json({ 
      error: "Сервер дээр тодорхойгүй алдаа гарлаа.",
      message: err.message || "No message",
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
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
