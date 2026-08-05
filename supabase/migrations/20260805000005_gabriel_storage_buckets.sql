-- Two buckets, deliberately different in visibility.
--
--   gabriel-media     public  — served straight from the CDN and passed to
--                               next/image. Nothing secret ever goes here.
--   gabriel-documents private — CVs. Reads go through a server route that mints
--                               a short-lived signed URL, so a superseded CV
--                               cannot be fetched by guessing its path.
--
-- MIME gotcha: allowed_mime_types is checked against the Content-Type the
-- client sends, not the file's magic bytes. Browsers often send
-- application/octet-stream for drag-and-dropped PDFs, so the upload call must
-- pass contentType: 'application/pdf' explicitly or Storage rejects it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gabriel-media', 'gabriel-media', true, 10485760,
   array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm']),
  ('gabriel-documents', 'gabriel-documents', false, 20971520,
   array['application/pdf'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- SVG is deliberately absent from the media allowlist: it is a stored-XSS
-- vector in a public bucket, and next/image will not optimise it anyway.

-- ── gabriel-media: world-readable, admin-writable ────────────────────────────
drop policy if exists gabriel_media_public_read on storage.objects;
create policy gabriel_media_public_read on storage.objects
  for select to anon, authenticated
  using ( bucket_id = 'gabriel-media' );

drop policy if exists gabriel_media_admin_insert on storage.objects;
create policy gabriel_media_admin_insert on storage.objects
  for insert to authenticated
  with check ( bucket_id = 'gabriel-media' and gabriel.is_admin() );

drop policy if exists gabriel_media_admin_update on storage.objects;
create policy gabriel_media_admin_update on storage.objects
  for update to authenticated
  using ( bucket_id = 'gabriel-media' and gabriel.is_admin() )
  with check ( bucket_id = 'gabriel-media' and gabriel.is_admin() );

drop policy if exists gabriel_media_admin_delete on storage.objects;
create policy gabriel_media_admin_delete on storage.objects
  for delete to authenticated
  using ( bucket_id = 'gabriel-media' and gabriel.is_admin() );

-- ── gabriel-documents: no anon policy at all ─────────────────────────────────
-- Public downloads are served by the /cv route using a service-role signed URL.
drop policy if exists gabriel_documents_admin_all on storage.objects;
create policy gabriel_documents_admin_all on storage.objects
  for all to authenticated
  using ( bucket_id = 'gabriel-documents' and gabriel.is_admin() )
  with check ( bucket_id = 'gabriel-documents' and gabriel.is_admin() );
