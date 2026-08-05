-- ─────────────────────────────────────────────────────────────────────────────
-- Gabriel portfolio — content tables.
--
-- Every piece of copy on the public site is a row here, so the whole thing is
-- editable from /gabriel without a redeploy.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Site settings (enforced singleton) ───────────────────────────────────────
create table if not exists gabriel.site_settings (
  id                 boolean primary key default true check (id),  -- exactly one row, ever
  full_name          text        not null default '',
  role_title         text        not null default '',
  roles              text[]      not null default '{}',
  tagline            text        not null default '',
  hero_lines         text[]      not null default '{}',   -- the display type, one entry per line
  bio_short          text        not null default '',
  bio_md             text        not null default '',
  bio_html           text        not null default '',     -- derived; rendered on write
  location           text        not null default '',
  timezone           text        not null default 'Africa/Lagos',
  email              text        not null default '',
  available          boolean     not null default true,
  availability_label text        not null default 'Available for work',
  socials            jsonb       not null default '[]'::jsonb,  -- [{label,url,sort_order}]
  stats              jsonb       not null default '[]'::jsonb,  -- [{label,value}]
  seo_title          text        not null default '',
  seo_description    text        not null default '',
  seo_keywords       text[]      not null default '{}',
  og_image_url       text,
  portrait_url       text,
  updated_at         timestamptz not null default now()
);

-- ── Projects / case studies ──────────────────────────────────────────────────
create table if not exists gabriel.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null,
  tagline         text not null default '',
  role            text,
  year            int check (year between 1990 and 2100),
  period          text,
  client          text,
  stack           text[] not null default '{}',
  tags            text[] not null default '{}',
  summary         text not null default '',
  body_md         text not null default '',   -- source of truth, edited in /gabriel
  body_html       text not null default '',   -- derived; keeps markdown JS out of the public bundle
  metrics         jsonb not null default '[]'::jsonb,
  live_url        text,
  repo_url        text,
  cover_url       text,
  cover_alt       text not null default '',
  poster_url      text,                        -- static frame standing in for a WebGL scene
  status          gabriel.project_status not null default 'draft',
  featured        boolean not null default false,
  sort_order      int not null default 0,
  seo_title       text,
  seo_description text,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_status_sort_idx
  on gabriel.projects (status, sort_order, created_at desc);
create index if not exists projects_featured_idx
  on gabriel.projects (featured) where status = 'published';
create index if not exists projects_tags_gin  on gabriel.projects using gin (tags);
create index if not exists projects_stack_gin on gabriel.projects using gin (stack);

-- Stamp published_at exactly once, on the first transition to published.
create or replace function gabriel.stamp_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;

drop trigger if exists projects_stamp_published on gabriel.projects;
create trigger projects_stamp_published
  before insert or update on gabriel.projects
  for each row execute function gabriel.stamp_published_at();

-- ── Project media ────────────────────────────────────────────────────────────
create table if not exists gabriel.project_media (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references gabriel.projects (id) on delete cascade,
  kind         gabriel.media_kind not null default 'image',
  url          text not null,
  storage_path text,                 -- bucket-relative, so the object can be deleted later
  alt          text not null default '',
  caption      text not null default '',
  width        int,                  -- stored so next/image can reserve space; CLS stays at 0
  height       int,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists project_media_project_idx
  on gabriel.project_media (project_id, sort_order);

-- ── Experience / timeline ────────────────────────────────────────────────────
create table if not exists gabriel.experience (
  id         uuid primary key default gen_random_uuid(),
  org        text not null,
  org_url    text,
  role       text not null,
  location   text,
  kind       gabriel.entry_kind not null default 'work',
  start_date date not null,
  end_date   date,                   -- null means current
  summary    text not null default '',
  bullets    text[] not null default '{}',
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experience_dates_ok check (end_date is null or end_date >= start_date)
);
create index if not exists experience_order_idx
  on gabriel.experience (published, start_date desc);

-- ── Skills ───────────────────────────────────────────────────────────────────
create table if not exists gabriel.skill_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text unique not null,
  blurb      text not null default '',
  sort_order int not null default 0,
  published  boolean not null default true
);

create table if not exists gabriel.skills (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references gabriel.skill_categories (id) on delete cascade,
  name        text not null,
  level       int check (level between 0 and 100),
  sort_order  int not null default 0,
  unique (category_id, name)
);
create index if not exists skills_category_idx on gabriel.skills (category_id, sort_order);

-- ── Certifications ───────────────────────────────────────────────────────────
create table if not exists gabriel.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null,
  issuer_url     text,
  category       text not null default '',
  credential_id  text,
  credential_url text,
  issued_on      date,
  expires_on     date,
  published      boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists certifications_order_idx
  on gabriel.certifications (published, issued_on desc);

-- ── Documents (CV/resume) ────────────────────────────────────────────────────
create table if not exists gabriel.documents (
  id           uuid primary key default gen_random_uuid(),
  kind         gabriel.document_kind not null default 'cv',
  label        text not null default 'Curriculum Vitae',
  storage_path text not null,
  filename     text not null,
  mime_type    text not null default 'application/pdf',
  size_bytes   bigint,
  version      int not null default 1,
  is_current   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- At most one current document per kind. A partial unique index enforces this
-- atomically — no trigger, no race.
create unique index if not exists documents_one_current_per_kind
  on gabriel.documents (kind) where is_current;
create index if not exists documents_kind_idx on gabriel.documents (kind, version desc);

-- Flip which document is current, in one transaction.
create or replace function gabriel.set_current_document(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_kind gabriel.document_kind;
begin
  if not gabriel.is_admin() then
    raise exception 'not authorized';
  end if;

  select kind into v_kind from gabriel.documents where id = p_id;
  if v_kind is null then
    raise exception 'document not found';
  end if;

  update gabriel.documents set is_current = false where kind = v_kind and is_current;
  update gabriel.documents set is_current = true  where id = p_id;
end $$;

revoke execute on function gabriel.set_current_document(uuid) from public, anon;
grant execute on function gabriel.set_current_document(uuid) to authenticated;

-- ── Contact messages ─────────────────────────────────────────────────────────
create table if not exists gabriel.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  subject    text check (char_length(subject) <= 200),
  message    text not null check (char_length(message) between 1 and 5000),
  status     gabriel.message_status not null default 'new',
  source     text not null default 'contact_form',
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_status_idx
  on gabriel.contact_messages (status, created_at desc);

-- ── updated_at triggers ──────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['site_settings','projects','experience','certifications'] loop
    execute format('drop trigger if exists %I_set_updated_at on gabriel.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on gabriel.%I
       for each row execute function gabriel.set_updated_at()', t, t);
  end loop;
end $$;

-- ── Reorder helper ───────────────────────────────────────────────────────────
-- One round trip instead of N, and the whole reorder is atomic.
create or replace function gabriel.reorder_projects(p_ids uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not gabriel.is_admin() then
    raise exception 'not authorized';
  end if;

  update gabriel.projects p
     set sort_order = x.ord, updated_at = now()
    from unnest(p_ids) with ordinality as x(id, ord)
   where p.id = x.id;
end $$;

revoke execute on function gabriel.reorder_projects(uuid[]) from public, anon;
grant execute on function gabriel.reorder_projects(uuid[]) to authenticated;
