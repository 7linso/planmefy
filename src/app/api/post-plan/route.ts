import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { planSchema } from '@/schemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id)
        return NextResponse.json(
            { error: 'Not Authenticated' },
            { status: 400 }
        )
    try {
        const body = await req.json();

        const parseValidatedData = planSchema.safeParse(body);
        if (!parseValidatedData.success) {
            return NextResponse.json(
                { errors: parseValidatedData.error.flatten() },
                { status: 400 }
            );
        }

        const { title, note } = parseValidatedData.data;
        const userId = session.user.id

        const client = await clientPromise;
        const db = client.db('test');
        const result = await db.collection('plans').insertOne({
            userId,
            title,
            note,
            created_at: new Date(),
        });

        return NextResponse.json({ message: 'Plan Saved', id: result.insertedId });
    } catch (err) {
        console.error('Error saving plan:', err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        return NextResponse.json(
            { error: 'Not Authenticated' },
            { status: 400 }
        )
    try {
        const client = await clientPromise
        const db = client.db('test')
        const result = await db.collection('plans').find({ userId: session.user.id }).toArray()
        return NextResponse.json({ plans: result })
    } catch (err) {
        console.error('Error getting plans', err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}