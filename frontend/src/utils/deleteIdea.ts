import toast from "react-hot-toast";
import { API_URL } from "../config";
import { authFetch } from "./auth";

export const deleteIdea = async (ideaId: number): Promise<void> => {
  const response = await authFetch(
    `${API_URL}/ideas/${ideaId}`,
    { method: "DELETE" }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    toast.error(data?.detail || "Failed to delete idea");
    console.error("Failed to delete idea:", data);
    return;
  }
};
