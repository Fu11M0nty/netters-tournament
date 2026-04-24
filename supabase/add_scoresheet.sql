-- =============================================================================
-- Add manual scoresheet capture to matches
--
-- Umpires fill in a paper scoresheet per game. The organiser photographs it
-- and uploads the image via the admin score-entry form, giving a physical-
-- record fallback to reconcile against the entered scores.
--
-- The image URL points at a public object in the `scoresheets` Supabase
-- Storage bucket. Images are compressed client-side (≈1280 px longest edge,
-- JPEG quality 0.6) before upload, so typical size is 100-300 KB.
--
-- Safe to re-run (IF NOT EXISTS).
--
-- Prerequisite: create a `scoresheets` bucket in Supabase Storage
-- (Studio → Storage → New bucket → public read) before the first upload.
-- =============================================================================

alter table matches
  add column if not exists scoresheet_url text;
