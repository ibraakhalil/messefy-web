# Mess/Workspace Meal Accounting System — System Design Specification

---

## 1. Project Overview
- **Goal**: Manage shared mess/workspace meal accounting.
- **Key Functions**:
  - User signup/signin.
  - Create or join workspaces.
  - Monthly meal and expense accounting.
  - Track daily meals, deposits, shared costs.
  - Auto-calculate per-member balances.
  - Support online and offline members.

---

## 2. User Roles & Permissions
- **Owner** → Full workspace control (can reopen/close period, assign managers).
- **Manager** → Manage members, records, meals, deposits, expenses.
- **Member** → Add/view meals, view balances/statements.

---

## 3. High-Level Architecture

### 3.1 Frontend
- Framework: **Next.js (App Router)**
- Server-Side Rendering (SSR) for dashboards.
- Client mutations for edits/updates.

### 3.2 Backend
- Runtime: **Bun**
- Framework: **Hono (REST API)**
- ORM: **Drizzle**
- Auth: **Auth.js** (Google, Facebook, Email/password)

### 3.3 Database
- **Postgres**

---

## 4. Multi-Tenancy
- **Workspace (`messId`)** = tenant boundary.
- All records are scoped by `messId`.
- **Access Control** = `messId + role`.
- **Period** defines a monthly accounting scope (status = open/closed).
- Closed periods cannot be edited (except reopen by owner).

---

## 5. Core Domain Models

### 5.1 User
- Identity & authentication.
- Attributes: `id, name, email, authProvider`.

### 5.2 Workspace
- Belongs to one owner.
- Contains members and their records.

### 5.3 Member
- Represents a user/person inside a workspace.
- Roles = Owner, Manager, Member.
- Supports offline members.

### 5.4 Period
- `year + month` scope.
- Status = `open` | `closed`.

### 5.5 MealEntry
- Unique by `(memberId, date)`.
- Tracks counts: breakfast, lunch, dinner, guests.

### 5.6 Deposit
- Member deposits/payments into pool.

### 5.7 Expense
- Shared costs (bazar, rent, utilities).
- Allocation types = `by_meals | by_head | custom | personal`.

### 5.8 Adjustment
- Manual credit/debit.

### 5.9 Invitation
- Email-based invites for joining.

### 5.10 AuditLog (Optional)
- Tracks who/what/when changes occurred.

---

## 6. Domain Rules & Calculations

### 6.1 Meal Rules
- `unique(memberId, entryDate)` constraint on meals.

### 6.2 Totals
- `totalMeals = Σ(breakfast + lunch + dinner + guestMeals)`
- `mealExpenses = Σ(expenses where allocation = by_meals)`
- `mealRate = mealExpenses / totalMeals`

### 6.3 Per-Member Calculation
- `memberMeals = Σ(meals for member)`
- `byMealsShare = memberMeals × mealRate`
- `byHeadShare = by_head_expenses / active_members`
- `customShare = Σ(custom splits)`
- `personal = Σ(personal expenses)`
- `totalDue = byMealsShare + byHeadShare + customShare + personal - adjustments`
- `balance = deposits - totalDue`

---

## 7. Features

### 7.1 MVP
- Auth: Google, Facebook, Email/password.
- Workspaces: create/update, invite, add offline members.
- Periods: create/open/close manually.
- Meals: daily grid entries, bulk actions.
- Deposits: quick add by member.
- Expenses: shared “by meals”.
- Summary: meal rate, per-member balances, CSV export.

### 7.2 Phase 2 (Future)
- Advanced allocation types (by_head, custom, personal).
- Adjustments & audit logs.
- PDF export, charts & analytics.
- DB row-level security, caching.
- Notifications, OAuth, PWA support.

---

## 8. API Strategy
All requests validated by `messId` & role.

- **Auth** → login, logout, session lifecycle.
- **Workspaces** → CRUD, member management.
- **Periods** → list, create, close.
- **Meals** → grid/bulk upsert per date/period.
- **Deposits** → add/list per member.
- **Expenses** → expense CRUD, per category.
- **Summary** → totals & balance per member.

---

## 9. Frontend Pages
- **Dashboard** → overview of workspaces, periods, stats.
- **Members** → invite + manage members.
- **Meals** → grid/calendar input with bulk ops.
- **Deposits** → list + add deposits.
- **Expenses** → categorized list with allocations.
- **Summary** → balances, CSV export.
- **Settings** → workspace config, currency, roles.

---

## 10. Security
- Secure session cookies: `httpOnly`, `sameSite`.
- Role-based access control on every request.
- Server-side enforcement by `messId`.
- Basic rate limiting for auth/writes.
- DB integrity via constraints and indexes.

---

## 11. Data Integrity
- Unique: `(memberId, date)` for MealEntry.
- Foreign Keys scoped by `messId`.
- Indexes: `(messId, periodId)`, `(memberId, date)`.
- Monetary values stored as fixed precision decimals (2dp).
- Soft-delete/inactive flag for members.

---

## 12. Operations
- Separate environments: dev, staging, prod.
- Observability with `messId`-scoped logs.
- DB backup daily; allow restore of last closed period.
- Export support: CSV (optional S3).

---

## 13. Performance & Scaling
- Cache per-period summary, invalidate on writes.
- Pagination in meals/expenses.
- Summary pre-computed at period close.
- Avoid N+1 by pre-aggregation and optimized queries.
