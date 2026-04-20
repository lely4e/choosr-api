import { z } from "zod";

export const productSchema = z.object({
    title: z.string().min(3, "Title is too short (min 3 characters)"),
    link: z.string().min(3, "Link is too short"),
    image: z.string().min(3, "Image link is too short"),
    rating: z.number().nonnegative("Rating must be 0 or greater").max(5, "Rating must be less than or equal to 5"),
    price: z.coerce.number().min(0, "Price must be 0 or greater")
})

export type ProductFormErrors = Partial<Record<keyof z.infer<typeof productSchema>, string>>;
