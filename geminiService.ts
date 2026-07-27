
export const getEncouragement = async (topic: string): Promise<string> => {
  try {
    const response = await fetch("/api/encouragement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();
    if (!response.ok) {
      return data.text || "Холболтын алдаа гарлаа. Та дараа дахин оролдоорой.";
    }

    return data.text || "Уучлаарай, хариу ирүүлж чадсангүй.";
  } catch (error: any) {
    console.error("Client fetch error for encouragement:", error);
    return "Холболтын алдаа гарлаа. Та дараа дахин оролдоорой.";
  }
};
