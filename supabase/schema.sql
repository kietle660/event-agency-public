create table if not exists public.projects (
  href text primary key,
  title text not null,
  client text not null,
  location text not null,
  date text not null,
  desc text not null,
  image text not null,
  gallery jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb
);

create table if not exists public.news (
  slug text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  image text not null,
  date text not null
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null default '',
  event_type text not null,
  event_date text not null default '',
  location text not null default '',
  guests text not null default '',
  budget text not null default '',
  message text not null default ''
);

create table if not exists public.daily_analytics (
  date date primary key,
  pageviews integer not null default 0,
  unique_visitors integer not null default 0,
  leads integer not null default 0,
  visitor_ids jsonb not null default '[]'::jsonb
);

-- Security hardening
-- Current app reads/writes these tables through server-side routes using the
-- service role key. We therefore enable RLS and deny direct public access.

alter table public.projects enable row level security;
alter table public.news enable row level security;
alter table public.leads enable row level security;
alter table public.daily_analytics enable row level security;

revoke all on table public.projects from anon, authenticated;
revoke all on table public.news from anon, authenticated;
revoke all on table public.leads from anon, authenticated;
revoke all on table public.daily_analytics from anon, authenticated;

drop policy if exists "projects_public_read" on public.projects;
drop policy if exists "news_public_read" on public.news;
drop policy if exists "leads_public_access" on public.leads;
drop policy if exists "analytics_public_access" on public.daily_analytics;
