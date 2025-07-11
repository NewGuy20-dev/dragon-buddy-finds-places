import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export interface PlaceRecommendation {
  name: string;
  category: string;
  rating: number;
  distance: string;
  price: string;
  description: string;
  openNow: boolean;
  address: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
}

export interface ChatResponse {
  text: string;
  places?: PlaceRecommendation[];
}

export async function searchPlacesWithAI(
  location: string,
  category: string,
  userQuery?: string
): Promise<PlaceRecommendation[]> {
  try {
    const searchQuery = userQuery 
      ? `${category} in ${location} ${userQuery}` 
      : `best ${category} in ${location}`;

    const prompt = `Use web search to find current, real ${searchQuery}. I need authentic, up-to-date information about actual places that exist in ${location}.
    
    Search the web for the top 6 real ${category} in ${location} and provide:
    - Actual business names (not generic names)
    - Verified addresses that exist
    - Real ratings from review sites
    - Current operating hours and status
    - Accurate pricing information
    - Authentic descriptions from their websites or reviews
    - High-quality images of each place (exterior, interior, or food photos)
    
    IMPORTANT: Only include places that actually exist and are currently operating. Use current web search results to verify all information and find actual photos.
    
    Format the response as a JSON array of objects with these exact fields:
    {
      "name": string,
      "category": string,
      "rating": number,
      "distance": string,
      "price": string,
      "description": string,
      "openNow": boolean,
      "address": string,
      "phone": string,
      "website": string,
      "imageUrl": string
    }
    
    Only return valid, real places with accurate information. Use current data and prioritize highly-rated, popular establishments.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string" },
              rating: { type: "number" },
              distance: { type: "string" },
              price: { type: "string" },
              description: { type: "string" },
              openNow: { type: "boolean" },
              address: { type: "string" },
              phone: { type: "string" },
              website: { type: "string" },
              imageUrl: { type: "string" }
            },
            required: ["name", "category", "rating", "distance", "price", "description", "openNow", "address", "imageUrl"]
          }
        }
      },
      contents: prompt,
    });

    const places = JSON.parse(response.text || "[]") as PlaceRecommendation[];
    return places;
  } catch (error) {
    console.error("Error searching places with AI:", error);
    throw new Error("Failed to search places with AI");
  }
}

export async function chatWithTravelBuddy(
  userMessage: string,
  userLocation?: string,
  context?: string
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are Travel Buddy, a friendly AI travel assistant with the personality of a wise, adventurous koala. You help users discover amazing places to visit.

    IMPORTANT: Use web search to find current, real information about places and travel recommendations. Only provide information about places that actually exist and are currently operating.

    Your personality:
    - Friendly and enthusiastic about travel
    - Knowledgeable about different locations using current web search
    - Helpful in providing travel recommendations with verified information
    - Use emojis occasionally but don't overdo it
    - Keep responses conversational and engaging

    Current user location: ${userLocation || "Not specified"}
    Context: ${context || "General travel chat"}

    When recommending places, always verify through web search that they:
    - Actually exist with real addresses
    - Are currently operating
    - Have authentic reviews and ratings
    - Provide accurate contact information and hours

    Respond naturally to the user's message with verified, current information.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      contents: userMessage,
    });

    return {
      text: response.text || "I'm having trouble responding right now. Please try again!",
    };
  } catch (error) {
    console.error("Error in Travel Buddy chat:", error);
    return {
      text: "Sorry, I'm having some technical difficulties. Please try again later! 🐨",
    };
  }
}

export async function getLocationInfo(locationName: string): Promise<{
  name: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}> {
  try {
    const prompt = `Provide information about the location: "${locationName}"
    
    Include:
    - A brief description of the location
    - Approximate coordinates (latitude and longitude)
    - Any notable features or characteristics
    
    Format as JSON:
    {
      "name": string,
      "description": string,
      "coordinates": { "lat": number, "lng": number }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            coordinates: {
              type: "object",
              properties: {
                lat: { type: "number" },
                lng: { type: "number" }
              }
            }
          }
        }
      },
      contents: prompt,
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error getting location info:", error);
    throw new Error("Failed to get location information");
  }
}