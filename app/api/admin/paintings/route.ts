import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("paintings")
    .select("*")
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ paintings: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const slug = body.slug?.trim() || slugify(body.title ?? "untitled");

  const { data, error } = await supabase
    .from("paintings")
    .insert({
      slug,
      title: body.title,
      medium: body.medium ?? "Oil",
      dimensions: body.dimensions ?? "",
      year: body.year ?? new Date().getFullYear(),
      price: parseFloat(body.price) || 0,
      original_price: body.original_price ? parseFloat(body.original_price) : null,
      available: body.available ?? true,
      featured: body.featured ?? false,
      image_url: body.image_url ?? "",
      description: body.description ?? "",
      tags: body.tags ?? [],
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ painting: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Normalize image field
  if (updates.image) { updates.image_url = updates.image; delete updates.image; }
  if (updates.price !== undefined) updates.price = parseFloat(updates.price) || 0;
  if (updates.original_price !== undefined) {
    updates.original_price = updates.original_price ? parseFloat(updates.original_price) : null;
  }

  const { data, error } = await supabase
    .from("paintings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ painting: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("paintings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
