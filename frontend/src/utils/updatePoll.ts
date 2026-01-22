import { authFetch } from "./auth";

export const updatePoll = async (uuid: string, title: string, budget: number): Promise<void> => {
  const response = await authFetch(
    `http://127.0.0.1:8000/${uuid}`,    
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, budget }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
}