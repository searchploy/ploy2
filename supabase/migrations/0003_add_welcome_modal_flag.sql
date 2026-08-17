-- Add has_seen_consultant_welcome flag to profiles table
alter table profiles add column has_seen_consultant_welcome boolean default false;
