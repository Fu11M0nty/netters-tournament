# MK Netters & MK Dons Tournament Results

A two-day netball tournament results site with a public view (standings, results, fixtures) and a password-protected admin console for entering scores. Built with Next.js 16, React 19, Tailwind CSS 4, and Supabase.

See [CLAUDE.md](./CLAUDE.md) for the full architecture, data model, and component spec.

---

## Run locally

**Prerequisites:** Node.js 20+, a Supabase project (see below).

```bash
npm install
cp .env.example .env.local   # then fill in the two Supabase values
npm run dev
```

Open http://localhost:3000. The root redirects to `/saturday`.

Required environment variables (both in `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Both are safe to ship to the browser — Row Level Security enforces access control on the database side.

---

## Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql) — creates the `age_groups`, `teams`, `matches` tables, enables RLS, and installs the public-read / authenticated-write policies.
3. In the same editor, run [`supabase/seed.sql`](./supabase/seed.sql) to populate Saturday/Sunday age groups, teams and a realistic mix of completed and scheduled matches.
4. In **Storage**, create a **public** bucket named `team-logos` (the admin team-edit form uploads logos to this bucket).
5. In **Project settings → API**, copy the project URL and the `anon` public key into your `.env.local`.

### Create the admin user

1. In the Supabase dashboard, go to **Authentication → Users → Add user → Create new user**.
2. Enter the organiser's email and a password, and tick **Auto Confirm User** so they can sign in immediately (no email verification step).
3. That's it — any confirmed user in the project can sign into `/admin/login`. There is no self-signup route, so creating users through the dashboard is how admin access is granted.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository. Vercel auto-detects Next.js — no build config changes needed.
3. In the import step, add the two environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. First build takes ~1 minute.
5. Vercel gives you a `*.vercel.app` URL immediately. For a custom domain, go to **Project → Settings → Domains** and follow the DNS instructions.

After the first deploy, every push to `main` re-deploys automatically.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                              # redirects to /saturday
│   ├── [day]/
│   │   ├── page.tsx                          # picks first age group for the day
│   │   └── [ageGroupSlug]/page.tsx           # public standings + results + fixtures
│   ├── admin/
│   │   ├── page.tsx                          # admin dashboard (Matches / Teams tabs)
│   │   └── login/page.tsx                    # Supabase email/password sign-in
│   └── layout.tsx                            # SiteHeader, SiteFooter, Toaster
├── components/                               # TournamentView, StandingsTable, ResultCard, etc.
├── lib/
│   ├── supabase.ts                           # browser + server + middleware clients
│   ├── standings.ts                          # pure standings calculator + points helper
│   ├── slugify.ts
│   └── types.ts
supabase/
├── schema.sql                                # run first
└── seed.sql                                  # run second
middleware.ts                                 # gates /admin routes behind Supabase Auth
```

---

## Points system

- Win = **5**
- Draw = **3**
- Losing bonus = **1** (only if the losing team's score is strictly more than 50% of the winning team's score — e.g. 10–6 earns the bonus, 10–5 does not)
- Loss with no bonus = **0**

Standings are calculated dynamically from match results in [`src/lib/standings.ts`](./src/lib/standings.ts) — there is no stored standings table.
