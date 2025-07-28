import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const client = await clientPromise;
    const DB_NAME = process.env.DB_NAME
    const db = client.db(DB_NAME);
    const document_knowledge = await db.collection('documents').findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, data: { document_knowledge } });
}