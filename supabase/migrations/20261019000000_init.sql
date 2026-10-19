-- Stealth Land Corp admin schema
create extension if not exists "pgcrypto";

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'agent' check (role in ('admin', 'agent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- The first user to sign up becomes admin; later users default to agent
-- unless the user metadata carries a role (set by the admin API).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  admin_count int;
  wanted_role text;
begin
  select count(*) into admin_count from public.profiles where role = 'admin';
  wanted_role := coalesce(new.raw_user_meta_data ->> 'role', case when admin_count = 0 then 'admin' else 'agent' end);
  if wanted_role not in ('admin', 'agent') then wanted_role := 'agent'; end if;
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', wanted_role)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- properties ----------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  developer text not null default 'Stealth Land Corp',
  tagline text not null default '',
  sector text not null check (sector in ('residential', 'hotel-leisure', 'agriculture')),
  region text not null default '',
  location text not null default '',
  status text not null default 'pre-selling' check (status in ('pre-selling', 'ready-for-occupancy', 'in-development', 'completed')),
  featured boolean not null default false,
  published boolean not null default true,
  card_image text not null default '',
  hero_images text[] not null default '{}',
  gallery text[] not null default '{}',
  summary text not null default '',
  description text[] not null default '{}',
  highlight_title text not null default '',
  highlights text[] not null default '{}',
  amenities text[] not null default '{}',
  unit_types jsonb not null default '[]'::jsonb,
  video_ids text[] not null default '{}',
  mortgage_calculator boolean not null default false,
  legacy_paths text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists properties_sector_idx on public.properties (sector);
create index if not exists properties_published_idx on public.properties (published, sort_order);
create trigger properties_updated_at before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------- inquiries ----------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text not null default 'website',
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_number text not null default '',
  country text not null default '',
  place text not null default '',
  project_interest text not null default '',
  where_did_find_about_us text not null default '',
  message text not null default '',
  agree_newsletter boolean not null default false,
  agree_terms boolean not null default false,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  notes text not null default '',
  assigned_to uuid references public.profiles(id) on delete set null,
  forwarded boolean not null default false
);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);
create trigger inquiries_updated_at before update on public.inquiries
  for each row execute function public.set_updated_at();

-- ---------- site content ----------
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------- agents ----------
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  territory text not null default '',
  status text not null default 'pending' check (status in ('pending', 'accredited', 'inactive')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger agents_updated_at before update on public.agents
  for each row execute function public.set_updated_at();

-- ---------- row level security ----------
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_content enable row level security;
alter table public.agents enable row level security;

create policy "profiles: read own or admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles: admin writes" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

create policy "properties: public reads published" on public.properties for select
  using (published or public.is_admin());
create policy "properties: admin writes" on public.properties for all
  using (public.is_admin()) with check (public.is_admin());

create policy "inquiries: admin reads" on public.inquiries for select
  using (public.is_admin() or assigned_to = auth.uid());
create policy "inquiries: admin writes" on public.inquiries for all
  using (public.is_admin()) with check (public.is_admin());

create policy "site_content: public reads" on public.site_content for select using (true);
create policy "site_content: admin writes" on public.site_content for all
  using (public.is_admin()) with check (public.is_admin());

create policy "agents: admin or own" on public.agents for select
  using (public.is_admin() or user_id = auth.uid());
create policy "agents: admin writes" on public.agents for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "property images: public read" on storage.objects for select
  using (bucket_id = 'property-images');
create policy "property images: admin write" on storage.objects for insert
  with check (bucket_id = 'property-images' and public.is_admin());
create policy "property images: admin update" on storage.objects for update
  using (bucket_id = 'property-images' and public.is_admin());
create policy "property images: admin delete" on storage.objects for delete
  using (bucket_id = 'property-images' and public.is_admin());
