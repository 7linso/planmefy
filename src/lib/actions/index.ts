'use server'

import clientPromise from "../mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { planSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUserPlans() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated");

    const client = await clientPromise
    const db = client.db('test')
    const plans = db.collection('plans')
        .find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .toArray()
    return plans
}

export async function postUserPlans(formData: FormData): Promise<void> {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated");

    const title = formData.get('title')
    const note = formData.get('note')
    const parsed = planSchema.safeParse({ title, note })
    if (!parsed.success) {
        console.error(parsed.error.flatten())
        throw new Error('Invalid Input')
    }

    const client = await clientPromise
    const db = client.db('test')
    await db.collection('plans').insertOne({
        userId: session.user.id,
        title,
        note,
        created_at: new Date()
    })
    revalidatePath('/')
    redirect('/')
}