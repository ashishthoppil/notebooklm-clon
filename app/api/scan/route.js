import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import PdfParse from 'pdf-parse';
import { chunkText } from '@/lib/chunkText';
import clientPromise from '@/lib/mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {

    const client = await clientPromise;
    const DB_NAME = process.env.DB_NAME
    const db = client.db(DB_NAME);

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) throw new Error('No file provided');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF text
    const parsedData = await PdfParse(buffer);

    const pages = parsedData.text.split('\f');

    // Save file temporarily
    const filename = `upload-${Date.now()}.pdf`;
    const tmpPath = path.join('/tmp', filename);
    await writeFile(tmpPath, buffer);

    const chunks = chunkText(parsedData.text, 10000);
    
    if (chunks.length > 0) {
        const embeddings = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const embeddingRes = await openai.embeddings.create({
                model: 'text-embedding-ada-002',
                input: chunk,
            })
            if (embeddingRes) {
                const [{ embedding }] = embeddingRes.data
                embeddings.push({
                    chunk,
                    embedding,
                });  
            }
        }

        if (embeddings.length > 0) {
            const result = await db.collection('documents').insertOne({ fileName: file.name, kb: embeddings });
            if (result.acknowledged) {
                return NextResponse.json({
                    id: result.insertedId.toString(),
                    success: true,
                    fileUrl: `/${filename}`,
                });
            }
        }
    }

    return NextResponse.json({
      success: false,
      fileUrl: `/${filename}`,
    });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}