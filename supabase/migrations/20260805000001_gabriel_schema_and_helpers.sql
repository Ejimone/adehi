-- ─────────────────────────────────────────────────────────────────────────────
-- Gabriel portfolio — schema, enums, and the admin gate.
--
-- Everything lives in a dedicated `gabriel` schema rather than `public`. This
-- project already hosts another portfolio's tables (public.projects,
-- public.site_settings, …) plus an unrelated `regulars` app, so a separate
-- schema is the only way to avoid name collisions and keep the two sets of
-- RLS policies from being confused for one another.
-- ─────────────────────────────────────────────────────────────────────────────

create schema if not exists gabriel;

-- USAGE only. Table-level privileges are granted explicitly per table below,
-- and RLS is what actually decides row visibility.
grant usage on schema gabriel to anon, authenticated, service_role;

-- ── Enums ────────────────────────────────────────────────────────────────────
do $$ begin
  create type gabriel.project_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gabriel.media_kind as enum ('image', 'video', 'model');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gabriel.document_kind as enum ('cv', 'transcript', 'certificate', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gabriel.message_status as enum ('new', 'read', 'replied', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gabriel.entry_kind as enum ('work', 'education', 'volunteer');
exception when duplicate_object then null; end $$;

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function gabriel.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ── Admin membership ─────────────────────────────────────────────────────────
create table if not exists gabriel.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);
alter table gabriel.admin_users enable row level security;

-- The admin predicate. Three things here are load-bearing:
--
--   SECURITY DEFINER — the body runs as the owner and so bypasses RLS. Without
--     it, a policy ON admin_users that queries admin_users recurses forever.
--   set search_path = '' — blocks search-path hijacking, which is why every
--     identifier below is schema-qualified.
--   STABLE — lets the planner call this once per statement, not once per row.
create or replace function gabriel.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from gabriel.admin_users a
    -- (select auth.uid()) rather than bare auth.uid(): the scalar subquery is
    -- hoisted into an InitPlan and evaluated once per query instead of per row.
    where a.user_id = (select auth.uid())
  );
$$;

revoke execute on function gabriel.is_admin() from public, anon;
grant execute on function gabriel.is_admin() to authenticated, service_role;

-- admin_users is readable only by admins and writable through no API path at
-- all — membership is granted by hand, in SQL.
drop policy if exists admin_users_select_admin on gabriel.admin_users;
create policy admin_users_select_admin on gabriel.admin_users
  for select to authenticated
  using ( gabriel.is_admin() );

grant select on gabriel.admin_users to authenticated;
revoke insert, update, delete on gabriel.admin_users from anon, authenticated;
