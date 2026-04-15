-- ============================================================
-- Katelyn Cook Fine Art — Supabase Schema
-- Paste this into the Supabase SQL Editor and run it.
-- ============================================================

-- ── HELPER: updated_at trigger ──────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── INQUIRIES ───────────────────────────────────────────────

create table if not exists inquiries (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  email           text not null,
  phone           text,
  inquiry_type    text not null check (inquiry_type in ('purchase', 'commission', 'general')),
  painting_interest      text,
  commission_description text,
  budget_range    text,
  timeline        text,
  source          text,
  message         text,
  status          text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger inquiries_updated_at
  before update on inquiries
  for each row execute function set_updated_at();

-- ── CRM BOARDS ──────────────────────────────────────────────

create table if not exists crm_boards (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger crm_boards_updated_at
  before update on crm_boards
  for each row execute function set_updated_at();

-- ── CRM PIPELINE COLUMNS ────────────────────────────────────

create table if not exists crm_pipeline_columns (
  id          uuid primary key default gen_random_uuid(),
  board_id    uuid not null references crm_boards(id) on delete cascade,
  name        text not null,
  position    integer not null default 0,
  color       text,
  is_archived boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger crm_pipeline_columns_updated_at
  before update on crm_pipeline_columns
  for each row execute function set_updated_at();

-- ── CRM LEADS ───────────────────────────────────────────────

create table if not exists crm_leads (
  id                   uuid primary key default gen_random_uuid(),
  board_id             uuid not null references crm_boards(id) on delete cascade,
  pipeline_column_id   uuid not null references crm_pipeline_columns(id) on delete cascade,
  inquiry_id           uuid references inquiries(id) on delete set null,
  full_name            text not null,
  email                text not null,
  phone                text,
  city                 text,
  state                text,
  inquiry_type         text not null default 'general',
  painting_interest    text,
  commission_description text,
  budget_range         text,
  quote_amount         numeric(10,2),
  assigned_to          text,
  tags                 text[] default '{}',
  next_action          text,
  next_action_due      date,
  notes_text           text,
  position             integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger crm_leads_updated_at
  before update on crm_leads
  for each row execute function set_updated_at();

-- ── CRM NOTES ───────────────────────────────────────────────

create table if not exists crm_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references crm_leads(id) on delete cascade,
  body       text not null,
  created_by text,
  created_at timestamptz not null default now()
);

-- ── CRM ACTIVITY LOG ────────────────────────────────────────

create table if not exists crm_activity_log (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references crm_leads(id) on delete cascade,
  type       text not null,
  body       text not null,
  meta       jsonb,
  created_at timestamptz not null default now()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────

alter table inquiries             enable row level security;
alter table crm_boards            enable row level security;
alter table crm_pipeline_columns  enable row level security;
alter table crm_leads             enable row level security;
alter table crm_notes             enable row level security;
alter table crm_activity_log      enable row level security;

-- anon can insert inquiries (public form)
create policy "anon_insert_inquiries" on inquiries
  for insert to anon with check (true);

-- full access for crm tables (tighten before production)
create policy "anon_all_crm_boards" on crm_boards
  for all to anon using (true) with check (true);

create policy "anon_all_crm_columns" on crm_pipeline_columns
  for all to anon using (true) with check (true);

create policy "anon_all_crm_leads" on crm_leads
  for all to anon using (true) with check (true);

create policy "anon_all_crm_notes" on crm_notes
  for all to anon using (true) with check (true);

create policy "anon_all_crm_activity" on crm_activity_log
  for all to anon using (true) with check (true);

-- ── SEED: Default Board & 7 Columns ─────────────────────────

with board as (
  insert into crm_boards (name, slug)
  values ('Artist Studio', 'artist-studio')
  on conflict (slug) do update set name = excluded.name
  returning id
)
insert into crm_pipeline_columns (board_id, name, position)
select
  board.id,
  col.name,
  col.pos
from board,
  (values
    ('New Inquiry',       0),
    ('Contacted',         1),
    ('Quoted',            2),
    ('Deposit Received',  3),
    ('In Progress',       4),
    ('Completed',         5),
    ('Shipped',           6)
  ) as col(name, pos)
on conflict do nothing;

-- ── PAINTINGS ────────────────────────────────────────────────────

create table if not exists paintings (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  medium         text not null default 'Oil',
  dimensions     text not null default '',
  year           integer not null default 2024,
  price          numeric(10,2) not null default 0,
  original_price numeric(10,2),
  available      boolean not null default true,
  featured       boolean not null default false,
  image_url      text not null default '',
  description    text not null default '',
  tags           text[] not null default '{}',
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger paintings_updated_at
  before update on paintings
  for each row execute function set_updated_at();

alter table paintings enable row level security;

create policy "public_read_paintings" on paintings
  for select to anon using (true);

create policy "anon_write_paintings" on paintings
  for all to anon using (true) with check (true);

-- Seed with initial paintings
insert into paintings (slug, title, medium, dimensions, year, price, available, featured, image_url, description, tags, sort_order)
values
  ('chestnut-reverie', 'Chestnut Reverie', 'Oil', '24" × 30"', 2024, 1800, true, true,
   'https://placehold.co/800x1000/5C6B5A/F2EDE3?text=Chestnut+Reverie',
   'A chestnut mare rendered in warm oils, her coat catching the last light of a golden afternoon. Painted in layered technique on linen-mounted panel.',
   ARRAY['horse','equestrian','oil','figurative'], 0),
  ('emerald-stillness', 'Emerald Stillness', 'Oil', '18" × 24"', 2024, 1200, true, true,
   'https://placehold.co/800x1000/3d5a3e/F2EDE3?text=Emerald+Stillness',
   'Deep forest greens and mossy shadows evoke the quiet interior of an old-growth wood. A meditation on stillness and the weight of living things.',
   ARRAY['landscape','nature','oil','green'], 1),
  ('the-bay-at-dusk', 'The Bay at Dusk', 'Oil', '30" × 40"', 2024, 2800, false, true,
   'https://placehold.co/800x1000/8B6914/F2EDE3?text=The+Bay+at+Dusk',
   'A bay horse silhouetted against a luminous dusk sky. Bold brushwork and a limited warm palette give this large canvas an immediate, cinematic presence.',
   ARRAY['horse','equestrian','oil','large'], 2),
  ('wild-study-no-3', 'Wild Study No. 3', 'Acrylic', '12" × 16"', 2024, 650, true, true,
   'https://placehold.co/800x1000/8B7355/F2EDE3?text=Wild+Study+No.3',
   'Part of an ongoing series of small-format studies exploring animal gesture and spontaneous mark-making.',
   ARRAY['animal','study','acrylic','small'], 3),
  ('morning-field', 'Morning Field', 'Oil', '16" × 20"', 2023, 950, true, false,
   'https://placehold.co/800x1000/6B7A5C/F2EDE3?text=Morning+Field',
   'Soft morning light across an open field. A quieter, more intimate piece.',
   ARRAY['landscape','nature','oil','light'], 4),
  ('constellation-horse', 'Constellation Horse', 'Mixed Media', '20" × 24"', 2023, 1400, true, false,
   'https://placehold.co/800x1000/2C2418/F2EDE3?text=Constellation+Horse',
   'Inspired by a recurring visual motif — a horse decorated with stars. Mixed media on canvas with gold leaf accents.',
   ARRAY['horse','mixed media','decorative','gold'], 5),
  ('amber-grove', 'Amber Grove', 'Watercolor', '11" × 15"', 2023, 480, true, false,
   'https://placehold.co/800x1000/C8922A/F2EDE3?text=Amber+Grove',
   'Warm amber and ochre tones wash through this loose watercolor of a late-autumn grove.',
   ARRAY['landscape','watercolor','autumn','small'], 6),
  ('dark-horse-study', 'Dark Horse Study', 'Oil', '14" × 18"', 2023, 780, false, false,
   'https://placehold.co/800x1000/1a1a1a/F2EDE3?text=Dark+Horse+Study',
   'A near-black horse emerges from a deep background, painted with controlled restraint and rich tonal depth.',
   ARRAY['horse','equestrian','oil','dark'], 7)
on conflict (slug) do nothing;
