# Naila Azahra Portfolio (Next.js)

## Quick Start

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Routes

- `/` - Public portfolio site
- `/achievements/[slug]` - Achievement detail pages
- `/admin` - Admin panel for portfolio content

## Supabase Setup

The site uses static content from `app/data/portfolio.js` until Supabase is configured. After that,
the admin panel saves and reads these editable sections from Supabase:

- `experiences`
- `projects`
- `news`
- `achievements`

### 1. Create Environment Variables

Create `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=portfolio-assets
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not expose it with `NEXT_PUBLIC_`.

### 2. Run This SQL In Supabase

```sql
create table if not exists portfolio_content (
  section_key text primary key,
  content jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table portfolio_content enable row level security;

create policy "Public can read portfolio content"
on portfolio_content
for select
using (true);

insert into portfolio_content (section_key, content)
values
  ('experiences', '[]'::jsonb),
  ('projects', '[]'::jsonb),
  ('news', '[]'::jsonb),
  ('achievements', '[]'::jsonb)
on conflict (section_key) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

create policy "Public read portfolio assets"
on storage.objects
for select
using (bucket_id = 'portfolio-assets');

create policy "Upload portfolio assets"
on storage.objects
for insert
with check (bucket_id = 'portfolio-assets');
```

### 3. Create Storage Bucket (if not created)

1. Open Supabase Dashboard > Storage.
2. Create a public bucket named `portfolio-assets` (or match `SUPABASE_STORAGE_BUCKET`).

### 4. Fill Initial Data

1. Restart `npm run dev`.
2. Open `/admin`.
3. The current portfolio content is already loaded in the editor.
4. Click `Save portfolio` once to seed Supabase with the current data.

## Admin Content Shape

Each admin panel accepts a JSON array.

Experience:

```json
{
  "role": "Founder & Management Board Leader",
  "organization": "Growmates",
  "metrics": ["23 members managed", "78% performance growth"],
  "bullets": ["Designed management systems.", "Led coordination rhythms."],
  "orderIndex": 1
}
```

Project:

```json
{
  "title": "Hope & Help",
  "image": { "src": "https://example.com/image.jpg", "alt": "Program photo" },
  "problem": "Young people needed approachable mental health support.",
  "solution": "Built a structured outreach concept.",
  "impact": "Strengthened community mental health literacy.",
  "orderIndex": 1
}
```

News:

```json
{
  "source": "Identitas Unhas",
  "title": "Growmates, Bergerak untuk Pendidikan dan Kesetaraan Gender",
  "summary": "Coverage summary.",
  "href": "https://example.com/article",
  "image": { "src": "https://example.com/news.jpg", "alt": "News image" },
  "orderIndex": 1
}
```

Achievement:

```json
{
  "slug": "beasiswa-aktivis-nusantara",
  "title": "Beasiswa Aktivis Nusantara",
  "summary": "Recognized for leadership potential and community impact.",
  "image": { "src": "https://example.com/card.jpg", "alt": "Achievement preview" },
  "lead": "Long intro for the slug page.",
  "meta": ["Leadership", "Community Impact", "Scholarship"],
  "documentationBody": "Documentation intro.",
  "documentation": [{ "src": "https://example.com/doc.jpg", "alt": "Documentation" }],
  "certificateBody": "Certificate intro.",
  "certificate": { "src": "https://example.com/cert.jpg", "alt": "Certificate" },
  "orderIndex": 1
}
```
