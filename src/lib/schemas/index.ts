import { z } from 'zod'

export const recurringPlanSchema = z.object({
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
    ]),
    repeatType: z.enum(['every-day', 'every-week', 'every-month', 'every-year', 'custom']),
    repeatOn: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
    const start = new Date(`${data.startDate}T${data.startTime ?? '00:00'}`)
    const end = new Date(`${data.endDate ?? data.startDate}T${data.endTime ?? '23:59'}`)

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

    if (data.repeatType === 'custom') {
        if (!data.repeatOn || data.repeatOn.length === 0) {
            ctx.addIssue({
                path: ['repeatOn'],
                code: z.ZodIssueCode.custom,
                message: 'Please select at least one day for custom repeat.',
            });
        }
    } else if (data.repeatOn && data.repeatOn.length > 0) {
        ctx.addIssue({
            path: ['repeatOn'],
            code: z.ZodIssueCode.custom,
            message: 'repeatOn should be empty unless custom is selected.',
        });
    }
})


export const singleInstancePlanSchema = z.object({
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
    ]),
}).superRefine((data, ctx) => {
    const start = new Date(`${data.startDate}T${data.startTime ?? '00:00'}`)
    const end = new Date(`${data.endDate ?? data.startDate}T${data.endTime ?? '23:59'}`)

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
  
