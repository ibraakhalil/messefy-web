# Mess/Workspace Meal Accounting System

## 🎯 Project Goal

- Manage mess/workspace meal accounting by month.
- Track **daily meals, deposits, shared expenses**.
- Auto-calculate **per-member balances**.
- Support **online users** and **offline members**.

---

## 👥 Core Users & Roles

- **Owner** → Full control of workspace.
- **Manager/Admin** → Manage members, records, periods.
- **Member** → Add/view meals, see statements.
- **Viewer** → Read-only access.

---

## 🏗 High-Level Architecture

- **Frontend**: Next.js (App Router)
  - SSR for dashboards, client mutations for edits.
- **Backend**: Bun + Hono (REST), cookie-based session auth.
- **Database**: Managed Postgres.
- **Email (optional)**: Transactional (invites, password reset).

---

## 🏢 Multi-Tenancy

- **Workspace** = tenant boundary.
- All records carry **workspaceId**.
- Access controlled by **workspaceId + role**.
- **Period** = monthly accounting scope (`open` / `closed`).

---

## 📦 Core Domain Model

- **User** → Identity and login.
- **Workspace** → Mess context; belongs to an owner.
- **Member** → Person in a workspace (linked user or offline).
- **Period** → Year+month with status.
- **MealEntry** → Per member/day (breakfast, lunch, dinner, guests).
- **Deposit** → Member payments.
- **Expense** → Shared costs (bazar, rent, utilities).
- **Adjustment** → Manual credit/debit.
- **Invitation** → Email-based invites.
- **AuditLog** → Optional (track changes).

---

## 📊 Key Rules & Calculations

- **MealEntry**: unique per (member, date).
- **Closed Periods** → no edits (except reopening by owner).

### Totals

- `totalMeals = Σ(breakfast + lunch + dinner + guestMeals)`
- `mealExpenses = Σ(expenses where allocation = by_meals)`
- `mealRate = mealExpenses / totalMeals`

### Per-Member

- `memberMeals = Σ(meals for member)`
- `byMealsShare = memberMeals × mealRate`
- `byHeadShare = by_head_expenses / active_members`
- `customShare = Σ(custom splits)`
- `personal = Σ(personal expenses)`
- `totalDue = byMealsShare + byHeadShare + customShare + personal - adjustments`
- `balance = deposits - totalDue`

---

## 🚀 MVP Features

- Auth: email/password, session cookies.
- Workspaces: create/update, invite, add offline members.
- Periods: auto-create current month; open/close control.
- Meals: daily grid entry + bulk actions.
- Deposits: quick add per member.
- Expenses: shared bazar (`by_meals`).
- Summary: meal rate, per-member balances, CSV export.

---

## ⭐ Phase 2 (Future)

- Extra allocations (by_head, custom, personal).
- Adjustments & audit logs.
- PDF export, charts, analytics.
- DB row-level security, caching.
- OAuth login, notifications, PWA.

---

## 🌐 API Strategy

- **Auth** → login, logout, session lifecycle.
- **Workspaces** → CRUD, member management.
- **Periods** → list/create/close.
- **Meals** → bulk upsert by date/period.
- **Deposits & Expenses** → per period.
- **Summary** → totals + statements.

All requests **validated & scoped by workspaceId**.

---

## 📄 Frontend Pages

- **Dashboard** → workspaces, periods, quick stats.
- **Members** → add offline/online, invite, assign roles.
- **Meals** → grid/calendar, bulk actions.
- **Deposits** → per-member list, quick add.
- **Expenses** → categorized list, allocation.
- **Summary** → meal rate, balances, export.
- **Settings** → workspace config, currency, roles.

---

## 🔐 Security & Access Control

- Secure, httpOnly, same-site session cookies.
- Role-based checks per action.
- Server-side scoping by workspaceId.
- Basic rate-limiting (auth + writes).
- DB constraints & indexes for integrity.

---

## 🗄 Data Integrity & Indexing

- Unique: `(memberId, entryDate)` on MealEntry.
- FKs: all tied to workspaceId.
- Indexes: `(workspaceId, periodId)`, `(memberId, date)`.
- Monetary: fixed precision decimals (2dp).
- Soft-delete/status for inactive members.

---

## ⚙️ Operations

- Separate environments: dev/staging/prod.
- Observability: logs with workspaceId context.
- Daily DB backups; restore last closed period.
- CSV exports; optional S3 storage.

---

## 📈 Performance & Scaling

- Cache per-period summaries; invalidate on writes.
- Pagination for meals/expenses.
- Precompute & store summary on period close.
- Avoid N+1 with pre-aggregated totals.

---

## ☁️ Deployment

- **Frontend**: Next.js on Vercel.
- **Backend**: Hono + Bun on Fly.io/Railway.
- **DB**: Managed Postgres (Neon, Supabase).
- **Cache/Queue**: Upstash Redis (optional).
- **Email**: Resend (invites, reset).
- **DNS**:
  - `app.yourdomain.com` → Web app
  - `api.yourdomain.com` → API

---

## ✅ MVP Checklist

- [ ] Workspaces & members (online/offline)
- [ ] Auto current-month period
- [ ] Add meals (grid)
- [ ] Add deposits & expenses
- [ ] Summary (meal rate + balances)
- [ ] Role-based access
- [ ] CSV export
- [ ] Logging & backups

---

## 📌 Key Early Decisions

- Supported allocation methods in MVP (**recommend: by_meals only**).
- Offline members (recommended).
- Currency & locale defaults.
- Period closing rules & reopening permissions.
