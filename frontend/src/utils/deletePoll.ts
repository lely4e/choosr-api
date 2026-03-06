import { API_URL } from "../config";
import { authFetch } from "./auth";

export const deletePoll = async (uuid: string): Promise<void> => {
  const response = await authFetch(
    `${API_URL}/polls/${uuid}`,
    { method: "DELETE" }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
};
