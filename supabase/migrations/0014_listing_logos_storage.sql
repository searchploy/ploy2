-- Storage for agency logos on marketplace listings.
-- Public read (logos appear on public marketplace pages); writes are scoped to
-- the uploading user's own folder, so nobody can overwrite another agency's logo.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-logos',
  'listing-logos',
  true,
  2097152, -- 2 MB
  array['image/png','image/jpeg','image/webp','image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone may read a logo (marketplace is public).
drop policy if exists "Listing logos are publicly readable" on storage.objects;
create policy "Listing logos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-logos');

-- Objects are stored at "<auth.uid()>/<filename>"; a user may only write in
-- their own folder.
drop policy if exists "Users can upload their own listing logo" on storage.objects;
create policy "Users can upload their own listing logo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'listing-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own listing logo" on storage.objects;
create policy "Users can update their own listing logo"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'listing-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own listing logo" on storage.objects;
create policy "Users can delete their own listing logo"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'listing-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
