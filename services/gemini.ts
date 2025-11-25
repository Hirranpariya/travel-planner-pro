import { GoogleGenAI, Type } from "@google/genai";
import { Trip, Destination, Activity } from "../types";

// Note: In a real MERN app, this key would be on the server. 
// For this client-side demo, we rely on the injected process.env.API_KEY.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  generateTripPlan: async (prompt: string, startDate: string): Promise<Partial<Trip>> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Plan a trip based on this request: "${prompt}". The start date is ${startDate}.
        Generate a list of destinations with activities.
        For images, use standard placeholder keywords related to the location.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy title for the trip" },
              endDate: { type: Type.STRING, description: "Calculated end date based on duration (ISO string)" },
              destinations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    location: { type: Type.STRING },
                    arrivalDate: { type: Type.STRING, description: "ISO date string" },
                    departureDate: { type: Type.STRING, description: "ISO date string" },
                    notes: { type: Type.STRING, description: "Brief description of why we are going here" },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (response.text) {
        const rawData = JSON.parse(response.text);
        
        // Transform raw data to match our strictly typed interfaces
        const destinations: Destination[] = rawData.destinations.map((d: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          location: d.location,
          arrivalDate: d.arrivalDate,
          departureDate: d.departureDate,
          notes: d.notes,
          imageUrl: `https://picsum.photos/seed/${d.location.replace(/\s/g, '')}/800/600`,
          activities: d.activities.map((a: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: a.name,
            isCompleted: false
          }))
        }));

        return {
          title: rawData.title,
          endDate: rawData.endDate,
          destinations
        };
      }
      throw new Error("No response from AI");
    } catch (error) {
      console.error("AI Planning Error:", error);
      throw error;
    }
  }
};