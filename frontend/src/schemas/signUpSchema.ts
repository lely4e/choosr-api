import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().min(3, "Username is too short (min 3 characters)").max(20, "Username is too long (max 20 characters)"),
    email: z.string().min(6, "Email is too short (min 6 characters)").max(50, "Email is too long (max 50 characters)"),
    password: z.string().min(8, "Password is too short (min 8 characters)"),
})

export type SignupFormErrors = Partial<Record<keyof z.infer<typeof signupSchema>, string>>;