import { z } from "zod"

export const planSchema = z.object({
    userId: z.string().min(1),
    title: z.string().min(3, 'Title is required and should be at least 3 characters long'),
    note: z.string().optional(),
    // created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    //     message: "Invalid date format",
    // })
})