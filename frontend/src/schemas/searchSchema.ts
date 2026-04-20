import { z } from "zod";

export const searchSchema = z.object({
    title: z.string().min(3, "Title is too short (min 2 characters)"),
})

export type SearchFormErrors = Partial<Record<keyof z.infer<typeof searchSchema>, string>>;
