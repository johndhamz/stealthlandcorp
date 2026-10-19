-- Group tours into sections on the property page (e.g. "Island hopping from Roxas", "El Nido tours").
alter table public.activities add column if not exists category text not null default '';
