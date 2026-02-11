
import { GoogleGenAI } from "@google/genai";

export const getEncouragement = async (topic: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("API Key is missing. Check your environment variables.");
    return "Уучлаарай, системд API Key тохируулаагүй байна. Та түр хүлээгээд дахин оролдоно уу.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Та Илчлэлт сүмийн вэбсайтын туслах байна. Дараах сэдэвтэй холбоотой урам зориг өгөх, Библи дээр үндэслэсэн богино (2-3 өгүүлбэр) мессеж Монгол хэлээр бичээрэй. Сэдэв: ${topic}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });

    return response.text || "Одоогоор хариу ирүүлж чадсангүй. Дахин оролдоно уу.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key not valid")) {
      return "Таны оруулсан API Key буруу байна. Google AI Studio-оос зөв түлхүүр авсан эсэхээ шалгаарай.";
    }
    return "Холболтын алдаа гарлаа. Та интернэтээ шалгаад дахин оролдоно уу.";
  }
};
