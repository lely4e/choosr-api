import { authFetch } from "./auth";

export const updateUsername = async (newUsername: string): Promise<void> => {
  const response = await authFetch(
    `http://127.0.0.1:8000/me`,
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