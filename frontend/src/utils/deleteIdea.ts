import { API_URL } from "../config";
import { authFetch } from "./auth";

export const deleteIdea = async (ideaId: number): Promise<void> => {
  const response = await authFetch(
    `${API_URL}/ideas/${ideaId}`,
    { method: "DELETE" }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
};
