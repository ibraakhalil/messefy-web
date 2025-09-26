# Mess/Workspace Meal Accounting System

## 🎯 Project Flow

- User initially open a account by signup/singin without creating mess workspace
- Then if he wants, create a mess (as Owner) or join in another one (as mess member).
- Manage mess/workspace meal accounting by month.
- Track **daily meals, deposits, shared expenses**.
- Auto-calculate **per-member balances**.
- Support **online users** and **offline members**.

---

## 👥 Core Users & Roles

- **Owner** → Full control of mess workspace.
- **Manager** → Manage members, records, periods, meals, deposite etc.
- **Member** → Add/view meals, see statements.

---

## 🏗 High-Level Architecture

- **Frontend**: Next.js (App Router)
  - SSR for dashboards, client mutations for edits.
- **Backend**: Bun + Hono (REST) + Drizzle, Auth.js based authentication: Google + Facebook + Email cradential.
- **Database**: Postgres.

---

## 🏢 Multi-Tenancy

- **Mess Workspace** = tenant boundary.
- All records carry **messId**.
- Access controlled by **messId + role**.
- **Period** = monthly accounting scope (`open` / `closed`).

---

## 📦 Core Domain Model

- **User** → Identity and login.
- **Workspace** → Mess context; belongs to an owner.
- **Member** → Person in a workspace.
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

- Auth: Google, Facebook, email/password, session cookies.
- Workspaces: create/update, invite, add offline members.
- Periods: manually create current month; open/close control.
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

All requests **validated & scoped by messId**.

---

## 📄 Frontend Pages (in future may change)

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
- Server-side scoping by messId.
- Basic rate-limiting (auth + writes).
- DB constraints & indexes for integrity.

---

## 🗄 Data Integrity & Indexing

- Unique: `(memberId, entryDate)` on MealEntry.
- FKs: all tied to messId.
- Indexes: `(messId, periodId)`, `(memberId, date)`.
- Monetary: fixed precision decimals (2dp).
- Soft-delete/status for inactive members.

---

## ⚙️ Operations

- Separate environments: dev/staging/prod.
- Observability: logs with messId context.
- Daily DB backups; restore last closed period.
- CSV exports; optional S3 storage.

---

## 📈 Performance & Scaling

- Cache per-period summaries; invalidate on writes.
- Pagination for meals/expenses.
- Precompute & store summary on period close.
- Avoid N+1 with pre-aggregated totals.
