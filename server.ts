
import express from "express";
// import { createServer as createViteServer } from "vite"; // Move to dynamic import
import fs from "fs";
import path from "path";
import cors from "cors";
import { parseStringPromise } from "xml2js";
import { GoogleGenAI } from "@google/genai";

console.log("SERVER.TS LOADED - " + new Date().toISOString());

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  console.log("Starting server...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("APP_URL:", process.env.APP_URL);
  
  // Ensure data directory exists
  const DATA_DIR = path.resolve("data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

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

  // 1. Request logger with file logging for debugging
  const LOG_FILE = getFilePath("server.log");
  app.use((req, res, next) => {
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url} - Host: ${req.headers.host} - Origin: ${req.headers.origin}\n`;
    console.log(logEntry.trim());
    try {
      fs.appendFileSync(LOG_FILE, logEntry);
    } catch (e) {
      // Ignore logging errors
    }
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

  // --- API Routes ---

  // AI Spiritual Encouragement (Gemini)
  app.post("/api/encouragement", async (req, res) => {
    const { topic } = req.body || {};
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ text: "Сэдэв оруулна уу." });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        console.warn("[GEMINI SERVER] No GEMINI_API_KEY environment variable set.");
        return res.status(500).json({ 
          text: "Сэрвэр дээр GEMINI_API_KEY тохируулагдаагүй байна." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Би "Илчлэлт сүм" (Revelation Church)-ийн вэбсайт дээр байна. Надад дараах сэдвээр урам зориг өгөх богино хэмжээний (3-4 өгүүлбэр) Христийн шашны сургаал эсвэл Библийн эшлэл дээр үндэслэсэн үг хэлж өгөөч. Сэдэв: ${topic.trim()}. Хэл: Монгол хэл.`,
      });

      const text = response.text || "Уучлаарай, хариу ирүүлж чадсангүй.";
      return res.json({ text });
    } catch (error: any) {
      console.error("[GEMINI SERVER ERROR]:", error);
      if (error.message?.includes("API key not valid")) {
        return res.status(400).json({ 
          text: "Таны оруулсан API Key буруу байна. Google AI Studio-оос түлхүүрээ дахин шалгана уу." 
        });
      }
      return res.status(500).json({ 
        text: "Холболтын алдаа гарлаа. Та дараа дахин оролдоорой." 
      });
    }
  });

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
  app.all("/api/admin/login", (req, res, next) => {
    console.log(`[ADMIN LOGIN TRACE] ${req.method} ${req.url}`);
    if (req.method === "POST") {
      const { password } = req.body;
      console.log(`[ADMIN LOGIN POST] Password provided: ${!!password}`);
      
      if (!password) {
        return res.status(400).json({ success: false, message: "Нууц үг оруулна уу." });
      }

      if (password === "admin123") {
        console.log("[ADMIN LOGIN] Success");
        return res.json({ success: true, token: "mock-admin-token-" + Date.now() });
      } else {
        console.log(`[ADMIN LOGIN] Failed - Incorrect password`);
        return res.status(401).json({ success: false, message: "Нууц үг буруу байна." });
      }
    } else if (req.method === "GET") {
      return res.json({ message: "Admin login endpoint is active. Use POST to login." });
    }
    next();
  });

  app.get("/api/debug/logs", (req, res) => {
    try {
      const logFile = getFilePath("server.log");
      if (fs.existsSync(logFile)) {
        const logs = fs.readFileSync(logFile, "utf-8");
        res.send(`<pre>${logs}</pre>`);
      } else {
        res.send("No logs found.");
      }
    } catch (e) {
      res.status(500).send("Error reading logs");
    }
  });

  app.get("/api/debug", (req, res) => {
    res.json({ 
      message: "API is reachable", 
      time: new Date().toISOString(),
      routes: ["/api/news", "/api/sermons", "/api/messages", "/api/gallery", "/api/admin/login"]
    });
  });

  // --- RSS Caching ---
  const YOUTUBE_CACHE_FILE = getFilePath("youtube_videos_cache.json");
  const RSS_CACHE_FILE = getFilePath("youtube_rss_cache.json");
  
  let rssCache: { [key: string]: { xml: string; timestamp: number } } = {};
  let videoCache: { [key: string]: { json: any; timestamp: number } } = {};
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour (increased to reduce 429s)

  // Load cache from disk on startup
  try {
    if (fs.existsSync(YOUTUBE_CACHE_FILE)) {
      const content = fs.readFileSync(YOUTUBE_CACHE_FILE, "utf-8");
      const data = JSON.parse(content);
      // Support migration from old single-cache format
      if (data.json && data.timestamp) {
        videoCache['default'] = { json: data.json, timestamp: data.timestamp };
      } else {
        videoCache = data;
      }
      console.log("[YouTube API] Loaded video cache from disk");
    }
    if (fs.existsSync(RSS_CACHE_FILE)) {
      const content = fs.readFileSync(RSS_CACHE_FILE, "utf-8");
      rssCache = JSON.parse(content);
      console.log("[RSS Proxy] Loaded RSS cache from disk");
    }
  } catch (e) {
    console.error("Error loading YouTube cache from disk:", e);
  }

  app.get("/api/youtube-videos", async (req, res) => {
    const playlistId = req.query.playlistId as string;
    const isPlaceholder = (id?: string) => !id || id.includes('PLACEHOLDER');
    const cacheKey = (playlistId && !isPlaceholder(playlistId)) ? playlistId : 'default';
    
    try {
      // Check cache - if valid, serve it
      const cached = videoCache[cacheKey];
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`[YouTube API] Serving ${cacheKey} from fresh cache`);
        return res.json(cached.json);
      }

      const CHANNEL_ID = 'UCcuWVaHkayGyttxoPDuaa1Q';
      const RSS_URL = (playlistId && !isPlaceholder(playlistId))
        ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
        : `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      
      console.log(`[YouTube API] Fetching from YouTube: ${RSS_URL}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(RSS_URL, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // If we have a 429 or any error but have stale cache, serve it
        if (cached) {
          console.warn(`[YouTube API] Fetch failed (${response.status}) for ${cacheKey}, serving stale cache`);
          return res.json(cached.json);
        }
        return res.status(response.status).json({ error: `YouTube RSS fetch failed with status: ${response.status}` });
      }
      
      const xml = await response.text();
      let videos = [];
      
      try {
        const result = await parseStringPromise(xml);
        const entries = result.feed.entry || [];
        videos = entries.map((entry: any) => {
          const videoId = entry['yt:videoId'] ? entry['yt:videoId'][0] : '';
          const title = entry.title ? entry.title[0] : 'Видео';
          return {
            id: videoId,
            title: title,
            link: `https://www.youtube.com/watch?v=${videoId}`,
            pubDate: entry.published ? entry.published[0] : '',
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          };
        }).filter((v: any) => v.id);
      } catch (parseError) {
        console.warn("[YouTube API] XML parsing failed, attempting regex fallback on server");
        const videoIdRegex = /<yt:videoId>([^<]+)<\/yt:videoId>/g;
        const watchRegex = /watch\?v=([a-zA-Z0-9_-]{11})/g;
        
        const videoIds = new Set<string>();
        let match;
        while ((match = videoIdRegex.exec(xml)) !== null) videoIds.add(match[1]);
        while ((match = watchRegex.exec(xml)) !== null) videoIds.add(match[1]);
        
        if (videoIds.size > 0) {
          const uniqueIds = Array.from(videoIds);
          console.log(`[YouTube API] Regex fallback found ${uniqueIds.length} video IDs`);
          videos = uniqueIds.map(id => ({
            id,
            title: 'Видео',
            link: `https://www.youtube.com/watch?v=${id}`,
            pubDate: new Date().toISOString(),
            thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          }));
        } else {
          console.error("[YouTube API] Regex fallback also failed to find videos");
          if (cached) {
            console.warn("[YouTube API] Serving stale cache after all parsing failed");
            return res.json(cached.json);
          }
          throw parseError;
        }
      }

      // Update cache
      videoCache[cacheKey] = { json: videos, timestamp: Date.now() };
      
      // Save to disk
      try {
        fs.writeFileSync(YOUTUBE_CACHE_FILE, JSON.stringify(videoCache), "utf-8");
      } catch (e) {
        console.error("Error saving video cache to disk:", e);
      }

      res.json(videos);
    } catch (error: any) {
      console.error("[YouTube API] Error:", error.message);
      const cached = videoCache[cacheKey];
      if (cached) {
        console.warn("[YouTube API] Error occurred, serving stale cache as last resort");
        return res.json(cached.json);
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sermons-rss", async (req, res) => {
    const playlistId = req.query.playlistId as string;
    const isPlaceholder = (id?: string) => !id || id.includes('PLACEHOLDER');
    const cacheKey = (playlistId && !isPlaceholder(playlistId)) ? playlistId : 'default';

    try {
      // Check cache
      const cached = rssCache[cacheKey];
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`[RSS Proxy] Serving ${cacheKey} from fresh cache`);
        res.set("Content-Type", "text/xml");
        return res.send(cached.xml);
      }

      const CHANNEL_ID = 'UCcuWVaHkayGyttxoPDuaa1Q';
      const RSS_URL = (playlistId && !isPlaceholder(playlistId))
        ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
        : `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      
      console.log(`[RSS Proxy] Fetching from YouTube: ${RSS_URL}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(RSS_URL, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (cached) {
          console.warn(`[RSS Proxy] Fetch failed (${response.status}) for ${cacheKey}, serving stale cache`);
          res.set("Content-Type", "text/xml");
          return res.send(cached.xml);
        }
        return res.status(response.status).json({ error: `YouTube RSS fetch failed with status: ${response.status}` });
      }
      
      const xml = await response.text();
      
      // Basic validation that it's actually XML
      if (!xml.trim().startsWith('<?xml') && !xml.trim().startsWith('<feed')) {
        console.error("[RSS Proxy] Received non-XML content:", xml.substring(0, 200));
        if (cached) {
          console.warn("[RSS Proxy] Invalid XML received, serving stale cache");
          res.set("Content-Type", "text/xml");
          return res.send(cached.xml);
        }
        throw new Error("Received non-XML content from YouTube");
      }

      // Update cache
      rssCache[cacheKey] = { xml, timestamp: Date.now() };
      
      // Save to disk
      try {
        fs.writeFileSync(RSS_CACHE_FILE, JSON.stringify(rssCache), "utf-8");
      } catch (e) {
        console.error("Error saving RSS cache to disk:", e);
      }

      res.set("Content-Type", "text/xml");
      res.send(xml);
    } catch (error: any) {
      console.error("[RSS Proxy] Error:", error.message);
      const cached = rssCache[cacheKey];
      if (cached) {
        console.warn("[RSS Proxy] Error occurred, serving stale cache as last resort");
        res.set("Content-Type", "text/xml");
        return res.send(cached.xml);
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for API routes moved to after all specific routes
  app.all("/api/*", (req, res) => {
    console.log(`[API 404] ${req.method} ${req.url}`);
    res.status(404).json({ 
      error: "API route not found", 
      method: req.method, 
      url: req.url 
    });
  });

  const isProd = process.env.NODE_ENV === "production";
  
  // Vite middleware for development
  if (!isProd) {
    console.log("Starting Vite in middleware mode...");
    try {
      const { createServer: createViteServer } = await import("vite");
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

  // Only listen if not running as a serverless function (e.g., on Vercel)
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`>>> Server is listening on port ${PORT} <<<`);
      console.log(`>>> Health check: http://localhost:${PORT}/api/health <<<`);
    });
  }
}

startServer().catch(err => {
  console.error("CRITICAL: Failed to start server:", err);
});

export default app;
