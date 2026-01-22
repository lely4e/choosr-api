import { authFetch } from "./auth";

export const deletePoll = async (uuid: string): Promise<void> => {
  const response = await authFetch(
    `http://127.0.0.1:8000/${uuid}`,
    { method: "DELETE" }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
};
