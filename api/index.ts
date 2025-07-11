// Vercel API entry point - handles all API routes
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchPlacesWithAI, chatWithTravelBuddy, getLocationInfo } from '../server/gemini.js';

// CORS headers
function setCORSHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCORSHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url = '', method } = req;
  const path = new URL(url, 'https://example.com').pathname.replace('/api', '');

  try {
    // Route: GET /api/places
    if (path.startsWith('/places') && method === 'GET') {
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

      return res.json(places);
    }

    // Route: POST /api/chat
    if (path.startsWith('/chat') && method === 'POST') {
      const { message, location, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          error: "Message is required" 
        });
      }

      const response = await chatWithTravelBuddy(
        message,
        location,
        context
      );

      return res.json(response);
    }

    // Route: GET /api/location/:name
    if (path.startsWith('/location/') && method === 'GET') {
      const name = path.split('/location/')[1];
      const locationInfo = await getLocationInfo(name);
      return res.json(locationInfo);
    }

    // Route not found
    return res.status(404).json({ error: 'API route not found' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  }
}