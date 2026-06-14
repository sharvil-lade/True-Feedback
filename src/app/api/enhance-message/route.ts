import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: "Message content is required", success: false },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0,
      },
    });

    const prompt = `You are a writing assistant. Enhance the following message to make it clearer, more articulate, and better expressed. Preserve the original meaning, intent, and tone exactly — do not add new ideas, change the subject, or alter the emotional direction. Return only the enhanced message with no explanation, no quotes, no prefix.

Original message: ${content}

Enhanced message:`;

    const result = await model.generateContent(prompt);
    const enhanced = result.response.text().trim();

    return NextResponse.json({ enhanced, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error enhancing message:", error);
    return NextResponse.json(
      { message: "Failed to enhance message", success: false },
      { status: 500 }
    );
  }
}
