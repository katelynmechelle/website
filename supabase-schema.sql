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
