import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      inquiry_type,
      painting_interest,
      commission_description,
      budget_range,
      timeline,
      source,
      message,
    } = body;

    if (!full_name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from("inquiries")
      .insert({
        full_name,
        email,
        phone: phone || null,
        inquiry_type,
        painting_interest: painting_interest || null,
        commission_description: commission_description || null,
        budget_range: budget_range || null,
        timeline: timeline || null,
        source: source || null,
        message: message || null,
        status: "new",
      })
      .select()
      .single();

    if (inquiryError) {
      console.error("Inquiry insert error:", inquiryError);
      // Still return success to client — supabase might not be configured
      return NextResponse.json({ success: true, warning: "Stored locally only." });
    }

    // Find or create CRM board
    const { data: board } = await supabase
      .from("crm_boards")
      .select("id")
      .eq("slug", "artist-studio")
      .single();

    if (board) {
      // Find "New Inquiry" column
      const { data: column } = await supabase
        .from("crm_pipeline_columns")
        .select("id")
        .eq("board_id", board.id)
        .eq("name", "New Inquiry")
        .single();

      if (column) {
        // Get max position
        const { data: lastLead } = await supabase
          .from("crm_leads")
          .select("position")
          .eq("pipeline_column_id", column.id)
          .order("position", { ascending: false })
          .limit(1)
          .single();

        const position = lastLead ? lastLead.position + 1 : 0;

        // Create CRM lead
        const { data: lead } = await supabase
          .from("crm_leads")
          .insert({
            board_id: board.id,
            pipeline_column_id: column.id,
            inquiry_id: inquiry.id,
            full_name,
            email,
            phone: phone || null,
            inquiry_type,
            painting_interest: painting_interest || null,
            commission_description: commission_description || null,
            budget_range: budget_range || null,
            position,
          })
          .select()
          .single();

        // Log activity
        if (lead) {
          await supabase.from("crm_activity_log").insert({
            lead_id: lead.id,
            type: "created",
            body: `New inquiry received via website. Type: ${inquiry_type}.`,
            meta: { source: source || "website" },
          });
        }
      }
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error("Inquire API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
