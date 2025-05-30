import { z } from 'zod'

export const planSchema = z.object({
    title: z.string().min(3, 'Title is missing or it is too short'),
    note: z.string().optional(),
    startDate: z.string().refine(v => !isNaN(Date.parse(v)), {
        message: 'Start date is required',
    }),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    eventType: z.enum(['indoor', 'outdoor']).optional(),
    location: z.string().optional(),
    icon: z.union([
        z.string().emoji('Must be a valid emoji'),
        z.literal(''),
    ])
}).superRefine((data, ctx) => {
    if (!data.endDate && !data.startTime && !data.endTime) return

    const start = new Date(`${data.startDate}T${data.startTime ?? '00:00'}`)
    const end = new Date(`${data.endDate ?? data.startDate}T${data.endTime ?? '23:59'}`)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return
    }
    if (start > end) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'End time must be after start time',
            path: ['endTime'],
        })
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'End date must be after start date',
            path: ['endDate'],
        })
    }
})
