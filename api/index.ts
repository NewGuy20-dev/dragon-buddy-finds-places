// Vercel API entry point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
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

// Initialize routes
let isInitialized = false;

async function initializeApp() {
  if (!isInitialized) {
    await registerRoutes(app);
    isInitialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeApp();
    
    // Handle the request with Express
    app(req as any, res as any);
  } catch (error) {
    console.error('API handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}