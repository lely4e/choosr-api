import { authFetch } from "./auth";
import type { Poll } from "./types";

export const updatePoll = async (
  uuid: string,
  title: string,
  budget: number,
  description?: string,
  deadline?: string,
): Promise<Poll> => {
  const body: Record<string, unknown> = { title, budget };
  if (description) body.description = description;
  if (deadline !== undefined) body.deadline = deadline;

  console.log("Sending body:", JSON.stringify(body));
  console.log("Deadline value:", deadline);

  const response = await authFetch(`http://127.0.0.1:8000/polls/${uuid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unauthorized");
  }
  return data as Poll;
};
