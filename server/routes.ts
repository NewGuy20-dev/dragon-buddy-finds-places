import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchPlacesWithAI, chatWithDragonBuddy, getLocationInfo } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Places API routes
  app.get("/api/places", async (req, res) => {
    try {
      const { location, category, query } = req.query;
      
      if (!location || !category) {
        return res.status(400).json({ 
          error: "Location and category are required" 
        });
      }

      const places = await searchPlacesWithAI(
        location as string,
        category as string,
        query as string
      );

      res.json(places);
    } catch (error) {
      console.error("Error fetching places:", error);
      res.status(500).json({ 
        error: "Failed to fetch places" 
      });
    }
  });

  // Dragon Buddy chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, location, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          error: "Message is required" 
        });
      }

      const response = await chatWithDragonBuddy(
        message,
        location,
        context
      );

      res.json(response);
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ 
        error: "Failed to process chat message" 
      });
    }
  });

  // Location info API
  app.get("/api/location/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const locationInfo = await getLocationInfo(name);
      res.json(locationInfo);
    } catch (error) {
      console.error("Error getting location info:", error);
      res.status(500).json({ 
        error: "Failed to get location information" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
