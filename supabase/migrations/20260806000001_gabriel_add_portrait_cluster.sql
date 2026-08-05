-- The hero shows a small cluster of circular portraits rather than a single
-- image. portrait_url stays as the canonical one (used for JSON-LD and OG);
-- this array drives the cluster and may be empty, in which case the hero simply
-- renders without it.
alter table gabriel.site_settings
  add column if not exists portraits text[] not null default '{}';
