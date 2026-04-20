import toast from "react-hot-toast";
import { API_URL } from "../config";
import { authFetch } from "./auth";

export const deletePoll = async (uuid: string): Promise<void> => {
  const response = await authFetch(
    `${API_URL}/polls/${uuid}`,
    { method: "DELETE" }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    toast.error(data?.detail || "Failed to delete poll");
    console.error("Failed to delete poll:", data);
    return;
  }
};
