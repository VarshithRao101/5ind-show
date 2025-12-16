import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
// Using provided key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure model to enforce JSON
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json"
    }
});

/**
 * Identify User Intent using Gemini
 * Returns structured JSON object
 */
export const getGeminiIntent = async (userMessage) => {
    if (!API_KEY) {
        console.warn("Gemini API Key missing");
        return null;
    }

    const prompt = `
    Analyze this movie request and return JSON.
    
    FIELDS:
    - intentType: "discover" (for concepts/topics), "similar_search" (like a specific movie), "trending", "top_rated"
    - baseTitle: name of movie/show if mentioned (e.g. "Like Dark")
    - mediaType: "movie", "tv", or "neutral"
    - genres: list of genres (e.g. ["horror", "sci-fi"])
    - concepts: list of plot keywords/themes (e.g. "time loop", "aliens", "high school", "revenge")
    - language: language name if mentioned
    
    USER: "${userMessage}"
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Even with JSON mode, parsing is safer
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Intent Error:", error);
        return null;
    }
};
