# Messefy Project Working Plan

## ১. এই ডকুমেন্টের উদ্দেশ্য

এই ডকুমেন্টে বর্তমান `system-design` অনুযায়ী পুরো project-এর gap analysis, frontend/backend remaining work, reliability improvement, এবং step-by-step execution plan দেওয়া হলো।  
এই ডকুমেন্ট শুধুই planning-এর জন্য। এখনো কোনো feature implementation শুরু করা হয়নি।

---

## ২. Project Goal Summary

এই project-এর মূল লক্ষ্য:

- একজন user signup/signin করবে।
- user এক সময়ে একটি workspace/mess create বা join করতে পারবে।
- workspace ভিত্তিক monthly meal accounting চলবে।
- daily meals, deposits, expenses, adjustments track হবে।
- per-member balance, meal rate, summary, history, export পাওয়া যাবে।
- owner/manager/member role অনুযায়ী permission কাজ করবে।
- online user এবং offline member দুটোই support করবে।

---

## ৩. বর্তমান অবস্থা: সারসংক্ষেপ বিশ্লেষণ

### ৩.১ যা আংশিকভাবে আছে

- Auth UI আছে: signup/signin + Google login flow।
- Workspace create/join related কিছু flow আছে।
- Member, period, meal entry-এর কিছু backend API আছে।
- Dashboard area, onboarding, members, current period, invitation pages-এর UI structure আছে।
- React Query + NextAuth + backend API integration-এর base setup আছে।

### ৩.২ সবচেয়ে গুরুত্বপূর্ণ gap

- System design-এর core accounting flow এখনো complete না।
- Backend-এ deposit, expense, summary, adjustment, export API নেই।
- Frontend-এর অনেক dashboard page এখনো mock data বা placeholder দিয়ে চলছে।
- Invitation flow design-এর সাথে match করছে না।
- Session/auth নিরাপদ না এবং design অনুযায়ী fully aligned না।
- Multi-tenant access control সব জায়গায় consistently enforce করা হয়নি।
- Period close/open, role restriction, member lifecycle, summary calculation এখনো অসম্পূর্ণ।

---

## ৪. Backend Remaining Work

### ৪.১ Auth ও Session

- plain text password বাদ দিয়ে password hashing যোগ করতে হবে।
- login/logout/session lifecycle design অনুযায়ী align করতে হবে।
- secure cookie-based JWT বা equivalent session strategy finalise করতে হবে।
- auth failure, token expiry, invalid session handling improve করতে হবে।

### ৪.২ Workspace ও Membership Rules

- “এক user এক সময়ে একটাই active workspace” rule backend level-এ enforce করতে হবে।
- workspace fetch-এর সময় membership validation বাধ্যতামূলক করতে হবে।
- owner, manager, member permission matrix consistent করতে হবে।
- offline member add/update/deactivate/reactivate flow implement করতে হবে।

### ৪.৩ Invitation Flow

- design অনুযায়ী email-based invitation flow rework করতে হবে।
- invitation token/status/expiry model লাগবে।
- join request বনাম owner invite flow আলাদা ও পরিষ্কার করতে হবে।
- accept/reject/cancel action-এ workspace-bound validation যোগ করতে হবে।

### ৪.৪ Period Management

- period create permission owner/manager policy অনুযায়ী tighten করতে হবে।
- open/close/reopen rules ঠিক করতে হবে।
- closed period edit-blocking সব write API-তে strict করতে হবে।
- এক workspace-এ overlapping/open period rule clear করে enforce করতে হবে।

### ৪.৫ Meal Module

- `guestMeals` design-এ required হলে schema ও API-তে restore করতে হবে।
- `(memberId, date)` uniqueness DB level-এ enforce করতে হবে।
- meal write-এর সময় `workspaceId`, `periodId`, `memberId` consistency validate করতে হবে।
- batch meal entry validation আরো strict করতে হবে।

### ৪.৬ Deposit Module

- deposit schema-based CRUD API implement করতে হবে।
- active/open period ছাড়া deposit block করতে হবে।
- member-wise deposit listing, period-wise listing, validation, permission add করতে হবে।

### ৪.৭ Expense Module

- expense CRUD API implement করতে হবে।
- MVP-র জন্য অন্তত `by_meals` allocation support complete করতে হবে।
- পরে `by_head`, `custom`, `personal` support phase-wise add করতে হবে।
- category, note, payer, allocation validation যোগ করতে হবে।

### ৪.৮ Adjustment Module

- manual credit/debit adjustment API implement করতে হবে।
- adjustment reason/history capture করতে হবে।
- summary calculation-এ adjustment include করতে হবে।

### ৪.৯ Summary & Calculation Engine

- meal rate calculation API করতে হবে।
- per-member balance statement API করতে হবে।
- period summary, totals, dashboard stats API করতে হবে।
- current month overview + history summary backend থেকে serve করতে হবে।

### ৪.১০ Export & Reporting

- CSV export implement করতে হবে।
- summary statement export endpoint লাগবে।
- future-ready ভাবে PDF/report architecture define করতে হবে।

### ৪.১১ Security, Integrity, Testing

- rate limiting যোগ করতে হবে।
- stronger validation layer যোগ করতে হবে।
- audit log optional হলেও hook structure রাখতে হবে।
- service/repository based testable architecture আনতে হবে।
- unit/integration test add করতে হবে:
  - auth
  - invitation
  - workspace isolation
  - period close rules
  - meal/deposit/expense calculations

---

## ৫. Frontend Remaining Work

### ৫.১ Auth Experience

- signin/signup flow backend auth hardening-এর সাথে align করতে হবে।
- session expiry হলে clean redirect + state recovery দিতে হবে।
- logout/session refresh UX improve করতে হবে।

### ৫.২ Workspace Onboarding

- create workspace wizard-এ invited member list বর্তমানে UI-only; এটাকে actual backend flow-এর সাথে connect করতে হবে।
- join mess flow slug/code/email invite decision অনুযায়ী redesign করতে হবে।
- workspace join request এবং invitation state profile page-এ properly show করতে হবে।

### ৫.৩ Dashboard

- main dashboard page এখন mock data based; এটাকে live summary data দিয়ে replace করতে হবে।
- current month overview, member balances, recent activity real API দিয়ে আনতে হবে।
- broken/nonexistent route link fix করতে হবে।

### ৫.৪ Members Module

- online/offline member management UI complete করতে হবে।
- role update, activate/deactivate, remove member action লাগবে।
- member filter labels backend role naming-এর সাথে align করতে হবে।

### ৫.৫ Invitations Module

- owner-sent invite list এবং user-received invitation list আলাদা করতে হবে।
- accept/reject/cancel flows role অনুযায়ী redesign করতে হবে।
- invitation status UX improve করতে হবে।

### ৫.৬ Period UI

- current period page-এর mock cards real backend stats দিয়ে replace করতে হবে।
- all months/history page real data driven করতে হবে।
- period close/reopen/delete confirmation flow refine করতে হবে।

### ৫.৭ Meal Entry UI

- meal sheet-এর batch entry কাজ করছে আংশিকভাবে, কিন্তু guest meal support, previous entry load, edit state, validation improve করতে হবে।
- date switching-এ existing entries preload করতে হবে।
- period closed হলে readonly state দেখাতে হবে।

### ৫.৮ Deposit UI

- deposit form এখন placeholder; full form, list, filter, member select, add/edit/delete flow বানাতে হবে।

### ৫.৯ Expense UI

- expense form এখন placeholder; full form, list, category, allocation type, edit/delete flow বানাতে হবে।

### ৫.১০ Summary / Balances / Reports

- member balances page এখন mock; এটাকে real summary API দিয়ে চালাতে হবে।
- summary statement, outstanding balance, settlement suggestion, export action implement করতে হবে।
- CSV export button real backend action-এর সাথে connect করতে হবে।

### ৫.১১ Settings

- settings page এখন mostly static; actual workspace settings API-এর সাথে connect করতে হবে।
- currency, timezone, calculation rules, notification settings-এর backend support না থাকলে staged delivery করতে হবে।

### ৫.১২ UI Reliability

- route path inconsistency ঠিক করতে হবে, বিশেষ করে `/dashboard/...` বনাম `/mess/dashboard/...`
- Tailwind dynamic class usage safe pattern-এ আনতে হবে।
- shared types backend response-এর সাথে align করতে হবে।
- query key, loading state, error state, optimistic invalidation clean করতে হবে।

---

## ৬. Project Flow Improvement Proposal

Project-টাকে reliable করতে নিচের flow improvement প্রস্তাব করছি:

### ৬.১ Canonical User Flow

1. User signup/signin
2. Profile page
3. Create workspace অথবা invitation/join request accept
4. Active workspace resolve
5. Owner first period create
6. Members add/invite/offline members setup
7. Daily meal/deposit/expense entry
8. Current month summary review
9. Period close
10. Export/history/archive

### ৬.২ Recommended Technical Flow

- Backend-এ আগে domain-complete API surface complete করতে হবে।
- তারপর frontend-এর mock pages live data-তে switch করতে হবে।
- Summary engine complete না করে dashboard polish করলে rework বাড়বে।
- Invitation flow final না করে onboarding polish করা ঠিক হবে না।
- Settings page শেষে করা ভালো, কারণ actual settings contract আগে define করতে হবে।

### ৬.৩ Reliability Improvements

- service layer introduce করতে হবে, যাতে controller-এ business logic কমে।
- central authorization helpers লাগবে।
- shared validation schema রাখা ভালো।
- summary calculation reusable function/service করতে হবে।
- transaction-safe write operation ব্যবহার করতে হবে।
- audit-friendly activity logging structure রাখতে হবে।
- API response shape standard করতে হবে।

---

## ৭. Priority Order

### Phase 1: Foundation Fix

- auth hardening
- workspace/member/invitation rule correction
- route/permission cleanup
- domain model consistency fix

### Phase 2: MVP Backend Completion

- deposits
- expenses
- adjustments
- summary calculations
- exports

### Phase 3: MVP Frontend Completion

- dashboard real data
- period pages real data
- deposit/expense forms
- balances/summary/report pages
- invitation/member flows

### Phase 4: Reliability & QA

- tests
- error handling
- edge cases
- performance cleanup
- observability/logging

---

## ৮. Step-by-Step Working Plan

### Step 1: Domain Contract Freeze

- `system-design.md` অনুযায়ী final MVP scope lock করা
- invitation model, session model, offline member rules, allocation scope final করা
- backend response contract define করা

### Step 2: Backend Foundation Refactor

- auth security fix
- permission middleware improve
- workspace/member access rules fix
- invitation model refactor

### Step 3: Core Accounting Backend

- deposit module complete
- expense module complete
- adjustment module complete
- summary engine complete
- export endpoint complete

### Step 4: Period & Meal Hardening

- meal uniqueness and validation
- guest meal support if required
- closed period enforcement
- manager/owner restrictions

### Step 5: Frontend Data Layer Cleanup

- API request modules standardize
- types align
- query key structure clean
- route path mismatch fix

### Step 6: Frontend Feature Completion

- dashboard live data
- current month live data
- period history live data
- deposit form/list
- expense form/list
- summary/balance/report pages

### Step 7: Onboarding & Invitation UX Completion

- create/join flow redesign
- invitation accept/reject/cancel UX
- profile state cleanup

### Step 8: Reliability Pass

- integration test
- permission test
- calculation test
- empty/loading/error UX polish

### Step 9: Release Readiness

- final manual QA
- seed/test data review
- production env checklist
- backup/export verification

---

## ৯. Detailed Tasklist

## Backend Tasklist

- [ ] Auth password hashing add করা
- [ ] secure session strategy finalize করা
- [ ] auth logout/session invalidation add করা
- [ ] workspace membership enforcement fix করা
- [ ] single active workspace rule enforce করা
- [ ] invitation schema/flow redesign করা
- [ ] owner invite + user join request flow separate করা
- [ ] period permission policy ঠিক করা
- [ ] period close/reopen rules harden করা
- [ ] meal validation tighten করা
- [ ] meal uniqueness constraint add করা
- [ ] guestMeals support add/confirm করা
- [ ] deposit CRUD API implement করা
- [ ] expense CRUD API implement করা
- [ ] adjustment CRUD/API implement করা
- [ ] summary গণনার service তৈরি করা
- [ ] balance statement endpoint তৈরি করা
- [ ] dashboard stats endpoint তৈরি করা
- [ ] CSV export endpoint implement করা
- [ ] rate limiting add করা
- [ ] audit log hook structure রাখা
- [ ] backend unit/integration test add করা

## Frontend Tasklist

- [ ] auth pages backend contract-এর সাথে align করা
- [ ] workspace onboarding wizard complete করা
- [ ] join mess flow redesign করা
- [ ] profile invitation state improve করা
- [ ] dashboard mock data remove করা
- [ ] current month page real data driven করা
- [ ] all months/history page real data driven করা
- [ ] members page role/filter/action align করা
- [ ] invitations page split and fix করা
- [ ] meal entry page existing data preload support করা
- [ ] deposit entry UI build করা
- [ ] expense entry UI build করা
- [ ] member balances page real summary data দিয়ে build করা
- [ ] export/report actions connect করা
- [ ] settings page staged backend integration করা
- [ ] route mismatch fix করা
- [ ] shared types/api state cleanup করা
- [ ] loading/error/empty states improve করা

## QA / Reliability Tasklist

- [ ] permission matrix test করা
- [ ] multi-tenant isolation test করা
- [ ] closed period edit blocking test করা
- [ ] summary calculation accuracy test করা
- [ ] onboarding/invitation flow test করা
- [ ] export flow verify করা
- [ ] edge cases document করা

---

## ১০. Recommended Execution Sequence

সবচেয়ে কার্যকর sequence হবে:

1. auth + permission + invitation foundation fix
2. deposit/expense/adjustment/summary backend complete
3. meal/period integrity complete
4. frontend data layer cleanup
5. dashboard/current month/members/invitations live data
6. deposit/expense/balances/report pages complete
7. testing + QA + polish

এই sequence follow করলে unnecessary rework কম হবে।

---

## ১১. আমার কিছু clarification দরকার

Implementation শুরু করার আগে নিচের decisionগুলো confirm করলে কাজ দ্রুত ও নির্ভুল হবে:

- Invitation কি `email invite` ভিত্তিক হবে, নাকি `workspace slug/code + owner approval` flow রাখবে?
- Session architecture কি `NextAuth session + backend JWT bridge` থাকবে, নাকি backend cookie JWT-তে unify করতে চাও?
- Offline member কি full first-class entity হবে, অর্থাৎ meal/deposit/expense/summary সব জায়গায় online user-এর মতো behave করবে?
- MVP-তে expense allocation কি শুধু `by_meals` থাকবে, নাকি `by_head/custom/personal` এখনই লাগবে?
- CSV export কি MVP-তেই mandatory?

---

## ১২. পরের ধাপ

তুমি permission দিলে আমি এই plan অনুযায়ী execution শুরু করব।  
আমি suggest করছি প্রথম execution block হবে:

1. auth/session/invitation rule finalisation
2. backend accounting module completion
3. frontend live data migration
