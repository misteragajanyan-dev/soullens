import { NextResponse } from "next/server";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await res.text();
    clearTimeout(timeout);

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      text,
    });
  } catch (e: any) {
    clearTimeout(timeout);

    return NextResponse.json({
      error: e?.name || "unknown",
      message: e?.message || "no message",
    });
  }
}