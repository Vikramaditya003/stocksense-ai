# StockSense AI

AI-powered inventory forecasting and reorder intelligence for Shopify merchants. Upload your sales CSV and get instant demand forecasts, stockout alerts, and reorder recommendations — powered by Groq's LLaMA 3.3 70B model.

---

## Features

- **AI Demand Forecasting** — 30, 60, and 90-day forecasts per SKU from your sales data
- **Stockout Risk Alerts** — critical / high / medium / low risk classification with specific stockout dates
- **Reorder Intelligence** — exact reorder quantities with lead time buffer and 20% safety stock
- **Revenue at Risk** — INR estimates of revenue lost if critical products stock out
- **Ad Spend Correlation** — input planned ad spend to see demand impact on stock levels
- **Forecast History** — saved forecasts per user via Supabase
- **Auth** — Clerk sign-in/sign-up with Google OAuth
- **Free tier gate** — 5 SKU limit, 60/90-day forecasts locked behind Pro upgrade

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI Model | Groq — LLaMA 3.3 70B Versatile |
| Auth | Clerk v7 |
| Database | Supabase (PostgreSQL) — Mumbai region |
| Hosting | Vercel — Mumbai edge region |
| Animations | Framer Motion |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq](https://console.groq.com) account (free)
- A [Clerk](https://clerk.com) account (free up to 10,000 MAU)
- A [Supabase](https://supabase.com) account (free up to 500MB)

### 1. Clone the repo

```bash
git clone https://github.com/Vikramaditya003/stocksense-ai.git
cd stocksense-ai
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

```env
# AI
GROQ_API_KEY=gsk_...

# Clerk — https://dashboard.clerk.com → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/forecast
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/forecast

# Supabase — https://supabase.com → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up the database

1. Create a Supabase project in **South Asia (Mumbai)** region
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the contents of [`supabase/schema.sql`](supabase/schema.sql)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
stocksense-ai/
├── app/
│   ├── api/forecast/route.ts     # POST /api/forecast — Groq AI endpoint
│   ├── forecast/page.tsx         # Main dashboard (upload CSV, view results)
│   ├── sign-in/                  # Clerk sign-in page
│   ├── sign-up/                  # Clerk sign-up page
│   ├── layout.tsx                # Root layout with ClerkProvider + SEO metadata
│   ├── sitemap.ts                # Auto-generated sitemap
│   └── robots.ts                 # Search engine rules
├── components/
│   ├── Navbar.tsx                # Navigation with auth buttons
│   ├── Hero.tsx                  # Landing page hero section
│   ├── Features.tsx              # Features section
│   ├── HowItWorks.tsx            # How it works section
│   └── Pricing.tsx               # Pricing section
├── lib/
│   ├── db.ts                     # Supabase DB helpers (save/get forecasts)
│   ├── supabase.ts               # Supabase client singleton
│   ├── security.ts               # Rate limiting, API key guard, error sanitizer
│   └── types.ts                  # Shared TypeScript types
├── supabase/
│   └── schema.sql                # Database schema + RLS policies
├── proxy.ts                      # Clerk middleware (Next.js 16 naming)
├── vercel.json                   # Vercel deploy config (Mumbai region)
└── .env.example                  # Environment variable reference
```

---

## Database Schema

Two tables in Supabase:

**`forecasts`** — stores each forecast result per user
```sql
id            uuid primary key
clerk_user_id text
created_at    timestamptz
sku_count     integer
health_score  integer
critical_count integer
summary       text
analysis      jsonb
```

**`user_plans`** — tracks free / pro / business tier per user
```sql
clerk_user_id text primary key
plan          text  -- 'free' | 'pro' | 'business'
created_at    timestamptz
updated_at    timestamptz
```

Row Level Security is enabled on both tables. The server uses the `service_role` key (bypasses RLS). Client-side queries are protected by JWT policies.

---

## CSV Format

The forecast API accepts sales data in this format:

```csv
product,sku,date,units_sold,current_stock
Premium Yoga Mat,YM-001,2024-01-01,8,120
Premium Yoga Mat,YM-001,2024-01-02,11,109
Resistance Bands,RB-003,2024-01-01,5,45
```

Required columns: `product`, `date`, `units_sold`, `current_stock`
Optional columns: `sku`, `price`

---

## Deployment

Deployed on Vercel with Mumbai (`bom1`) edge region for lowest latency from India.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vikramaditya003/stocksense-ai)

### Manual deploy steps

1. Push to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain after first deploy
5. Click **Deploy**

---

## Rate Limiting

The `/api/forecast` endpoint is rate limited to **10 requests per minute per IP** using an in-memory sliding window. This prevents abuse of the Groq API key.

---

## Free Tier Limits

| Service | Free Limit |
|---|---|
| Groq | ~14,400 requests/day (free tier) |
| Clerk | 10,000 monthly active users |
| Supabase | 500MB database, 2GB bandwidth |
| Vercel | 100GB bandwidth, unlimited deployments |

---

## License

MIT
