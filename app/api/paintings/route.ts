import { NextRequest, NextResponse } from "next/server";
import { PAINTINGS } from "@/lib/paintings";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { Painting } from "@/lib/types";

function normalize(d: Record<string, unknown>): Painting {
  return {
    id: d.id as string,
    slug: d.slug as string,
    title: d.title as string,
    medium: d.medium as string,
    dimensions: d.dimensions as string,
    year: d.year as number,
    price: parseFloat(String(d.price)),
    original_price: d.original_price ? parseFloat(String(d.original_price)) : undefined,
    available: d.available as boolean,
    featured: d.featured as boolean,
    image: (d.image_url as string) ?? (d.image as string),
    description: (d.description as string) ?? "",
    tags: (d.tags as string[]) ?? [],
    sort_order: (d.sort_order as number) ?? 0,
  };
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      if (slug) {
        const { data } = await supabase.from("paintings").select("*").eq("slug", slug).single();
        if (data) return NextResponse.json({ painting: normalize(data) });
        // Fall through to static
        const staticP = PAINTINGS.find((p) => p.slug === slug);
        return NextResponse.json({ painting: staticP ?? null });
      }
      const { data } = await supabase.from("paintings").select("*").order("sort_order");
      if (data) return NextResponse.json({ paintings: data.map(normalize) });
    } catch {}
  }

  // Static fallback
  if (slug) {
    const painting = PAINTINGS.find((p) => p.slug === slug);
    return NextResponse.json({ painting: painting ?? null });
  }
  return NextResponse.json({ paintings: PAINTINGS });
}
