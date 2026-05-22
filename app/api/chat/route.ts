import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/chat";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const response = generateChatResponse(String(query ?? ""));
    return NextResponse.json({ response });
  } catch {
    return NextResponse.json(
      { response: "Risk Advisor unavailable. Contact info@lia.insure." },
      { status: 200 }
    );
  }
}
