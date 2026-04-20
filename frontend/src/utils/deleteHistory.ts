import toast from "react-hot-toast";
import { API_URL } from "../config";
import { authFetch } from "./auth";

export const deleteHistory = async (uuid: string, historyId: number): Promise<void> => {
  const response = await authFetch(
    `${API_URL}/polls/${uuid}/products/suggestion/${historyId}`,
    { method: "DELETE" }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    toast.error(data?.detail || "Failed to delete history");
    console.error("Failed to delete history:", data);
    return;
  }
};
