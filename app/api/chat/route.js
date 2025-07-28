import { openai } from '@ai-sdk/openai';
import { OpenAI } from 'openai'
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { cosineSimilarity } from '@/lib/utils';

export const runtime = 'edge'

const openaiObj = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const response = await request.json();
    let { id, messages } = response;   

    const BASE_URL = process.env.BASE_URL

    if (!messages?.length) {
      return NextResponse.json({ success: false, message: 'No messages provided' });
    }

    // Create embeddings
    const embeddingResponse = await openaiObj.embeddings.create({
      model: 'text-embedding-ada-002',
      input: messages[messages.length - 1].content,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding
  
    // Retrieve embeddings
    const embeddingsResponse = await fetch(`${BASE_URL}/api/retrieve-embeddings?id=${id}`);
    const document_knowledge = await embeddingsResponse.json();
    const knowledge = document_knowledge.data.document_knowledge;

    if (!knowledge.kb[0]['embedding'].length) {
      const intentResult = await streamText({
        model: openai('gpt-4o-mini'),
        system: `You are a helpful assistant. You must strictly follow the given command without deviation. 
                DO NOT interpret, rephrase, or add additional information. Just execute the command exactly as stated.`,
        prompt: `Respond with: The chatbot has not undergone training yet.`,
        temperature: 0
      });

      return intentResult.toDataStreamResponse();
    }

  
    const scoredChunks = knowledge.kb.map((item) => {
      const score = cosineSimilarity(queryEmbedding, item.embedding)
      return { chunk: item.chunk, score }
    })
  
    scoredChunks.sort((a, b) => b.score - a.score)
    const topChunks = scoredChunks.slice(0, 3).map((item) => item.chunk)

    const instructions = [{
      role: 'system',
      content: `
        You are a helpful assistant that answers anything that the user asks.
        You have the following context:
        ${topChunks.join('\n---\n')}
  
        1. Answer the user's query **only** using the provided text.
        2. If the answer is not in the context, disclaim that you don't have information on that.
        3. Do not reveal that you are using chunked or embedded data. Do not show any extra text beyond what is in the chunks.
      `
    }, ...messages];

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: instructions,
      temperature: 0
    });
    
    const responseStream = result.toDataStreamResponse();
    return responseStream;
  } catch (e) {
    console.log('Error has occured:', e.message);
  }
}