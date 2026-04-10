import { API_URL } from "../config";
import { authFetch } from "./auth";
import type { Poll } from "./types";

export const updatePoll = async (
  uuid: string,
  title: string,
  budget: number,
  description?: string,
  deadline?: string,
  manuallyClosed?: boolean,
): Promise<Poll> => {
  const body: Record<string, unknown> = { title, budget };
  if (description) body.description = description;
  if (deadline !== undefined) body.deadline = deadline;
  if (manuallyClosed !== undefined) body.manually_closed = manuallyClosed;

  console.log("Sending body:", JSON.stringify(body));
  console.log("Deadline value:", deadline);

  const response = await authFetch(`${API_URL}/polls/${uuid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      "Request failed";

    throw new Error(message);
  }
  return data as Poll;
};
