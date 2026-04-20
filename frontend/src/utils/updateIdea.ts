import toast from "react-hot-toast";
import { API_URL } from "../config";
import { authFetch } from "./auth";
import type { TitleItem } from "./types";

export const updateIdea = async (
  id: number,
  name: string,
): Promise<TitleItem> => {
  const body: Record<string, unknown> = { name };

  console.log("Sending body:", JSON.stringify(body));

  const response = await authFetch(`${API_URL}/ideas/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    toast.error(data?.detail || "Failed to update idea");
    console.error("Failed to update idea:", data);
  }
  
  return data as TitleItem;
};
