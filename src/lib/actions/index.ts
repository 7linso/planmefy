'use server'
import clientPromise from "../mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { planSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

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
        // created_at: plan.created_at?.toISOString?.() ?? new Date().toISOString(),
    }))
}

export async function getUserPlansByDate(date: Date) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated")

    const client = await clientPromise
    const db = client.db('test')
    const plans = await db.collection('plans')
        .find({
            userId: session.user.id,
            startDate: date.toISOString().split('T')[0]
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
    }
    const parsed = planSchema.safeParse(raw)
    if (!parsed.success) {
        console.error(parsed.error.flatten())
        throw new Error('Invalid Input')
    }
    const client = await clientPromise
    const db = client.db('test')

    await db.collection('plans').insertOne({
        userId: session.user.id,
        ...parsed.data,
        created_at: new Date()
    })
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
        endTime: safeString(formData.get('endTime'))
    }
    const parsed = planSchema.safeParse(raw)
    if (!parsed.success) {
        console.error(parsed.error.flatten())
        throw new Error('Invalid Input')
    }

    const client = await clientPromise
    const db = client.db('test')

    await db.collection('plans').updateOne({
        userId: session.user.id,
        _id: new ObjectId(id),
    }, { ...parsed.data })

    revalidatePath('/calendar')
}