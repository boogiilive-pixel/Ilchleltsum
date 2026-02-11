
import { GoogleGenAI } from "@google/genai";

/**
 * Generates spiritual encouragement or a Bible-based message in Mongolian using Gemini.
 */
export const getEncouragement = async (topic: string): Promise<string> => {
  try {
    // Initialize the GoogleGenAI client using process.env.API_KEY directly as required by the guidelines.
    // The key is assumed to be pre-configured and accessible in the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Би "Илчлэлт сүм" (Revelation Church)-ийн вэбсайт дээр байна. Надад дараах сэдвээр урам зориг өгөх богино хэмжээний (3-4 өгүүлбэр) Христийн шашны сургаал эсвэл Библийн эшлэл дээр үндэслэсэн үг хэлж өгөөч. Сэдэв: ${topic}. Хэл: Монгол хэл.`,
    });

    // Extracting text from GenerateContentResponse using the .text property (not a method).
    const encouragement = response.text;
    return encouragement || "Таны сонгосон сэдвээр одоогоор хариу ирүүлж чадсангүй. Та дахин оролдоорой.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Холболтын түр зуурын саатал гарлаа. Та дараа дахин оролдоорой.";
  }
};
