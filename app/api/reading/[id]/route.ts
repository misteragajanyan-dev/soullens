import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Разбор не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: data.id,
      user1_name: data.user1_name,
      user2_name: data.user2_name,
      compatibility_score: data.compatibility_score,
      preview_text: data.preview_text,
      full_text: data.is_paid ? data.full_text : null,
      is_paid: data.is_paid,
      created_at: data.created_at,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}