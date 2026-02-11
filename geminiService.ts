
import { GoogleGenAI } from "@google/genai";

/**
 * Generates spiritual encouragement or a Bible-based message in Mongolian using Gemini.
 */
export const getEncouragement = async (topic: string): Promise<string> => {
  try {
    // Check if process and API_KEY exist to prevent crash during boot
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : null;
    
    if (!apiKey) {
      return "Уучлаарай, системийн тохиргоо дутуу байна. Түр хүлээгээд дахин оролдоно уу.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Би "Илчлэлт сүм" (Revelation Church)-ийн вэбсайт дээр байна. Надад дараах сэдвээр урам зориг өгөх богино хэмжээний (3-4 өгүүлбэр) Христийн шашны сургаал эсвэл Библийн эшлэл дээр үндэслэсэн үг хэлж өгөөч. Сэдэв: ${topic}. Хэл: Монгол хэл.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "Хариу олдсонгүй. Та арай өөр сэдвээр хайгаад үзээрэй.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Холболтын алдаа гарлаа. Та дараа дахин оролдоно уу.";
  }
};
