import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const boardSlug = req.nextUrl.searchParams.get("board") ?? "artist-studio";

  const { data: board } = await supabase
    .from("crm_boards")
    .select("id")
    .eq("slug", boardSlug)
    .single();

  if (!board) return NextResponse.json({ columns: [], leads: [] });

  const { data: columns } = await supabase
    .from("crm_pipeline_columns")
    .select("*")
    .eq("board_id", board.id)
    .eq("is_archived", false)
    .order("position");

  const { data: leads } = await supabase
    .from("crm_leads")
    .select("*")
    .eq("board_id", board.id)
    .order("position");

  return NextResponse.json({ columns: columns ?? [], leads: leads ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data: board } = await supabase
    .from("crm_boards")
    .select("id")
    .eq("slug", "artist-studio")
    .single();

  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const { data: column } = await supabase
    .from("crm_pipeline_columns")
    .select("id")
    .eq("board_id", board.id)
    .eq("name", body.column_name ?? "New Inquiry")
    .single();

  const { data: lastLead } = await supabase
    .from("crm_leads")
    .select("position")
    .eq("pipeline_column_id", column?.id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const { data: lead, error } = await supabase
    .from("crm_leads")
    .insert({
      board_id: board.id,
      pipeline_column_id: column?.id,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone || null,
      inquiry_type: body.inquiry_type || "general",
      painting_interest: body.painting_interest || null,
      budget_range: body.budget_range || null,
      position: lastLead ? lastLead.position + 1 : 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("crm_activity_log").insert({
    lead_id: lead.id,
    type: "created",
    body: "Lead created manually via admin.",
  });

  return NextResponse.json({ lead });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data: lead, error } = await supabase
    .from("crm_leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log if stage changed
  if (updates.pipeline_column_id) {
    await supabase.from("crm_activity_log").insert({
      lead_id: id,
      type: "stage_change",
      body: "Lead moved to new stage.",
      meta: { new_column_id: updates.pipeline_column_id },
    });
  }

  return NextResponse.json({ lead });
}
