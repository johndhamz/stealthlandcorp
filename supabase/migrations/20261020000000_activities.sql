-- Island hopping & activities (request to book): add-ons to a stay, or standalone day-tour requests.

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  slug text not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  images text[] not null default '{}',
  duration text not null default '',
  schedule text not null default '',
  price numeric(12,2) not null default 0 check (price >= 0),
  price_unit text not null default 'person' check (price_unit in ('person', 'group')),
  min_pax int not null default 1 check (min_pax > 0),
  max_pax int not null default 10 check (max_pax >= min_pax),
  inclusions text[] not null default '{}',
  notes text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, slug)
);
create index if not exists activities_property_idx on public.activities (property_id, published, sort_order);
create trigger activities_updated_at before update on public.activities
  for each row execute function public.set_updated_at();

-- A booking is either a room stay (optionally with activity add-ons) or an activity-only day-tour request.
alter table public.bookings
  add column if not exists kind text not null default 'stay' check (kind in ('stay', 'activity')),
  add column if not exists activities_total numeric(12,2) not null default 0;
alter table public.bookings drop constraint if exists bookings_rooms_check;
alter table public.bookings add constraint bookings_rooms_check check (rooms >= 0);
alter table public.bookings drop constraint if exists bookings_check;
alter table public.bookings add constraint bookings_check check (kind = 'activity' or check_out > check_in);

create table if not exists public.booking_activities (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete set null,
  activity_name text not null,
  activity_date date,
  pax int not null default 1 check (pax > 0),
  unit_price numeric(12,2) not null default 0,
  price_unit text not null default 'person',
  subtotal numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists booking_activities_booking_idx on public.booking_activities (booking_id);

alter table public.activities enable row level security;
alter table public.booking_activities enable row level security;

create policy "activities: public reads published" on public.activities for select
  using (published or public.is_admin());
create policy "activities: admin writes" on public.activities for all
  using (public.is_admin()) with check (public.is_admin());

create policy "booking_activities: admin reads" on public.booking_activities for select using (public.is_admin());
create policy "booking_activities: admin writes" on public.booking_activities for all
  using (public.is_admin()) with check (public.is_admin());
