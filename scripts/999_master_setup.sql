-- MASTER SETUP SCRIPT FOR SLTC VOTING SYSTEM
-- Run this entire script in the Supabase SQL Editor to fully rebuild the database

-- 1. Create Tables
-- Profiles Table (Users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  student_id text,
  faculty text,
  mobile_number text,
  current_year text,
  reg_no text,
  position text,
  contact_number text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Elections Table
create table if not exists public.elections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'ended')),
  created_by uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Candidates Table
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid references public.elections(id) on delete cascade not null,
  name text not null,
  position text not null,
  manifesto text,
  image_url text,
  vote_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Votes Table
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  election_id uuid references public.elections(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  voter_id uuid references public.profiles(id) on delete cascade not null,
  voted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(election_id, voter_id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.elections enable row level security;
alter table public.candidates enable row level security;
alter table public.votes enable row level security;

-- 3. Create RLS Policies

-- Profiles Policies
create policy "Users can view their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles for select
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Elections Policies
create policy "Anyone can view elections"
on public.elections for select
using (true);

create policy "Admins can create elections"
on public.elections for insert
with check (
  auth.uid() = created_by and
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

create policy "Admins can update their own elections"
on public.elections for update
using (
  auth.uid() = created_by and
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Candidates Policies
create policy "Anyone can view candidates"
on public.candidates for select
using (true);

create policy "Admins can insert candidates"
on public.candidates for insert
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

create policy "Admins can update candidates"
on public.candidates for update
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Votes Policies
create policy "Users can view their own votes"
on public.votes for select
using (auth.uid() = voter_id);

create policy "Admins can view all votes"
on public.votes for select
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

create policy "Students can insert votes"
on public.votes for insert
with check (
  auth.uid() = voter_id and
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'student'
  )
);

-- 4. Create Triggers for User Management

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Setup Storage Buckets

-- Create avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Create candidates bucket
insert into storage.buckets (id, name, public)
values ('candidates', 'candidates', true)
on conflict (id) do nothing;

-- Storage Policies for Avatars
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own avatar"
on storage.objects for update
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Anyone can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- Storage Policies for Candidates
create policy "Admins can upload candidate images"
on storage.objects for insert
with check (
  bucket_id = 'candidates' and
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);

create policy "Anyone can view candidate images"
on storage.objects for select
using (bucket_id = 'candidates');
