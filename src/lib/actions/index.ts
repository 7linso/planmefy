'use server'
import clientPromise from "../mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { recurringPlanSchema, singleInstancePlanSchema } from '@/lib/schemas'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { addDays, addWeeks, addMonths, isSameDay } from 'date-fns'
import { z } from 'zod'

// export async function getAllUserPlans() {
//     const session = await getServerSession(authOptions)
//     if (!session || !session.user)
//         throw new Error("Not authenticated")

//     const client = await clientPromise
//     const db = client.db('test')
//     const plans = await db.collection('plans')
//         .find({ userId: session.user.id })
//         .sort({ createdAt: -1 })
//         .toArray()

//     const isValidTime = (value: any): value is string =>
//         typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)

//     return plans.map((plan) => ({
//         _id: plan._id.toString(),
//         title: plan.title,
//         note: plan.note,
//         startDate: plan.startDate ?? null,
//         endDate: plan.endDate ?? null,
//         startTime: isValidTime(plan.startTime) ? plan.startTime : null,
//         endTime: isValidTime(plan.endTime) ? plan.endTime : null,
//         eventType: plan.eventType,
//         location: plan.location,
//         icon: plan.icon,
//         repeatOn: plan.repeatOn,
//         repeatType: plan.repeatType
//         // created_at: plan.created_at?.toISOString?.() ?? new Date().toISOString(),
//     }))
// }

export async function getUserPlansByDate(date: Date) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        throw new Error('Not authenticated')
    }

    const client = await clientPromise
    const db = client.db('test')
    const dateStr = date.toISOString().split('T')[0]

    const plans = await db.collection('plan_instances')
        .find({
            userId: session.user.id,
            startDate: { $lte: dateStr },
            $or: [
                { endDate: { $gte: dateStr } },
                { endDate: null, startDate: dateStr },
                { endDate: { $exists: false }, startDate: dateStr },
            ]
        })

        .sort({ createdAt: -1 })
        .toArray()

    const isValidTime = (value: any): value is string =>
        typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)

    return plans.map((plan) => ({
        _id: plan._id.toString(),
        title: plan.title,
        note: plan.note ?? undefined,
        startDate: plan.startDate ?? undefined,
        endDate: plan.endDate ?? undefined,
        startTime: isValidTime(plan.startTime) ? plan.startTime : undefined,
        endTime: isValidTime(plan.endTime) ? plan.endTime : undefined,
        eventType: plan.eventType ?? undefined,
        location: plan.location ?? undefined,
        icon: plan.icon ?? '⭐',
        repeatOn: Array.isArray(plan.repeatOn) ? plan.repeatOn : [],
        repeatType: plan.repeatType ?? undefined,
        createdAt: plan.createdAt?.toISOString?.() ?? new Date().toISOString(),
    }))

}

export async function getUseRrecurringPlanById(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Not authenticated")

    const userId = session.user.id
    const client = await clientPromise
    const db = client.db('test')

    let objectId: ObjectId
    try {
        objectId = new ObjectId(id)
    } catch (err) {
        console.warn('[Invalid ObjectId]', id)
        return null
    }

    const plan = await db.collection('recurring_plans').findOne({
        _id: objectId,
        userId
    })

    if (!plan) {
        console.warn('[Reccuring Plan not found]', { _id: id, userId })
        return null
    }
    console.log(plan)
    return {
        repeatType: plan.repeatType ?? undefined,
        repeatOn: plan.repeatOn ?? [],
    }
}

export async function getUserPlansById(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Not authenticated")

    const userId = session.user.id
    const client = await clientPromise
    const db = client.db('test')

    let objectId: ObjectId
    try {
        objectId = new ObjectId(id)
    } catch (err) {
        console.warn('[Invalid ObjectId]', id)
        return null
    }

    const plan = await db.collection('plan_instances').findOne({
        _id: objectId,
        userId
    })

    if (!plan) {
        console.warn('[Plan not found]', { _id: id, userId })
        return null
    }

    const isValidTime = (value: any): value is string =>
        typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)

    return {
        _id: plan._id.toString(),
        title: plan.title,
        note: plan.note ?? undefined,
        startDate: plan.startDate,
        endDate: plan.endDate ?? undefined,
        startTime: isValidTime(plan.startTime) ? plan.startTime : undefined,
        endTime: isValidTime(plan.endTime) ? plan.endTime : undefined,
        eventType: plan.eventType ?? undefined,
        location: plan.location ?? undefined,
        icon: plan.icon ?? '',
        repeatOn: Array.isArray(plan.repeatOn) ? plan.repeatOn : [],
        repeatType: plan.repeatType ?? undefined,
        recurringId: plan.recurringId ? plan.recurringId.toString() : undefined
    }
}

export async function postUserPlans(formData: FormData): Promise<void> {
    type RecurringPlan = z.infer<typeof recurringPlanSchema>

    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error('Not authenticated')

    const timezone = formData.get('timezone')?.toString() || 'UTC'

    const safeString = (v: FormDataEntryValue | null) =>
        typeof v === 'string' && v.trim() !== '' ? v : undefined

    const raw = {
        title: formData.get('title'),
        note: safeString(formData.get('note')),
        startDate: formData.get('startDate'),
        endDate: safeString(formData.get('endDate')),
        startTime: safeString(formData.get('startTime')),
        endTime: safeString(formData.get('endTime')),
        eventType: safeString(formData.get('eventType')),
        location: safeString(formData.get('location')),
        icon: formData.get('icon'),
        repeatType: safeString(formData.get('repeatType')),
        repeatOn: formData.getAll('repeatOn') as string[],
    }

    const isRepeating = !!raw.repeatType
    const parsed = isRepeating
        ? recurringPlanSchema.safeParse(raw)
        : singleInstancePlanSchema.safeParse(raw)

    if (!parsed.success) {
        console.error(parsed.error.flatten())
        throw new Error('Invalid input')
    }

    const data = parsed.data
    const userId = session.user.id
    const baseDate = new Date(data.startDate)
    const client = await clientPromise
    const db = client.db('test')

    if (!isRepeating) {
        await db.collection('plan_instances').insertOne({
            userId,
            ...data,
            created_at: new Date()
        })
    } else {
        const recurringData = data as RecurringPlan

        const { insertedId } = await db.collection('recurring_plans').insertOne({
            userId,
            title: recurringData.title,
            note: recurringData.note,
            startTime: recurringData.startTime,
            endTime: recurringData.endTime,
            eventType: recurringData.eventType,
            location: recurringData.location,
            icon: recurringData.icon,
            repeatType: recurringData.repeatType,
            repeatOn: recurringData.repeatOn,
            startDate: recurringData.startDate,
            endDate: recurringData.endDate,
            created_at: new Date()
        })

        const instances: any[] = []
        let currentDate = new Date(recurringData.startDate)
        let count = 0

        const dayFormatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            timeZone: timezone,
        })

        while (instances.length < 30 && count < 365) {
            const dayStr = dayFormatter.format(currentDate) // e.g. "Mon", "Tue"
            let include = false

            if (recurringData.repeatType === 'every-day') include = true
            else if (recurringData.repeatType === 'every-week') include = true
            else if (recurringData.repeatType === 'every-month') include = true
            else if (
                recurringData.repeatType === 'custom' &&
                recurringData.repeatOn?.includes(dayStr)
            ) {
                include = true
            }

            if (include) {
                instances.push({
                    userId,
                    recurringId: insertedId,
                    title: recurringData.title,
                    note: recurringData.note,
                    location: recurringData.location,
                    eventType: recurringData.eventType,
                    icon: recurringData.icon,
                    startDate: currentDate.toISOString().split('T')[0],
                    startTime: recurringData.startTime,
                    endDate: recurringData.endDate,
                    endTime: recurringData.endTime,
                    created_at: new Date()
                })
            }

            if (['every-day', 'custom'].includes(recurringData.repeatType))
                currentDate = addDays(currentDate, 1)
            else if (recurringData.repeatType === 'every-week')
                currentDate = addWeeks(currentDate, 1)
            else if (recurringData.repeatType === 'every-month')
                currentDate = addMonths(currentDate, 1)

            count++
        }

        if (instances.length > 0) {
            await db.collection('plan_instances').insertMany(instances)
        }
    }

    revalidatePath('/calendar')
    redirect('/calendar')
}

export async function validateBasicPlan(raw: Record<string, any>) {
    const errors: Record<string, string | undefined> = {}

    if (!raw.title || raw.title.trim().length < 3) {
        errors.title = 'Title must be at least 3 characters long'
    }

    if (!raw.startDate) {
        errors.startDate = 'Start date is required'
    }

    if (raw.endDate && raw.startDate) {
        const start = new Date(`${raw.startDate}T${raw.startTime ?? '00:00'}`)
        const end = new Date(`${raw.endDate}T${raw.endTime ?? '23:59'}`)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            errors.endDate = 'Invalid date format'
        } else if (start > end) {
            errors.endDate = 'End date/time must be after start'
            errors.endTime = 'End time must be after start time'
        }
    }

    if (raw.repeatType === 'custom' && (!raw.repeatOn || raw.repeatOn.length === 0)) {
        errors.repeatOn = 'Select at least one day'
    }

    return errors
}

export async function deleteUserPlan(id: string, targetType: 'instance' | 'recurring') {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Not authenticated")

    const userId = session.user.id
    const client = await clientPromise
    const db = client.db('test')

    let _id: ObjectId
    try {
        _id = new ObjectId(id)
    } catch (err) {
        console.error('[Invalid ObjectId]', id)
        throw new Error("Invalid plan ID")
    }

    try {
        if (targetType === 'instance') {
            const result = await db.collection('plan_instances').deleteOne({
                _id,
                userId: String(userId),
            })

            if (result.deletedCount === 0) {
                console.warn('[Instance not deleted]', { _id: id, userId })
                throw new Error("Plan instance not found or not owned by user")
            }

        } else if (targetType === 'recurring') {
            const instancesResult = await db.collection('plan_instances').deleteMany({
                recurringId: _id,
                userId: String(userId),
            })

            const recurringResult = await db.collection('recurring_plans').deleteOne({
                _id,
                userId: String(userId),
            })

            if (recurringResult.deletedCount === 0) {
                console.warn('[Recurring not deleted]', { _id: id, userId })
                throw new Error("Recurring plan not found or not owned by user")
            }
            // console.log(`[Deleted] ${instancesResult.deletedCount} instances + recurring rule`)
        }

        revalidatePath('/calendar')
        redirect('/calendar')
    } catch (err) {
        console.error("Delete failed:", err)
        throw new Error("Failed to delete plan")
    }
}

function getLocalMidnight(date: Date): Date {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date)

    const y = Number(parts.find(p => p.type === 'year')?.value)
    const m = Number(parts.find(p => p.type === 'month')?.value) - 1
    const d = Number(parts.find(p => p.type === 'day')?.value)

    return new Date(y, m, d) 
}

function getWeekdayString(date: Date): string {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(date)
}
  

type TargetType = 'instance' | 'recurring'

export async function updateUserPlan(
    formData: FormData,
    id: string,
    targetType: TargetType
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Not authenticated')

    const safeString = (v: FormDataEntryValue | null) =>
        typeof v === 'string' && v.trim() !== '' ? v : undefined

    const raw = {
        title: formData.get('title'),
        note: safeString(formData.get('note')),
        startDate: formData.get('startDate'),
        endDate: safeString(formData.get('endDate')),
        startTime: safeString(formData.get('startTime')),
        endTime: safeString(formData.get('endTime')),
        eventType: safeString(formData.get('eventType')),
        location: safeString(formData.get('location')),
        icon: formData.get('icon'),
        repeatType: safeString(formData.get('repeatType')),
        repeatOn: formData.getAll('repeatOn') as string[],
    }

    const parsed =
        targetType === 'recurring'
            ? recurringPlanSchema.safeParse(raw)
            : singleInstancePlanSchema.safeParse(raw)

    if (!parsed.success) {
        console.error('[Validation Error]', parsed.error.flatten())
        throw new Error('Invalid Input')
    }

    const data = parsed.data
    const userId = session.user.id
    const client = await clientPromise
    const db = client.db('test')

    const _id = new ObjectId(id)

    if (targetType === 'recurring') {
        await db.collection('recurring_plans').updateOne(
            { _id, userId },
            { $set: data }
        )

        const startEditDate = new Date(data.startDate)

        await db.collection('plan_instances').deleteMany({
            recurringId: _id,
            userId,
            startDate: { $gte: startEditDate.toISOString().split('T')[0] }
        })

        const recurringData = data as z.infer<typeof recurringPlanSchema>
        const { repeatType, repeatOn } = recurringData

        let currentDate = new Date(data.startDate)
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const instances: any[] = []
        let count = 0

        while (instances.length < 30 && count < 365) {
            const localMidnight = getLocalMidnight(currentDate)
            const dayStr = getWeekdayString(localMidnight)

            let include = false
            if (repeatType === 'every-day') include = true
            else if (repeatType === 'every-week') include = true
            else if (repeatType === 'every-month') include = true
            else if (repeatType === 'custom' && repeatOn?.includes(dayStr)) include = true

            if (include) {
                instances.push({
                    userId,
                    recurringId: _id,
                    title: data.title,
                    note: data.note,
                    startDate: localMidnight.toISOString().split('T')[0],
                    endDate: data.endDate,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    eventType: data.eventType,
                    location: data.location,
                    icon: data.icon,
                    created_at: new Date()
                })
            }

            if (['every-day', 'custom'].includes(repeatType)) {
                currentDate.setDate(currentDate.getDate() + 1)
            } else if (repeatType === 'every-week') {
                currentDate.setDate(currentDate.getDate() + 7)
            } else if (repeatType === 'every-month') {
                currentDate.setMonth(currentDate.getMonth() + 1)
            }

            count++
        }


        if (instances.length > 0) {
            await db.collection('plan_instances').insertMany(instances)
        }
    }
    revalidatePath('/calendar')
    redirect('/calendar')
}


export async function getCoordsForLocation(location: string) {
    const key = process.env.MAPTILER_API_KEY
    if (!key) throw new Error('Missing key for geocoding')

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(
        location
    )}.json?key=${key}&limit=1`

    const res = await fetch(url)
    if (!res.ok) return null

    const data = await res.json()
    const feature = data.features?.[0]

    return {
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        formatted: feature.place_name
    }
}

export async function getWeatherForecast({
    date,
    lat,
    lon,
}: {
    date: string
    lat: number
    lon: number
}) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto&start_date=${date}&end_date=${date}`

    const res = await fetch(url)

    if (!res.ok) return null

    const data = await res.json()
    const forecast = data?.daily

    if (!forecast || !forecast.temperature_2m_max) return null

    return {
        temp: forecast.temperature_2m_max[0],
        rain: forecast.precipitation_sum[0],
    }
}
