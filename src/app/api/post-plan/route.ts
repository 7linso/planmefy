import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { planSchema } from '@/schemas';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parseValidatedData = planSchema.safeParse(body);
        if (!parseValidatedData.success) {
            return NextResponse.json(
                { errors: parseValidatedData.error.flatten() },
                { status: 400 }
            );
        }

        const { userId, title, note } = parseValidatedData.data;

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
        console.error('❌ Error saving plan:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
