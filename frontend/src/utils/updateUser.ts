import { API_URL } from "../config";
import { authFetch } from "./auth";

export const updateUsername = async (newUsername: string): Promise<void> => {
  const response = await authFetch(
    `${API_URL}/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: newUsername }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
};