[README (1).md](https://github.com/user-attachments/files/34552489/README.1.md)
# OpsMind

**An AI operations command center for incident monitoring, analytics, and automated triage.**

OpsMind brings service health, incident response, and operational analytics into a single dashboard. Engineers can watch their stack in real time, work through a live incident feed, and run AI-assisted analysis on any incident to get a probable root cause and a recommended action.

**Live demo:** [opsmind-rlt5.vercel.app](https://opsmind-rlt5.vercel.app)

> **Note:** OpsMind is a portfolio/demo project. Service metrics, the incident feed, billing, and authentication are simulated. The incident-creation page and the optional AI analysis are the parts that talk to real backends (Supabase and Groq). See [Demo vs. real](#demo-vs-real).

---

## Features

### Marketing site
A single-page landing site (`/`) with animated sections for the platform overview, dashboard, incidents, analytics, and project showcase. Includes scroll-reveal, parallax cards, a mouse-follow light effect, and reduced-motion support.

### Operations dashboard
- Service health table for `api-gateway`, `auth-service`, `ml-inference`, `data-pipeline`, and `cache-cluster`, showing status, latency, and load
- Time-range switching (1h / 24h / 7d)
- Throughput, error budget, and active AI prediction tiles
- Live-updating numbers and sparklines driven by client-side simulation

### Incident response
- Live incident feed with severity (`critical`, `warning`, `info`) and status (`investigating`, `monitoring`, `resolved`)
- Filter by all, active, or resolved
- **Analyze Incident** action that opens an AI analysis panel with:
  - Severity level and confidence score
  - Estimated resolution time
  - Probable root cause and recommended action
  - Affected infrastructure
- Separate `/incidents` page to create incidents and list them from a Supabase table

### Analytics
Reliability score, cost distribution (compute, storage, network, other), SLO compliance, deploy frequency, and change failure rate.

### App shell
Authenticated area with a sidebar, workspace selector (Acme Production, Staging, Sandbox), notifications dropdown, user menu, and demo **Settings** and **Billing** pages.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com) 4, [Framer Motion](https://www.framer.com/motion/) 12 |
| Language | TypeScript 5 |
| Database | [Supabase](https://supabase.com) (PostgreSQL) via `@supabase/supabase-js` |
| AI (optional) | [Groq](https://groq.com) chat completions API |
| Linting | ESLint 9 with `eslint-config-next` |
| Hosting | [Vercel](https://vercel.com) |

---

## Getting started

### Prerequisites
- Node.js 20.9 or newer
- npm
- A Supabase project (only needed for the `/incidents` page)
- A Groq API key (optional)

### Installation

```bash
git clone https://github.com/Alancodess/opsmind.git
cd opsmind
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
# Supabase (used by /api/incidents)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: enables live AI analysis via Groq.
# If omitted, the app falls back to built-in simulated analysis.
GROQ_API_KEY=your_groq_api_key
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For `/incidents` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For `/incidents` | Supabase anon (public) key |
| `GROQ_API_KEY` | No | Enables live AI incident analysis |

### Database setup

The `/api/incidents` route reads from and writes to an `incidents` table. Create it in the Supabase SQL editor:

```sql
create table public.incidents (
  id         bigint generated always as identity primary key,
  title      text not null,
  severity   text not null,
  status     text not null default 'open',
  created_at timestamptz not null default now()
);
```

Because the app uses the public anon key from the server route, you also need Row Level Security policies that allow `select` and `insert` on this table for the `anon` role, or RLS disabled for local experiments.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the project with ESLint |

---

## Using the app

1. Visit `/` for the landing page.
2. Go to `/sign-in`. Authentication is mocked: use any email, any password, or the demo sign-in button.
3. You land on `/dashboard`, the command center.
4. Click **Analyze Incident** on any feed item to see the AI analysis panel.
5. Use the sidebar to open **Incidents**, **Settings**, or **Billing**.

---

## API routes

### `POST /api/analyze-incident`

Analyzes an incident and returns a structured assessment.

**Request**

```json
{
  "incident": {
    "id": "INC-2847",
    "title": "Elevated latency on ml-inference",
    "severity": "warning",
    "time": "2m ago",
    "status": "investigating",
    "assignee": "AI Agent"
  }
}
```

All six `incident` fields are required; otherwise the route returns `400`.

**Response**

```json
{
  "analysis": {
    "severityLevel": "P2 — High",
    "confidenceScore": 92,
    "estimatedResolutionTime": "25 minutes",
    "probableRootCause": "…",
    "recommendedAction": "…",
    "affectedInfrastructure": ["ml-inference", "api-gateway"]
  },
  "incidentId": "INC-2847",
  "analyzedAt": "2026-01-01T00:00:00.000Z",
  "source": "Live AI Analysis"
}
```

**How it works**
- With `GROQ_API_KEY` set, the route sends the incident to Groq's chat completions API (`llama3-70b-8192`) and expects a JSON response.
- If the key is missing, or the model's output cannot be parsed as JSON, it falls back to a deterministic simulated analysis. `source` is `"Simulated Analysis"` in that case, so the UI can tell the two apart.
- The simulated analysis classifies incidents by keywords in the title (latency, database, traffic, certificate, cache, API) and generates a matching assessment.

### `GET /api/incidents`
Returns all rows from the Supabase `incidents` table.

### `POST /api/incidents`
Creates an incident. Body: `{ "title": string, "severity": string }`. New incidents are inserted with `status: "open"`.

---

## Project structure

```
opsmind/
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Landing page (/)
│   │   ├── (app)/              # Authenticated app shell
│   │   │   ├── dashboard/
│   │   │   ├── incidents/
│   │   │   ├── billing/
│   │   │   └── settings/
│   │   ├── sign-in/            # Sign-in page
│   │   ├── api/
│   │   │   ├── analyze-incident/   # AI / simulated incident analysis
│   │   │   └── incidents/          # Supabase-backed incident CRUD
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── marketing/          # Landing page composition
│   │   ├── opsmind/            # Dashboard, incident, analytics, and motion components
│   │   │   └── hooks/          # Live-data and animation hooks
│   │   └── saas/               # App shell: sidebar, header, auth, settings, billing
│   ├── lib/
│   │   ├── auth.ts             # Mock user, workspaces, session cookie helpers
│   │   ├── supabase.ts         # Supabase client
│   │   ├── incidents.ts        # Seed incident data
│   │   ├── live-ops.ts         # Live metric simulation helpers
│   │   └── mock-incident-analysis.ts   # Simulated analysis engine
│   ├── middleware.ts           # Route protection
│   └── types/incident.ts       # Shared incident types
├── .env.example
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── tsconfig.json
```

---

## Demo vs. real

| Area | Behavior |
| --- | --- |
| Authentication | **Mocked.** Signing in sets an `opsmind_session` cookie. Any credentials work. `src/middleware.ts` redirects `/dashboard`, `/settings`, and `/billing` to `/sign-in` when the cookie is absent. |
| Service metrics and sparklines | **Simulated** in the browser with randomized jitter. |
| Dashboard incident feed | **Seeded** from `src/lib/incidents.ts`, with statuses that shift over time. |
| AI incident analysis | **Real** when `GROQ_API_KEY` is set, otherwise simulated. |
| `/incidents` page | **Real**, backed by Supabase. |
| Settings and Billing | **Static demo UI.** Buttons do not persist anything. |

Replace the mock auth with a real provider (for example Supabase Auth) before using any of this with real data.

---

## Deployment

The app is deployed on Vercel.

1. Push the repository to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables from the table above.
4. Deploy.
