-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  student_id text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create elections table
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

-- Create candidates table
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

-- Create votes table
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  election_id uuid references public.elections(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  voter_id uuid references public.profiles(id) on delete cascade not null,
  voted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(election_id, voter_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.elections enable row level security;
alter table public.candidates enable row level security;
alter table public.votes enable row level security;
