import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, "Username is too short"),
    password: z.string().min(8, "Password is too short")
})

export type LoginFormErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;