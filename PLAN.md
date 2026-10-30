# Petal Ledger — Product & Build Plan

A quoting and recipe-building tool for event florists. For each event the florist sets a client budget, tax rate and markups, organizes the work into categories, and builds items as flower recipes plus hard goods. The app turns that into a priced client proposal and a stem-accurate wholesale order showing how many stems are used and how many are left over.

---

## 1. Core concepts

| Concept | What it is | Key fields |
| --- | --- | --- |
| **Event** | A wedding, gala, shower, etc. | client, date, venue, status, **budget**, pricing settings, categories, sourcing choices, breakage buffer % |
| **Pricing settings** (per event) | Overrides the studio defaults for this event | **tax rate**, **floral markup**, consumable markup, rental markup, labor rate, delivery fee, whether labor is taxable |
| **Category** (per event) | A florist-defined grouping | name (Personal Flowers, Ceremony, Reception, ...), ordered items |
| **Item** | One line on the quote, built as a recipe | name, quantity, flowers (flower + stems per unit), hard goods (good + qty per unit), labor minutes, notes, optional price override |
| **Recipe template** | A reusable starting point for items | same shape as an item, copied when added so it can be changed per event |
| **Flower** | A catalog entry | name, variety, color, photo, **seasonal availability by month**, **wholesaler offers** (stems per bunch, price per bunch) |
| **Wholesaler** | A supplier | name, contact, location, lead time |
| **Hard good** | A non-floral supply | unit cost, category, **consumed vs. reusable/rental**, stock on hand |

### Pricing formula (per unit, currently implemented)

```
unit price = flower cost × floral markup
           + consumable hard goods × hard-good markup
           + rental/reusable hard goods × rental markup
           + labor minutes / 60 × labor rate
           (or a manual price override)

event total = Σ(unit price × qty) + delivery + tax
tax applies to the items and delivery, and to labor only when labor is taxable
```

Flower cost uses the wholesaler chosen for that flower on this event, or the cheapest per-stem offer when none is chosen.

### Stem accounting

1. Add up stems per flower across every item × quantity: these are the **stems used**.
2. Add the event's breakage buffer %.
3. Round up to whole bunches for the chosen wholesaler: these are the **stems ordered**.
4. **Leftover = ordered − used**, shown as stem count and dollar value.
5. Group the order by wholesaler into purchase orders, with an "order by" date taken from each wholesaler's lead time.

---

## 2. Phased roadmap

### Phase 0: Clickable prototype with mock data ✅ (this branch)
- Vite + React + TypeScript single-page app, data kept in the browser's localStorage
- Events dashboard showing budget used per event
- Quote builder: categories → items → recipe editor (flowers, hard goods, labor, override), with seasonal warnings
- Stems & order tab: usage, bunch rounding, leftovers, wholesaler choice, purchase orders
- Client proposal view that prints cleanly (prices only, no costs)
- Event settings: budget, tax, markups, labor, delivery
- Catalog pages: flowers (photos, seasonality, offers, usage across events), recipes, hard goods (stock vs. need), wholesalers

### Phase 1: Real backend & accounts
- **Stack suggestion:** Next.js (or keep Vite + a separate API) with **PostgreSQL** via Prisma or Drizzle, plus auth (Clerk, Auth.js or Supabase Auth)
- Multi-tenant: `studio` → users, with all data scoped to a studio
- Move the calculations into a shared package used by both server and client, so totals never drift
- Studio-level defaults for markup, tax and labor rate, copied onto new events
- Image upload for flowers (S3 or Supabase Storage)
- Audit fields (created/updated by and at) and soft deletes

### Phase 2: Flower data source
The data source is still unknown, so the catalog is behind a plain `Flower` / `WholesalerOffer` shape. Options to evaluate:
1. **Manual entry + CSV import** (the guaranteed baseline): florists upload wholesaler price sheets
2. **Wholesaler integrations:** many wholesalers publish weekly availability and price lists by email or in their portals; parse or import them on a schedule
3. **Shared community catalog:** global flower records (name, variety, photo, seasonality) shared across studios, with prices kept private to each studio
4. Track **price history** per offer so quotes can lock the price on the quote date and flag changes before ordering

### Phase 3: Proposal & client workflow
- Shareable client proposal link, e-signature and deposit through Stripe
- Proposal versions, with a "revised" diff shown to the client
- Inspiration photos per item, plus mood boards
- Change-order tracking after booking

### Phase 4: Operations
- Combined ordering across all events in a week (merge stems to reduce leftovers)
- **Leftover inventory:** record actual leftovers after an event and offer them to the next event's order
- Hard-goods inventory with rental check-out and return
- Production schedule and work orders from recipes (what to build, when, by whom)
- Reports: margin by event and category, flower usage trends, waste %

### Phase 5: Polish
- Mobile-friendly recipe sheets for the design team
- Substitution suggestions for out-of-season flowers (same color and shape, in season, similar cost)
- Export to QuickBooks or Xero

---

## 3. Proposed database schema (Phase 1)

```
studio(id, name, default_tax_rate, default_floral_markup, default_hard_good_markup, default_rental_markup, default_labor_rate)
user(id, studio_id, email, role)

wholesaler(id, studio_id, name, location, contact, lead_time_days)
flower(id, studio_id, name, variety, color, hex, image_url)
flower_seasonality(flower_id, month, availability)          -- or a 12-element array column
wholesaler_offer(id, flower_id, wholesaler_id, stems_per_bunch, price_per_bunch, effective_from)
hard_good(id, studio_id, name, category, unit_cost, reusable, in_stock)

recipe_template(id, studio_id, name, description, labor_minutes)
recipe_template_flower(template_id, flower_id, stems)
recipe_template_hard_good(template_id, hard_good_id, quantity)

event(id, studio_id, name, client_name, client_email, date, venue, status, budget,
      tax_rate, floral_markup, hard_good_markup, rental_markup, labor_rate, delivery_fee, tax_labor,
      wastage_buffer_pct)
event_sourcing(event_id, flower_id, wholesaler_id)
event_category(id, event_id, name, position)
event_item(id, category_id, name, quantity, notes, labor_minutes, price_override, position)
event_item_flower(item_id, flower_id, stems)
event_item_hard_good(item_id, hard_good_id, quantity)
event_leftover(event_id, flower_id, actual_leftover_stems)   -- Phase 4
```

---

## 4. Code layout (prototype)

```
src/
  types.ts                 domain model
  data/mock.ts             mock flowers, wholesalers, hard goods, recipes, events
  lib/calc.ts              pricing, totals and stem-order math (pure functions)
  state/store.tsx          React context store with localStorage persistence (swap for API)
  components/              FlowerImage (placeholder art), shared UI
  pages/                   Events, Flowers, Recipes, Hard goods, Wholesalers
  pages/event/             QuoteBuilder, StemsTab, ClientQuote, EventSettings
```

## 5. Open questions
- Where will flower and price data come from (see Phase 2)? This decides most of the backend work.
- Should markup apply per flower type (e.g. premium blooms × 4, greenery × 2.5) as well as per event?
- How should rentals be priced: a markup on cost (current) or a flat rental fee per use?
- Is the tax rate set by the venue address? An automatic lookup (e.g. TaxJar) may be worth adding.
- One studio per account, or agencies managing several studios?
