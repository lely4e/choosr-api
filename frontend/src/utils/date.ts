import type { Poll } from "./types";

export const getTimeLeftPercentage = (poll: Poll) => {
    if (!poll.deadline) return 0;

    const now = Date.now();
    const start = new Date(poll.created_at).getTime();
    const end = new Date(poll.deadline).getTime();

    const total = end - start;
    const elapsed = now - start;

    if (total <= 0) return 0;

    return Math.max(0, Math.min(100, (elapsed / total) * 100))
};

export const daysLeft = (poll: Poll) => {
    if (!poll.deadline) return 0;

    const now = Date.now();
    const end = new Date(poll?.deadline).getTime();

    const left = end - now;
    return Math.max(0, Math.ceil((left / (1000 * 60 * 60 * 24))))
}