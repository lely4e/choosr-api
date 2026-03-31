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

  const data = await response.json();
  console.log("Update data:", data)
  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
  return data as TitleItem;
};
