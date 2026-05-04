-- KUBA 2026 Vendor Registrations
-- Run this in your Supabase project: SQL Editor → New Query → paste → Run

create table if not exists vendor_registrations (
  id               uuid        primary key default gen_random_uuid(),
  organization_name text       not null,
  contact_name      text       not null,
  phone_number      text       not null,
  email             text       not null,
  product_being_sold text,
  activity           text,
  days              text[]     not null default '{}',
  is_non_selling    boolean    not null default false,
  total_cost        integer    not null default 0,
  notes             text,
  status            text       not null default 'pending',
  submitted_at      timestamptz not null default now()
);

-- Enable Row Level Security
alter table vendor_registrations enable row level security;

-- Public can INSERT (submit the form)
create policy "public_insert" on vendor_registrations
  for insert with check (true);

-- Only service role (server) can SELECT (read submissions)
create policy "service_select" on vendor_registrations
  for select using (auth.role() = 'service_role');
