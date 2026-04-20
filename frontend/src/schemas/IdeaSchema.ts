import { z } from "zod";

export const ideaSchema = z.object({
    name: z.string().min(3, "Title is too short (min 3 characters)"),
    categoryRelation: z.string().min(1, "Please select a relation"),
    categoryHobbies: z.string().min(1, "Please select a hobby"),
    categoryGift: z.string().min(1, "Please select a gift type"),
})

export type IdeaFormErrors = Partial<Record<keyof z.infer<typeof ideaSchema>, string>>;
