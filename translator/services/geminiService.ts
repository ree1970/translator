import { GoogleGenAI } from "@google/genai";

// The platform is expected to provide the API key as an environment variable.
// The previous check `if (!process.env.API_KEY)` caused a crash in the browser
// because `process` is not defined. We now trust the environment is configured correctly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Translates text from English to Japanese using the Gemini API.
 * @param englishText The English text to translate.
 * @returns The translated Japanese text.
 */
export const translateToJapanese = async (englishText: string): Promise<string> => {
  if (!englishText.trim()) {
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
          role: 'user',
          parts: [{ text: `You are an expert translator. Your sole purpose is to translate the following English text to Japanese. Do not add any extra commentary, notes, or explanations. Only return the raw Japanese translation.\n\nEnglish text: "${englishText}"` }]
      }]
    });

    return response.text;
  } catch (error) {
    console.error("Error during translation with Gemini API:", error);
    // Provide a more user-friendly error message
    throw new Error("Failed to get translation from the AI service. Please try again later.");
  }
};