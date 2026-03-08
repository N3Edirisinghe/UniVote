-- Add new fields to profiles table for enhanced user information

-- Add fields for student profiles
alter table public.profiles 
  add column if not exists faculty text,
  add column if not exists mobile_number text,
  add column if not exists current_year text,
  add column if not exists reg_no text;

-- Add fields for admin profiles
alter table public.profiles 
  add column if not exists position text,
  add column if not exists contact_number text;

-- Update avatar_url column if it doesn't exist
alter table public.profiles 
  add column if not exists avatar_url text;
