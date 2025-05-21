import { z } from 'zod'

export const planSchema = z.object(
    {
        title: z.string().min(3, 'Title is required'),
        note: z.string().optional(),
        startDate: z.string().refine(v => !isNaN(Date.parse(v)), {
            message: 'Start date is required',
        }),
        endDate: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
    }
).refine((data) => {
    if (!data.endDate && !data.startTime && !data.endTime) {
        return true
    }
    const start = new Date(`${data.startDate}T${data.startTime ?? '00:00'}`)
    const end = new Date(`${data.endDate ?? data.startDate}T${data.endTime ?? '23:59'}`)
    return start <= end
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
})
