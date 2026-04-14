import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data: board } = await supabase
    .from("crm_boards")
    .select("id")
    .eq("slug", "artist-studio")
    .single();

  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const { data: lastCol } = await supabase
    .from("crm_pipeline_columns")
    .select("position")
    .eq("board_id", board.id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const { data: column, error } = await supabase
    .from("crm_pipeline_columns")
    .insert({
      board_id: board.id,
      name: body.name,
      position: lastCol ? lastCol.position + 1 : 0,
      color: body.color || null,
      is_archived: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ column });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data: column, error } = await supabase
    .from("crm_pipeline_columns")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ column });
}
