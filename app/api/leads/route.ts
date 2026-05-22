import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";

function sanitize(val: unknown): string {
  if (val == null) return "";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const value = parseFloat(String(data.value ?? 0)) || 0;

    await insertLead({
      firstName: sanitize(data.firstName),
      lastName: sanitize(data.lastName) || "-",
      email: sanitize(data.email),
      company: sanitize(data.company) || "-",
      phone: sanitize(data.phone),
      product: sanitize(data.product),
      value,
      needs: sanitize(data.needs) || "Website Quote Request",
    });

    return NextResponse.json(
      { status: "success", message: "Lead submitted successfully." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
