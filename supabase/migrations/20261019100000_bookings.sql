-- Hotel booking (phase 1: request to book)

alter table public.properties
  add column if not exists bookable boolean not null default false,
  add column if not exists check_in_time text not null default '2:00 PM',
  add column if not exists check_out_time text not null default '12:00 NN',
  add column if not exists booking_notes text not null default '';

create table if not exists public.room_types (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  images text[] not null default '{}',
  max_guests int not null default 2 check (max_guests > 0),
  beds text not null default '',
  size_sqm numeric,
  nightly_rate numeric(12,2) not null default 0 check (nightly_rate >= 0),
  quantity int not null default 1 check (quantity >= 0),
  amenities text[] not null default '{}',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, slug)
);
create index if not exists room_types_property_idx on public.room_types (property_id, published, sort_order);
create trigger room_types_updated_at before update on public.room_types
  for each row execute function public.set_updated_at();

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  property_id uuid not null references public.properties(id) on delete cascade,
  room_type_id uuid references public.room_types(id) on delete set null,
  room_name text not null default '',
  check_in date not null,
  check_out date not null,
  nights int generated always as (check_out - check_in) stored,
  guests int not null default 1 check (guests > 0),
  rooms int not null default 1 check (rooms > 0),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  special_requests text not null default '',
  nightly_rate numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  currency text not null default 'PHP',
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'declined', 'cancelled', 'completed')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_out > check_in)
);
create index if not exists bookings_status_idx on public.bookings (status, created_at desc);
create index if not exists bookings_property_idx on public.bookings (property_id, check_in);
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.room_types enable row level security;
alter table public.bookings enable row level security;

create policy "room_types: public reads published" on public.room_types for select
  using (published or public.is_admin());
create policy "room_types: admin writes" on public.room_types for all
  using (public.is_admin()) with check (public.is_admin());

create policy "bookings: admin reads" on public.bookings for select using (public.is_admin());
create policy "bookings: admin writes" on public.bookings for all
  using (public.is_admin()) with check (public.is_admin());
