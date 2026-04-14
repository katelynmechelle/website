import { Painting } from "./types";

// Sample paintings — replace with Supabase data in production
export const PAINTINGS: Painting[] = [
  {
    id: "1",
    slug: "chestnut-reverie",
    title: "Chestnut Reverie",
    medium: "Oil",
    dimensions: '24" × 30"',
    year: 2024,
    price: 1800,
    available: true,
    featured: true,
    image: "https://placehold.co/800x1000/5C6B5A/F7F5F0?text=Chestnut+Reverie",
    description:
      "A chestnut mare rendered in warm oils, her coat catching the last light of a golden afternoon. Painted in Katelyn's signature layered technique on linen-mounted panel.",
    tags: ["horse", "equestrian", "oil", "figurative"],
  },
  {
    id: "2",
    slug: "emerald-stillness",
    title: "Emerald Stillness",
    medium: "Oil",
    dimensions: '18" × 24"',
    year: 2024,
    price: 1200,
    available: true,
    featured: true,
    image: "https://placehold.co/800x1000/3d5a3e/F7F5F0?text=Emerald+Stillness",
    description:
      "Deep forest greens and mossy shadows evoke the quiet interior of an old-growth wood. A meditation on stillness and the weight of living things.",
    tags: ["landscape", "nature", "oil", "green"],
  },
  {
    id: "3",
    slug: "the-bay-at-dusk",
    title: "The Bay at Dusk",
    medium: "Oil",
    dimensions: '30" × 40"',
    year: 2024,
    price: 2800,
    available: false,
    featured: true,
    image: "https://placehold.co/800x1000/8B6914/F7F5F0?text=The+Bay+at+Dusk",
    description:
      "A bay horse silhouetted against a luminous dusk sky. Bold brushwork and a limited warm palette give this large canvas an immediate, almost cinematic presence.",
    tags: ["horse", "equestrian", "oil", "large"],
  },
  {
    id: "4",
    slug: "wild-study-no-3",
    title: "Wild Study No. 3",
    medium: "Acrylic",
    dimensions: '12" × 16"',
    year: 2024,
    price: 650,
    available: true,
    featured: true,
    image: "https://placehold.co/800x1000/8B7355/F7F5F0?text=Wild+Study+No.3",
    description:
      "Part of an ongoing series of small-format studies exploring animal gesture and spontaneous mark-making. Loose, expressive, and full of energy.",
    tags: ["animal", "study", "acrylic", "small"],
  },
  {
    id: "5",
    slug: "morning-field",
    title: "Morning Field",
    medium: "Oil",
    dimensions: '16" × 20"',
    year: 2023,
    price: 950,
    available: true,
    featured: false,
    image: "https://placehold.co/800x1000/6B7A5C/F7F5F0?text=Morning+Field",
    description:
      "Soft morning light across an open field. A quieter, more intimate piece — perfect for a reading room or bedroom.",
    tags: ["landscape", "nature", "oil", "light"],
  },
  {
    id: "6",
    slug: "constellation-horse",
    title: "Constellation Horse",
    medium: "Mixed Media",
    dimensions: '20" × 24"',
    year: 2023,
    price: 1400,
    available: true,
    featured: false,
    image: "https://placehold.co/800x1000/2C2825/F7F5F0?text=Constellation+Horse",
    description:
      "Inspired by a recurring visual motif in her sketchbooks — a horse decorated with stars. Mixed media on canvas with gold leaf accents.",
    tags: ["horse", "mixed media", "decorative", "gold"],
  },
  {
    id: "7",
    slug: "amber-grove",
    title: "Amber Grove",
    medium: "Watercolor",
    dimensions: '11" × 15"',
    year: 2023,
    price: 480,
    available: true,
    featured: false,
    image: "https://placehold.co/800x1000/C8922A/F7F5F0?text=Amber+Grove",
    description:
      "Warm amber and ochre tones wash through this loose watercolor of a late-autumn grove. Light, airy, and full of movement.",
    tags: ["landscape", "watercolor", "autumn", "small"],
  },
  {
    id: "8",
    slug: "dark-horse-study",
    title: "Dark Horse Study",
    medium: "Oil",
    dimensions: '14" × 18"',
    year: 2023,
    price: 780,
    available: false,
    featured: false,
    image: "https://placehold.co/800x1000/1a1a1a/F7F5F0?text=Dark+Horse+Study",
    description:
      "A near-black horse emerges from a deep background, painted with controlled restraint and rich tonal depth. Now in a private collection.",
    tags: ["horse", "equestrian", "oil", "dark"],
  },
];

export function getFeaturedPaintings(): Painting[] {
  return PAINTINGS.filter((p) => p.featured);
}

export function getAvailablePaintings(): Painting[] {
  return PAINTINGS.filter((p) => p.available);
}

export function getPaintingBySlug(slug: string): Painting | undefined {
  return PAINTINGS.find((p) => p.slug === slug);
}

export function getRelatedPaintings(painting: Painting, count = 3): Painting[] {
  return PAINTINGS.filter(
    (p) =>
      p.id !== painting.id &&
      p.tags.some((t) => painting.tags.includes(t))
  ).slice(0, count);
}

export function getAllSlugs(): string[] {
  return PAINTINGS.map((p) => p.slug);
}
