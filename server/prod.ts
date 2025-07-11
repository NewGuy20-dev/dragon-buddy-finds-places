// Production server entry point for Vercel
import express from "express";
import path from "path";
import fs from "fs";
import { registerRoutes } from "./routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging for production
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

// Initialize app
async function initialize() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    // Error handling middleware
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error('Server error:', err);
      res.status(status).json({ message });
    });

    // Serve static files in production
    if (process.env.NODE_ENV === "production") {
      const distPath = path.resolve(process.cwd(), "dist/public");
      
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        
        // Fall through to index.html for SPA routing
        app.get("*", (_req, res) => {
          res.sendFile(path.resolve(distPath, "index.html"));
        });
      } else {
        console.warn(`Build directory not found: ${distPath}`);
      }
    }

    return app;
  } catch (error) {
    console.error('Failed to initialize server:', error);
    throw error;
  }
}

// Export for Vercel
export default initialize().then(app => app).catch(err => {
  console.error('Server initialization failed:', err);
  process.exit(1);
});