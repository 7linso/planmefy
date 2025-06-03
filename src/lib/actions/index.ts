'use server'
import clientPromise from "../mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { planSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { addDays, addWeeks, addMonths, isSameDay } from 'date-fns'

export async function getAllUserPlans() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated")

    const client = await clientPromise
    const db = client.db('test')
    const plans = await db.collection('plans')
        .find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .toArray()

    const isValidTime = (value: any): value is string =>
        typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)

    return plans.map((plan) => ({
        _id: plan._id.toString(),
        title: plan.title,
        note: plan.note,
        startDate: plan.startDate ?? null,
        endDate: plan.endDate ?? null,
        startTime: isValidTime(plan.startTime) ? plan.startTime : null,
        endTime: isValidTime(plan.endTime) ? plan.endTime : null,
        eventType: plan.eventType,
        location: plan.location,
        icon: plan.icon,
        repeatOn: plan.repeatOn,
        repeatType: plan.repeatType
        // created_at: plan.created_at?.toISOString?.() ?? new Date().toISOString(),
    }))
}

export async function getUserPlansByDate(date: Date) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated")

    const client = await clientPromise
    const db = client.db('test')

    const dateStr = date.toISOString().split('T')[0]

    const plans = await db.collection('plans')
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
        note: plan.note,
        startDate: plan.startDate ?? null,
        endDate: plan.endDate ?? null,
        startTime: isValidTime(plan.startTime) ? plan.startTime : null,
        endTime: isValidTime(plan.endTime) ? plan.endTime : null,
        eventType: plan.eventType,
        location: plan.location,
        icon: plan.icon,
        repeatOn: plan.repeatOn,
        repeatType: plan.repeatType

        // created_at: plan.created_at?.toISOString?.() ?? new Date().toISOString(),
    }))
}

export async function getUserPlansById(id: string, userId: string) {
    const client = await clientPromise
    const db = client.db('test')

    let objectId
    try {
        objectId = new ObjectId(id)
    } catch (err) {
        console.warn('[Invalid ObjectId]', id)
        return null
    }
    console.log('[getUserPlansById] ID:', id)
    console.log('[getUserPlansById] userId:', userId)

    const plan = await db.collection('plans').findOne({
        _id: objectId,
        userId,
    })

    if (!plan) {
        console.warn('[Plan not found]', { _id: objectId.toString(), userId })
        return null
    }
    return {
        _id: plan._id.toString(),
        title: plan.title,
        note: plan.note,
        startDate: plan.startDate,
        endDate: plan.endDate,
        startTime: plan.startTime,
        endTime: plan.endTime,
        eventType: plan.eventType,
        location: plan.location,
        icon: plan.icon,
        repeatOn: plan.repeatOn,
        repeatType: plan.repeatType
    }
}

export async function postUserPlans(formData: FormData): Promise<void> {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) throw new Error("Not authenticated")

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
        repeatOn: (formData.getAll('repeatOn') as string[]),
    }

    const parsed = planSchema.safeParse(raw)
    if (!parsed.success) {
        console.error(parsed.error.flatten())
        throw new Error('Invalid Input')
    }

    const data = parsed.data
    const baseDate = new Date(data.startDate)
    const plans: any[] = []

    if (!data.repeatType) {
        plans.push({
            userId: session.user.id,
            ...data,
            created_at: new Date()
        })
    } else {
        let currentDate = baseDate
        let count = 0

        while (plans.length < 30 && count < 365) {
            let include = false

            if (data.repeatType === 'every-day') {
                include = true
            } else if (data.repeatType === 'every-week') {
                include = true
            } else if (data.repeatType === 'every-month') {
                include = true
            } else if (data.repeatType === 'custom') {
                const dayStr = currentDate.toLocaleDateString('en-US', { weekday: 'short' })
                if (data.repeatOn && data.repeatOn.includes(dayStr)) {
                    include = true
                }
            }

            if (include) {
                plans.push({
                    userId: session.user.id,
                    ...data,
                    startDate: currentDate.toISOString().split('T')[0],
                    created_at: new Date()
                })
            }
            if (data.repeatType === 'every-day' || data.repeatType === 'custom') {
                currentDate = addDays(currentDate, 1)
            } else if (data.repeatType === 'every-week') {
                currentDate = addWeeks(currentDate, 1)
            } else if (data.repeatType === 'every-month') {
                currentDate = addMonths(currentDate, 1)
            }
            count++
        }

    }

    const client = await clientPromise
    const db = client.db('test')
    await db.collection('plans').insertMany(plans)

    revalidatePath('/calendar')
    redirect('/calendar')
}

export async function deleteUserPlan(id: string) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated")

    const client = await clientPromise
    const db = client.db('test')
    try {
        const result = await db.collection("plans").deleteOne({
            userId: session.user.id,
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            throw new Error("Plan not found or not owned by user");
        }
    } catch (err) {
        console.error("Delete failed:", err);
    }
    revalidatePath('/calendar')
}

export async function updateUserPlan(formData: FormData, id: string) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated")

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
        repeatOn: (formData.getAll('repeatOn') as string[]),
    }
    const parsed = planSchema.safeParse(raw)
    console.log('Submitting raw:', raw)

    if (!parsed.success) {
        console.error(parsed.error.flatten())
        throw new Error('Invalid Input')
    }
    const client = await clientPromise
    const db = client.db('test')

    await db.collection('plans').updateOne({
        userId: session.user.id,
        _id: new ObjectId(id),
    }, { $set: parsed.data })

    revalidatePath('/calendar')
    redirect(`/calendar`)
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
