import { ISendDataToBackend } from "@/types/Common";

export const sendDataToBackend = async (
  data: ISendDataToBackend,
): Promise<boolean> => {
  try {
    const response = await fetch("/api/user-visits", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending data to backend:", error);
    return false;
  }
};
