
import { GoogleGenAI } from "@google/genai";

/**
 * Generates spiritual encouragement or a Bible-based message in Mongolian using Gemini.
 */
export const getEncouragement = async (topic: string): Promise<string> => {
  try {
    // Correct initialization using named parameter and direct process.env.API_KEY access
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for basic text tasks like this
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Би "Илчлэлт сүм" (Revelation Church)-ийн вэбсайт дээр байна. Надад дараах сэдвээр урам зориг өгөх богино хэмжээний (3-4 өгүүлбэр) Христийн шашны сургаал эсвэл Библийн эшлэл дээр үндэслэсэн үг хэлж өгөөч. Сэдэв: ${topic}. Хэл: Монгол хэл.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // Directly accessing .text property as per guidelines (not a method call)
    return response.text || "Уучлаарай, хариу ирсэнгүй. Дахин оролдоно уу.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Холболтын алдаа гарлаа. Та дараа дахин оролдоно уу.";
  }
};
