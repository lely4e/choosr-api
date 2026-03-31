import { API_URL } from "../config";
import { authFetch } from "./auth";

export const deleteHistory = async (uuid: string, historyId: number): Promise<void> => {
  const response = await authFetch(
    `${API_URL}/polls/${uuid}/products/suggestion/${historyId}`,
    { method: "DELETE" }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
};
