# Premium Sports Wear — Next.js Project

This is Stage 1 of the build roadmap: the real, database-backed foundation that
replaces the static HTML prototype. It's meant to be opened in **Claude Code**
(or handed to a developer) and built out stage by stage.

## What's here

```
app/
  layout.tsx          Root layout, fonts, global styles
  page.tsx             Homepage (pulls categories from the database)
  globals.css          Tailwind entrypoint
  api/
    designs/route.ts         Save / fetch Design Studio configurations
    quote-requests/route.ts  Submit / fetch quote requests
  shop/ studio/ about/ contact/ dashboard/   Placeholders — port the
     matching page from the static prototype into each of these

prisma/
  schema.prisma        Full data model: users, products, orders, designs,
                        dealer applications, quote requests, messages
  seed.ts              Seeds categories + the 12 products from the prototype

lib/
  prisma.ts            Prisma client singleton

tailwind.config.js      Exact brand colors/fonts from the prototype
.env.example             All environment variables you'll need
```

## Setup

```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL at minimum
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Get a free Postgres database fast from **Supabase** or **Neon** — copy the
connection string into `DATABASE_URL`.

## What's already wired up
- Database schema for the entire feature set in the original brief
  (customers, dealers, admins, products, orders, saved designs, quotes)
- Homepage fetching real category data instead of hardcoded HTML
- API routes for saving Design Studio configs and submitting quote requests
- Tailwind configured with your exact brand tokens (colors, fonts)

## What to build next (in order)
1. **Port the remaining pages** — Shop, Design Studio, About, Contact — from
   the static prototype's HTML into React components in their matching
   folders under `app/`. The visual design is already done; this is
   translation work.
2. **Auth** — wire up NextAuth (`next-auth` is already in `package.json`)
   for email/password or Google login.
3. **Connect the Design Studio to `/api/designs`** — when a user clicks
   "Save Design," POST the panel colors, logo, name/number/flag to that route.
4. **Cart + checkout** — add Stripe Checkout, create `Order`/`OrderItem`
   rows on successful payment.
5. **Dashboards** — Customer, Dealer, Admin — each is mostly a page that
   queries Prisma for the logged-in user's data and renders it.

See `build-roadmap.md` (in the outputs folder from our conversation) for the
full week-by-week plan this project structure is based on.
