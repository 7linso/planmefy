import { z } from "zod"

export const planSchema = z.object({
    title: z.string().min(3, 'Title is required and should be at least 3 characters long'),
    note: z.string().optional()
})