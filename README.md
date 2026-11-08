OpsMind — AI Operations Platform
> Intelligence for modern operations. An AI-powered operations command center for incident monitoring, analytics, and intelligent automation.
Live demo: opsmind-rlt5.vercel.app
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel&logoColor=white)
---
Overview
OpsMind unifies incident response, observability, and AI-driven automation into a single command center. It gives engineering teams real-time visibility across their stack, surfaces anomalies before they become outages, and helps triage and resolve incidents faster.
Features
Operational Dashboard
Real-time service health across the stack (API gateway, auth, ML inference, data pipeline, cache cluster)
Per-service status, latency, and load at a glance
Request throughput, error budget, and active AI predictions
Time-range filtering (1h / 24h / 7d)
Incident Response
Live incident feed with severity levels (critical, warning, info) and status (investigating, monitoring, resolved)
Filter by all / active / resolved
Analyze Incident action for AI-assisted triage and root-cause suggestions
Tracks auto-triage accuracy, escalation time saved, and runbooks executed
Analytics
Reliability score with quarter-over-quarter trend
Cost distribution breakdown (compute, storage, network, other)
SLO compliance, deploy frequency, and change failure rate
Authentication
Sign-in flow with a protected dashboard app
Tech Stack
Layer	Technology
Framework	Next.js
Language	TypeScript
Database	Supabase (PostgreSQL)
Hosting	Vercel
Getting Started
Prerequisites
Node.js 18+
A Supabase project
Installation
```bash
# Clone the repository
git clone https://github.com/Alancodess/opsmind.git
cd opsmind

# Install dependencies
npm install
```
Environment Variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Run Locally
```bash
npm run dev
```
Open http://localhost:3000 in your browser.
Build for Production
```bash
npm run build
npm start
```
Project Structure
```
opsmind/
├── app/          # Next.js app routes (landing, sign-in, dashboard)
├── components/   # Reusable UI components
├── lib/          # Supabase client and utilities
└── public/       # Static assets
```
> Adjust this section to match your actual folder layout.
Deployment
The app is deployed on Vercel. To deploy your own copy:
Push the repo to GitHub
Import it in Vercel
Add the environment variables above
Deploy
Author
Alan Abraham Anil
GitHub: @Alancodess
LinkedIn: alan-abraham-anil
License
This project is licensed under the MIT License.
