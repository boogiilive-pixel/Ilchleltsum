
import { GoogleGenAI } from "@google/genai";

/**
 * Generates spiritual encouragement or a Bible-based message in Mongolian using Gemini.
 */
export const getEncouragement = async (topic: string): Promise<string> => {
  try {
    // Access API Key in a way that is less likely to cause ReferenceError
    const key = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    
    if (!key) {
      console.warn("API Key is missing. Returning fallback message.");
      return "Урам зориг өгөх үгс бэлтгэгдэж байна. Түр хүлээгээд дахин оролдоно уу.";
    }

    const ai = new GoogleGenAI({ apiKey: key });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Би "Илчлэлт сүм" (Revelation Church)-ийн вэбсайт дээр байна. Надад дараах сэдвээр урам зориг өгөх богино хэмжээний (3-4 өгүүлбэр) Христийн шашны сургаал эсвэл Библийн эшлэл дээр үндэслэсэн үг хэлж өгөөч. Сэдэв: ${topic}. Хэл: Монгол хэл.`,
    });

    return response.text || "Таны сонгосон сэдвээр одоогоор хариу ирүүлж чадсангүй. Та дахин оролдоорой.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Холболтын түр зуурын саатал гарлаа. Та дараа дахин оролдоорой.";
  }
};
