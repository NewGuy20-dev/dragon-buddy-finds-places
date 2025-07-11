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

    const prompt = `Search for ${searchQuery} and provide detailed information about the top 6 results. 
    
    For each place, provide:
    - Name
    - Category (hotels, restaurants, or landmarks)
    - Rating (1-5 stars)
    - Approximate distance from city center
    - Price range ($ to $$$$)
    - Brief description
    - Whether it's currently open
    - Address
    - Phone number (if available)
    - Website (if available)
    
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
      "website": string
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
              website: { type: "string" }
            },
            required: ["name", "category", "rating", "distance", "price", "description", "openNow", "address"]
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

export async function chatWithDragonBuddy(
  userMessage: string,
  userLocation?: string,
  context?: string
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are Dragon Buddy, a friendly AI travel assistant with the personality of a wise, adventurous dragon. You help users discover amazing places to visit.

    Your personality:
    - Friendly and enthusiastic about travel
    - Knowledgeable about different locations
    - Helpful in providing travel recommendations
    - Use emojis occasionally but don't overdo it
    - Keep responses conversational and engaging

    Current user location: ${userLocation || "Not specified"}
    Context: ${context || "General travel chat"}

    Respond naturally to the user's message. If they ask about places to visit, hotels, restaurants, or landmarks, provide helpful information and suggestions.`;

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
    console.error("Error in Dragon Buddy chat:", error);
    return {
      text: "Sorry, I'm having some technical difficulties. Please try again later! 🐉",
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