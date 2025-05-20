'use server'
import clientPromise from "../mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { planSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

export async function getUserPlans() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated")

    const client = await clientPromise
    const db = client.db('test')
    const plans = await db.collection('plans')
        .find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .toArray()
    return plans.map((plan) => ({
        _id: plan._id.toString(), 
        userId: plan.userId,
        title: plan.title,
        note: plan.note,
        created_at: plan.created_at instanceof Date
            ? plan.created_at.toISOString()
            : new Date(plan.created_at).toISOString(), 
    }))
}

export async function postUserPlans(formData: FormData): Promise<void> {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new Error("Not authenticated")

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
    revalidatePath('/')
}