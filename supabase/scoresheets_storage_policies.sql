-- =============================================================================
-- Storage RLS policies for the `scoresheets` bucket
--
-- Run this in the Supabase SQL editor AFTER creating the bucket via
-- Studio → Storage → New bucket → name "scoresheets" → public.
--
-- Grants:
--   • public read    — the admin console (and anyone with a URL) can view
--   • authenticated  — the tournament organiser can upload / replace / delete
--
-- Safe to re-run (drop-if-exists before each create).
-- =============================================================================

drop policy if exists "scoresheets_public_read"        on storage.objects;
drop policy if exists "scoresheets_auth_insert"        on storage.objects;
drop policy if exists "scoresheets_auth_update"        on storage.objects;
drop policy if exists "scoresheets_auth_delete"        on storage.objects;

create policy "scoresheets_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'scoresheets');

create policy "scoresheets_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'scoresheets');

create policy "scoresheets_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'scoresheets')
  with check (bucket_id = 'scoresheets');

create policy "scoresheets_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'scoresheets');
