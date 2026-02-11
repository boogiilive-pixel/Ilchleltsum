
import { GoogleGenAI } from "@google/genai";

/**
 * Generates spiritual encouragement or a Bible-based message in Mongolian using Gemini.
 * Uses gemini-3-pro-preview for nuanced and thoughtful spiritual responses.
 */
export const getEncouragement = async (topic: string): Promise<string> => {
  try {
    // Initialize the Gemini API client inside the function for better robustness in production environments.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Би "Илчлэлт сүм" (Revelation Church)-ийн вэбсайт дээр байна. Надад дараах сэдвээр урам зориг өгөх богино хэмжээний (3-4 өгүүлбэр) Христийн шашны сургаал эсвэл Библийн эшлэл дээр үндэслэсэн үг хэлж өгөөч. Сэдэв: ${topic}. Хэл: Монгол хэл.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // Directly access the text property as per guidelines (getter, not a method).
    return response.text || "Уучлаарай, хариу ирсэнгүй. Дахин оролдоно уу.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Холболтын алдаа гарлаа. Та дараа дахин оролдоно уу.";
  }
};
