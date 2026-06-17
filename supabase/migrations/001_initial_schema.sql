create extension if not exists pgcrypto;

create table if not exists public.radio_event_config (
  id uuid primary key default gen_random_uuid(),
  is_active boolean default false,
  title text,
  subtitle text,
  speaker text,
  date_text text,
  time_text text,
  location text,
  description text,
  image_url text,
  button_text text,
  button_url text,
  updated_at timestamptz default now()
);

create table if not exists public.radio_live_config (
  id uuid primary key default gen_random_uuid(),
  is_active boolean default false,
  title text,
  speaker text,
  topic text,
  time_text text,
  description text,
  image_url text,
  show_red_live_indicator boolean default true,
  button_text text,
  button_url text,
  updated_at timestamptz default now()
);

create table if not exists public.radio_schedule_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  time_text text not null,
  description text,
  category text,
  sort_order int default 0,
  is_active boolean default true,
  is_live_slot boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists radio_event_config_set_updated_at on public.radio_event_config;
create trigger radio_event_config_set_updated_at
before update on public.radio_event_config
for each row execute function public.set_updated_at();

drop trigger if exists radio_live_config_set_updated_at on public.radio_live_config;
create trigger radio_live_config_set_updated_at
before update on public.radio_live_config
for each row execute function public.set_updated_at();

drop trigger if exists radio_schedule_items_set_updated_at on public.radio_schedule_items;
create trigger radio_schedule_items_set_updated_at
before update on public.radio_schedule_items
for each row execute function public.set_updated_at();

alter table public.radio_event_config enable row level security;
alter table public.radio_live_config enable row level security;
alter table public.radio_schedule_items enable row level security;

create policy "Public can read active event config"
on public.radio_event_config for select
using (is_active = true);

create policy "Authenticated admins can read all event config"
on public.radio_event_config for select
to authenticated
using (true);

create policy "Authenticated admins can write event config"
on public.radio_event_config for all
to authenticated
using (true)
with check (true);

create policy "Public can read active live config"
on public.radio_live_config for select
using (is_active = true);

create policy "Authenticated admins can read all live config"
on public.radio_live_config for select
to authenticated
using (true);

create policy "Authenticated admins can write live config"
on public.radio_live_config for all
to authenticated
using (true)
with check (true);

create policy "Public can read active schedule items"
on public.radio_schedule_items for select
using (is_active = true);

create policy "Authenticated admins can read all schedule items"
on public.radio_schedule_items for select
to authenticated
using (true);

create policy "Authenticated admins can write schedule items"
on public.radio_schedule_items for all
to authenticated
using (true)
with check (true);

insert into public.radio_schedule_items
  (title, time_text, description, category, sort_order, is_active, is_live_slot)
values
  ('Murottal Al-Qur''an', '00.00-04.30', null, 'Murottal', 10, true, false),
  ('Kajian Pagi / Faedah Pagi', '04.30-05.00', null, 'Kajian', 20, true, false),
  ('Dzikir Pagi', '05.00-06.00', null, 'Dzikir', 30, true, false),
  ('Kajian Aqidah', '08.00-10.00', null, 'Kajian', 40, true, false),
  ('Kajian Fiqih', '13.00-15.00', null, 'Kajian', 50, true, false),
  ('Murottal Sore', '15.30-17.00', null, 'Murottal', 60, true, false),
  ('Dzikir Petang', '17.00-18.00', null, 'Dzikir', 70, true, false),
  ('Kajian Malam', '19.30-21.00', null, 'Kajian', 80, true, true),
  ('Siaran Bebas / AutoDJ', 'Menyesuaikan', null, 'AutoDJ', 90, true, false);
