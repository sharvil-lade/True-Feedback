import { GoogleGenerativeAI } from "@google/generative-ai";

export type ModerationLabel = "safe" | "borderline" | "toxic";

export interface ModerationResult {
  label: ModerationLabel;
  score: number;
  reason: string;
}

const FALLBACK: ModerationResult = {
  label: "safe",
  score: 0,
  reason: "moderation unavailable",
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function moderateMessage(
  content: string
): Promise<ModerationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `You are a content moderator for an anonymous messaging platform. Classify the message below.

Return ONLY valid JSON with no markdown, no code blocks, no extra text:
{"label":"safe","score":0.1,"reason":"brief reason under 100 chars"}

Label definitions:
- "safe": normal, friendly, curious, or neutral messages
- "borderline": mildly rude, passive-aggressive, uncomfortable, or suggestive but not clearly harmful
- "toxic": harassment, hate speech, threats, slurs, explicit sexual content directed at a person, severe cyberbullying

Score = toxicity level from 0.0 (completely clean) to 1.0 (extremely toxic).

Message: "${content.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return FALLBACK;

    const parsed = JSON.parse(jsonMatch[0]);

    if (!["safe", "borderline", "toxic"].includes(parsed.label)) return FALLBACK;

    return {
      label: parsed.label as ModerationLabel,
      score:
        typeof parsed.score === "number"
          ? Math.min(1, Math.max(0, parsed.score))
          : 0,
      reason:
        typeof parsed.reason === "string"
          ? parsed.reason.slice(0, 200)
          : "",
    };
  } catch {
    return FALLBACK;
  }
}
