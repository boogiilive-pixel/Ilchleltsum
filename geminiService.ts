
import { GoogleGenAI } from "@google/genai";

export const getEncouragement = async (topic: string): Promise<string> => {
  // process.env.API_KEY-г Vite define тохиргооноос шууд авна
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    console.warn("API Key is currently empty or undefined. Please set the environment variable.");
    return "Одоогоор AI систем холбогдоогүй байна. Та түр хүлээгээд дахин оролдоно уу.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Би "Илчлэлт сүм" (Revelation Church)-ийн вэбсайт дээр байна. Надад дараах сэдвээр урам зориг өгөх богино хэмжээний (3-4 өгүүлбэр) Христийн шашны сургаал эсвэл Библийн эшлэл дээр үндэслэсэн үг хэлж өгөөч. Сэдэв: ${topic}. Хэл: Монгол хэл.`,
    });

    return response.text || "Уучлаарай, хариу ирүүлж чадсангүй.";
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    if (error.message?.includes("API key not valid")) {
      return "Таны оруулсан API Key буруу байна. Google AI Studio-оос түлхүүрээ дахин шалгана уу.";
    }
    return "Холболтын алдаа гарлаа. Та дараа дахин оролдоорой.";
  }
};
