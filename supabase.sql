create table if not exists portfolio_content (
  section_key text primary key,
  content jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table portfolio_content enable row level security;

drop policy if exists "Public can read portfolio content" on portfolio_content;
create policy "Public can read portfolio content"
on portfolio_content
for select
using (true);

insert into portfolio_content (section_key, content)
values
  ('heroStats', $$[
    {
      "id": 1,
      "value": 100,
      "suffix": "+",
      "label": "Talent Applications Evaluated Through Structured Recruitment & Selection",
      "labelId": "Lamaran Talenta Dievaluasi Melalui Rekrutmen & Seleksi Terstruktur",
      "isActive": true,
      "orderIndex": 1
    },
    {
      "id": 2,
      "value": 23,
      "suffix": "+",
      "label": "Team Members Led Across Multiple Organizational Projects",
      "labelId": "Anggota Tim Dipimpin dalam Berbagai Proyek Organisasi",
      "isActive": true,
      "orderIndex": 2
    },
    {
      "id": 3,
      "value": 200,
      "suffix": "+",
      "label": "Beneficiaries Impacted Through Community Programs",
      "labelId": "Penerima Manfaat Terdampak Melalui Program Komunitas",
      "isActive": true,
      "orderIndex": 3
    },
    {
      "id": 4,
      "value": 78,
      "suffix": "%",
      "label": "Performance Improvement Achieved Through Training & Development Programs",
      "labelId": "Peningkatan Performa Dicapai Melalui Program Pelatihan & Pengembangan",
      "isActive": true,
      "orderIndex": 4
    }
  ]$$::jsonb),
  ('experiences', '[]'::jsonb),
  ('projects', '[]'::jsonb),
  ('communityProjects', $$[
    {
      "id": 1,
      "title": "Featured Community Project",
      "titleId": "Proyek Komunitas Pilihan",
      "description": "Founded and led a community initiative focused on connecting people, sharing knowledge, and fostering meaningful collaboration.",
      "descriptionId": "Mendirikan dan memimpin inisiatif komunitas yang berfokus menghubungkan orang, berbagi pengetahuan, dan membangun kolaborasi bermakna.",
      "buttonLabel": "Website",
      "buttonLabelId": "Website",
      "href": "https://growmates.dekatlokal.com/",
      "image": {
        "src": "/laptop-growmates.svg",
        "alt": "Growmates website preview on a laptop"
      },
      "isActive": true,
      "orderIndex": 1
    }
  ]$$::jsonb),
  ('editing', $$[
    {
      "id": 1,
      "type": "phone",
      "title": "Short-form editing showcase",
      "description": "Mobile-first editing sample with clean pacing and visual rhythm.",
      "href": "https://www.instagram.com/nailaazahrra",
      "instagramName": "@nailaazahrra",
      "isActive": true,
      "image": {
        "src": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=900&q=75",
        "alt": "Social media editing project preview on phone"
      },
      "orderIndex": 1
    },
    {
      "id": 2,
      "type": "phone",
      "title": "Campaign edit preview",
      "description": "A compact visual edit prepared for social storytelling.",
      "href": "https://www.instagram.com/nailaazahrra",
      "instagramName": "@nailaazahrra",
      "isActive": true,
      "image": {
        "src": "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=900&q=75",
        "alt": "Campaign editing project preview on phone"
      },
      "orderIndex": 2
    },
    {
      "id": 3,
      "type": "gallery",
      "title": "Editorial layout",
      "description": "A polished editing composition for digital presentation.",
      "isActive": true,
      "image": {
        "src": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1100&q=75",
        "alt": "Editorial editing project composition"
      },
      "orderIndex": 3
    },
    {
      "id": 4,
      "type": "gallery",
      "title": "Social content system",
      "description": "A visual set designed for consistent social media storytelling.",
      "isActive": true,
      "image": {
        "src": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=75",
        "alt": "Social media content editing workflow"
      },
      "orderIndex": 4
    },
    {
      "id": 5,
      "type": "gallery",
      "title": "Creative campaign frame",
      "description": "A refined campaign visual with balanced typography and imagery.",
      "isActive": true,
      "image": {
        "src": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=75",
        "alt": "Creative campaign editing frame"
      },
      "orderIndex": 5
    }
  ]$$::jsonb),
  ('news', '[]'::jsonb),
  ('achievements', '[]'::jsonb),
  ('site_profile', '{"image":{"src":"","alt":"Naila Azahra profile photo"}}'::jsonb)
on conflict (section_key) do update
set
  content = case
    when portfolio_content.section_key = 'editing'
      and portfolio_content.content = '[]'::jsonb
      then excluded.content
    else portfolio_content.content
  end,
  updated_at = case
    when portfolio_content.section_key = 'editing'
      and portfolio_content.content = '[]'::jsonb
      then now()
    else portfolio_content.updated_at
  end;

-- Project cards now use a single editable summary instead of
-- problem / solution / impact fields. This keeps older JSON data usable.
update portfolio_content
set
  content = (
    select coalesce(
      jsonb_agg(
        case
          when jsonb_typeof(project_item) = 'object' then
            (project_item - 'problem' - 'solution' - 'impact') ||
            jsonb_build_object(
              'summary',
              coalesce(
                nullif(project_item->>'summary', ''),
                concat_ws(
                  ' ',
                  nullif(project_item->>'problem', ''),
                  nullif(project_item->>'solution', ''),
                  nullif(project_item->>'impact', '')
                )
              )
            )
          else project_item
        end
        order by item_order
      ),
      '[]'::jsonb
    )
    from jsonb_array_elements(content) with ordinality as project_entries(project_item, item_order)
  ),
  updated_at = now()
where section_key = 'projects'
  and jsonb_typeof(content) = 'array'
  and exists (
    select 1
    from jsonb_array_elements(content) as existing_entries(existing_item)
    where jsonb_typeof(existing_item) = 'object'
      and (
        existing_item ? 'problem'
        or existing_item ? 'solution'
        or existing_item ? 'impact'
        or not (existing_item ? 'summary')
      )
  );

create table if not exists contact_messages (
  id bigint generated by default as identity primary key,
  name text not null check (char_length(trim(name)) between 2 and 100),
  email text not null check (char_length(trim(email)) between 5 and 254),
  message text not null check (char_length(trim(message)) between 5 and 4000),
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

drop policy if exists "Public can submit contact messages" on contact_messages;
create policy "Public can submit contact messages"
on contact_messages
for insert
with check (true);

-- Portfolio assets for builder cover, documentation, and certificate uploads.
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio assets" on storage.objects;
create policy "Public read portfolio assets"
on storage.objects
for select
using (bucket_id = 'portfolio-assets');

drop policy if exists "Upload portfolio assets" on storage.objects;
create policy "Upload portfolio assets"
on storage.objects
for insert
with check (bucket_id = 'portfolio-assets');

-- Separate public bucket for the navbar profile photograph.
insert into storage.buckets (id, name, public)
values ('profile-assets', 'profile-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read profile assets" on storage.objects;
create policy "Public read profile assets"
on storage.objects
for select
using (bucket_id = 'profile-assets');

drop policy if exists "Upload profile assets" on storage.objects;
create policy "Upload profile assets"
on storage.objects
for insert
with check (bucket_id = 'profile-assets');
