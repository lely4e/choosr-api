import { z } from "zod";

export const pollSchema = z.object({
    title: z.string().min(3, "Title is too short (min 3 characters)").max(40, "Title is too long (max 40 characters)"),
    budget: z.number().nonnegative("Budget must be 0 or greater").min(1, "Budget cannot be empty"),
    description: z.string().min(3, "Description is too short (min 3 characters").max(140,"Description is too long (max 140 characters").optional(),
    deadline: z.string().optional(),
    manually_closed: z.boolean().optional(),
})

export type PollFormErrors = Partial<Record<keyof z.infer<typeof pollSchema>, string>>;