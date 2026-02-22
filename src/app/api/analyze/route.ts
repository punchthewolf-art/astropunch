import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const birthdate = formData.get("birthdate") as string;
    if (!birthdate) {
      return NextResponse.json({ error: "Birth date is required" }, { status: 400 });
    }

    let cvText = "";
    const cvFile = formData.get("cv") as File | null;
    if (cvFile && cvFile.size > 0) {
      const buffer = await cvFile.arrayBuffer();
      cvText = new TextDecoder().decode(buffer).slice(0, 3000);
    }

    const prompt = `You are a fantastical and entertaining career astrologer. Based on the birth date ${birthdate}${cvText ? ` and this CV extract: "${cvText}"` : ""}, generate a complete astro-punch reading.

Be funny, creative, and use lots of emojis. The tone is fun and encouraging, never negative. Invent amusing concepts (Career Ascendant, Cosmic Score, etc.)

Return ONLY valid JSON with this exact structure:
{
  "sign": "The person's career zodiac sign (invented fun name)",
  "ascendant": "Career Ascendant (invented fun concept)",
  "cosmicScore": 85,
  "powers": [
    {"name": "Power Name", "description": "Short fun description", "emoji": "relevant emoji"},
    {"name": "Power Name", "description": "Short fun description", "emoji": "relevant emoji"},
    {"name": "Power Name", "description": "Short fun description", "emoji": "relevant emoji"}
  ],
  "traps": [
    {"name": "Trap Name", "description": "Short fun description", "emoji": "relevant emoji"},
    {"name": "Trap Name", "description": "Short fun description", "emoji": "relevant emoji"},
    {"name": "Trap Name", "description": "Short fun description", "emoji": "relevant emoji"}
  ],
  "prediction": "Fun and encouraging career prediction for 2026 (2-3 sentences)",
  "compatibleJobs": ["Job 1", "Job 2", "Job 3"],
  "avoidJobs": ["Job 1 (with funny reason)", "Job 2 (with funny reason)", "Job 3 (with funny reason)"]
}`;

    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse response" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
