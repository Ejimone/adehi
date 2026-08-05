-- ─────────────────────────────────────────────────────────────────────────────
-- Gabriel portfolio — Row Level Security.
--
-- This is the actual security boundary of the site. The obscure /gabriel URL is
-- not; it is convenience. If these policies are wrong, nothing else matters.
--
-- Two independent layers are used throughout:
--   1. GRANTs decide whether a role may attempt the verb at all.
--   2. RLS policies decide which rows it sees.
-- A new schema starts with no grants at all, which is why every one below is
-- explicit — and it means a forgotten policy fails closed rather than open.
-- ─────────────────────────────────────────────────────────────────────────────

alter table gabriel.site_settings    enable row level security;
alter table gabriel.projects         enable row level security;
alter table gabriel.project_media    enable row level security;
alter table gabriel.experience       enable row level security;
alter table gabriel.skill_categories enable row level security;
alter table gabriel.skills           enable row level security;
alter table gabriel.certifications   enable row level security;
alter table gabriel.documents        enable row level security;
alter table gabriel.contact_messages enable row level security;

-- ── GRANTs ───────────────────────────────────────────────────────────────────
-- Anonymous visitors may only read, and only the tables backing public pages.
grant select on
  gabriel.site_settings, gabriel.projects, gabriel.project_media,
  gabriel.experience, gabriel.skill_categories, gabriel.skills,
  gabriel.certifications, gabriel.documents
to anon, authenticated;

-- Anonymous visitors may submit the contact form — and nothing else. Note the
-- deliberate absence of SELECT for anon; see the block at the bottom.
grant insert on gabriel.contact_messages to anon, authenticated;
grant select, update, delete on gabriel.contact_messages to authenticated;

-- Signed-in users may attempt writes; gabriel.is_admin() decides whether the
-- rows are actually theirs to touch.
grant insert, update, delete on
  gabriel.site_settings, gabriel.projects, gabriel.project_media,
  gabriel.experience, gabriel.skill_categories, gabriel.skills,
  gabriel.certifications, gabriel.documents
to authenticated;

-- ── PUBLIC READ ──────────────────────────────────────────────────────────────
drop policy if exists site_settings_public_read on gabriel.site_settings;
create policy site_settings_public_read on gabriel.site_settings
  for select to anon, authenticated using ( true );

drop policy if exists projects_public_read on gabriel.projects;
create policy projects_public_read on gabriel.projects
  for select to anon, authenticated using ( status = 'published' );

-- Media inherits its parent project's visibility. Without this, an unpublished
-- case study's screenshots would still be enumerable.
drop policy if exists project_media_public_read on gabriel.project_media;
create policy project_media_public_read on gabriel.project_media
  for select to anon, authenticated
  using ( exists (
    select 1 from gabriel.projects p
    where p.id = project_media.project_id and p.status = 'published'
  ));

drop policy if exists experience_public_read on gabriel.experience;
create policy experience_public_read on gabriel.experience
  for select to anon, authenticated using ( published );

drop policy if exists skill_categories_public_read on gabriel.skill_categories;
create policy skill_categories_public_read on gabriel.skill_categories
  for select to anon, authenticated using ( published );

drop policy if exists skills_public_read on gabriel.skills;
create policy skills_public_read on gabriel.skills
  for select to anon, authenticated
  using ( exists (
    select 1 from gabriel.skill_categories c
    where c.id = skills.category_id and c.published
  ));

drop policy if exists certifications_public_read on gabriel.certifications;
create policy certifications_public_read on gabriel.certifications
  for select to anon, authenticated using ( published );

-- Only the current CV is publicly visible. Superseded versions stay private, so
-- the storage paths of old revisions never leak.
drop policy if exists documents_public_read_current on gabriel.documents;
create policy documents_public_read_current on gabriel.documents
  for select to anon, authenticated using ( is_current );

-- ── ADMIN FULL ACCESS ────────────────────────────────────────────────────────
-- FOR ALL needs BOTH using (which rows may be touched) and with check (which
-- rows may be written). Omitting with_check is the most common RLS mistake:
-- it lets an UPDATE rewrite a row into a state an INSERT would have rejected.
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','projects','project_media','experience',
    'skill_categories','skills','certifications','documents','contact_messages'
  ] loop
    execute format('drop policy if exists %I on gabriel.%I', t || '_admin_all', t);
    execute format(
      'create policy %I on gabriel.%I for all to authenticated
         using ( gabriel.is_admin() ) with check ( gabriel.is_admin() )',
      t || '_admin_all', t);
  end loop;
end $$;

-- ── CONTACT MESSAGES ─────────────────────────────────────────────────────────
-- The case that is easiest to get wrong.
--
-- anon may INSERT. anon may NOT SELECT — there is deliberately no select policy
-- for anon, and no SELECT grant either. Both layers must fail before the inbox
-- leaks, so it takes two independent mistakes rather than one.
--
-- The with-check constraint stops a hostile client inserting rows pre-marked
-- 'archived', which would land them in the database but never in the inbox.
drop policy if exists contact_messages_anon_insert on gabriel.contact_messages;
create policy contact_messages_anon_insert on gabriel.contact_messages
  for insert to anon, authenticated
  with check ( status = 'new' and source = 'contact_form' );

-- Belt and braces: strip anything the grants above may have implied.
revoke select, update, delete on gabriel.contact_messages from anon;

-- ── Future tables fail closed ────────────────────────────────────────────────
-- Without this, a table added later inherits no grants — which is what we want.
-- Stated explicitly so nobody "helpfully" adds a blanket grant later.
alter default privileges in schema gabriel revoke all on tables from anon, authenticated;
