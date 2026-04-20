import { z } from "zod";

export const loginSchema = z.object({
    username: z.string(),
    password: z.string()
})

export type LoginFormErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;