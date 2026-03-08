-- Add avatar_url column to profiles table for profile photos
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
