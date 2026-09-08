-- Run in Supabase SQL editor after creating a project.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.landing_pages enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')); $$;

create policy "Public can read published landing content"
  on public.landing_pages for select using (is_published = true or public.is_admin());
create policy "Editors can insert landing content"
  on public.landing_pages for insert with check (public.is_admin());
create policy "Editors can update landing content"
  on public.landing_pages for update using (public.is_admin()) with check (public.is_admin());
create policy "Users can read their profile"
  on public.profiles for select using (id = auth.uid());

insert into storage.buckets (id, name, public)
values ('landing-images', 'landing-images', true)
on conflict (id) do nothing;

create policy "Public can view landing images"
  on storage.objects for select using (bucket_id = 'landing-images');
create policy "Editors can upload landing images"
  on storage.objects for insert with check (bucket_id = 'landing-images' and public.is_admin());
create policy "Editors can update landing images"
  on storage.objects for update using (bucket_id = 'landing-images' and public.is_admin());
create policy "Editors can delete landing images"
  on storage.objects for delete using (bucket_id = 'landing-images' and public.is_admin());

-- After creating the first Auth user, grant it access:
-- insert into public.profiles (id, role) values ('AUTH_USER_UUID', 'admin');
