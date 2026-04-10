# directory.winlab.tw

Member directory for NYCU Winlab — a searchable, role-grouped contact list for lab members (professors, PhD students, master students, undergraduates, staff, and alumni).

## Features

- **Searchable table** — filter by name, email, or phone
- **Role filter** — one-click filter by professor / PhD / master / undergrad / staff / alumni / pending
- **Year sub-groups** — master and PhD students grouped by year (M1–M5, D1–D7) with collapsible sections
- **Sorted** — all members sorted alphabetically (zh-TW locale) within each group
- **Student ID column** — displays employee ID or student number
- **Keycloak SSO** — login via NYCU Keycloak OAuth

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth + Keycloak OAuth |
| Data fetching | TanStack Query v5 |
| Runtime | Bun |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- A [Supabase](https://supabase.com) project
- Keycloak OAuth configured as a Supabase provider

### Installation

```bash
git clone https://github.com/NYCU-WinLab/directory.winlab.tw.git
cd directory.winlab.tw
bun install
```

### Environment Variables

Copy `.env.example` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL of the app (e.g. `https://directory.winlab.tw`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/publishable key |
| `SUPABASE_SECRET_KEY` | Supabase service role key (server-side only) |

### Run Locally

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

```sql
CREATE TABLE members (
  id            uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text    NOT NULL,
  name_en       text,
  email         text    NOT NULL UNIQUE,
  phone         text,
  student_id    text,
  role          text    NOT NULL CHECK (role IN (
                  'professor','phd','master','undergraduate','alumni','staff','pending'
                )),
  title         text,
  avatar_url    text,
  github        text,
  office        text,
  research_areas text[],
  joined_year   integer,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view members"
  ON members FOR SELECT TO authenticated USING (true);
```

## Deployment

The project deploys automatically to Vercel via GitHub Actions:

| Trigger | Action |
|---|---|
| Push to `main` | Type check → build → deploy to production |
| Pull request | Type check → build → deploy preview → comment URL on PR |

### First-time Vercel Setup

1. [Import the repo](https://vercel.com/import) on Vercel
2. Set environment variables in Vercel dashboard (same as `.env.local`)
3. Add these GitHub repository secrets:

| Secret | Where to find |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel pull` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel pull` |

## Related Projects

- [bento.winlab.tw](https://github.com/NYCU-WinLab/bento.winlab.tw) — lab meeting food ordering system

## License

MIT © NYCU Winlab
