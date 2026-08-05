import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message?: string };

    const userMessage = String(message ?? "").trim();
    if (!userMessage) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an AI Cybersecurity Audit Assistant.

When explaining vulnerabilities:
1. Explain in simple language.
2. Explain business impact.
3. Provide risk level (Low/Medium/High).
4. Suggest mitigation.
          `.trim(),
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    return NextResponse.json({
      reply: completion.choices?.[0]?.message?.content ?? "",
    });
  } catch (error) {
    // Biar gampang debug di terminal
    console.error("AI route error:", error);

    return NextResponse.json(
      { reply: `Gagal terhubung ke AI service: ${error instanceof Error ? error.message : "Invalid API Key / Error"}. Mohon periksa GROQ_API_KEY di file .env.` },
      { status: 500 }
    );
  }
}