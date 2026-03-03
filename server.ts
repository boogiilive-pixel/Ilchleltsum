
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
  app.get("/api/ping", (req, res) => {
    res.json({ status: "pong", time: new Date().toISOString() });
  });

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      v: 5,
      time: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  });

  // Catch-all for API routes
  app.all("/api/*", (req, res) => {
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
