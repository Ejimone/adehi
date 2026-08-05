-- Seed deliberately contains nothing fabricated.
--
-- The site this replaces shipped six invented projects, eight invented
-- certifications, a made-up GPA and dead example.com links. Rather than port
-- that forward, empty strings and empty arrays are used wherever the real value
-- is unknown; the UI hides those blocks entirely. The two seeded projects are
-- 'draft', so they are invisible to the public but give the case-study template
-- something to render against during development.

insert into gabriel.site_settings (
  id, full_name, role_title, roles, tagline, hero_lines,
  bio_short, location, email, available, availability_label,
  socials, stats, seo_title, seo_description
)
values (
  true,
  'Gabriel Adehi',
  'Software Engineer',
  array['Software Engineer'],
  'Building software at the intersection of systems thinking and human experience.',
  array['GABRIEL', 'ADEHI'],
  '',
  'Abuja, Nigeria',
  '',                                   -- set from /gabriel
  true,
  'Open to opportunities',
  '[]'::jsonb,                          -- set from /gabriel
  '[]'::jsonb,
  'Gabriel Adehi — Software Engineer',
  'Software engineer based in Abuja, Nigeria. Systems, backend, and interface craft.'
)
on conflict (id) do nothing;

-- Skill categories carry no invented proficiency numbers: `level` is left null,
-- and the UI renders a plain list rather than a fake percentage bar.
insert into gabriel.skill_categories (name, blurb, sort_order) values
  ('Languages',        '', 0),
  ('Systems & Backend','', 1),
  ('Frontend',         '', 2),
  ('Data & ML',        '', 3)
on conflict (name) do nothing;

insert into gabriel.skills (category_id, name, sort_order)
select c.id, s.name, s.ord
from gabriel.skill_categories c
join (values
  ('Languages','Python',0),
  ('Languages','TypeScript',1),
  ('Languages','C++',2),
  ('Systems & Backend','PostgreSQL',0),
  ('Systems & Backend','Linux',1),
  ('Frontend','React',0),
  ('Frontend','Next.js',1),
  ('Frontend','Tailwind CSS',2),
  ('Data & ML','NumPy',0)
) as s(cat, name, ord) on s.cat = c.name
on conflict (category_id, name) do nothing;

-- Draft placeholders. Not publicly visible; replaced from /gabriel with real work.
insert into gabriel.projects (slug, title, tagline, role, year, stack, tags, summary, body_md, status, sort_order)
values
  ('placeholder-one', 'Placeholder One', 'Replace this from /gabriel',
   'Sole engineer', 2026, array['TypeScript'], array['Web'],
   'Seed row so the case-study template has something to render.',
   E'## Overview\n\nSeed content.', 'draft', 0),
  ('placeholder-two', 'Placeholder Two', 'Replace this from /gabriel',
   'Sole engineer', 2026, array['Python'], array['Systems'],
   'Seed row so the index grid has two cards.',
   E'## Overview\n\nSeed content.', 'draft', 1)
on conflict (slug) do nothing;

-- Admin bootstrap, run once out of band:
--   insert into gabriel.admin_users (user_id, email)
--   select id, email from auth.users where email = '<your-login-email>'
--   on conflict (user_id) do nothing;
--
-- Then in the dashboard: Authentication -> Providers -> Email -> disable
-- "Enable signups". With signups off, admin_users can only ever grow by hand.
