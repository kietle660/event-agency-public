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
