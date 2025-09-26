# 🍴 Messefy Web — Meal/Workspace Accounting System

A **multi-tenant meal/accounting system** for Mess / Hostel / Workspace.
Tracks **meals, deposits, expenses, balances** and auto-calculates member shares.

---

## 📂 Project Structure

messey-web/
│── backend/ # Bun + Hono API + Drizzle ORM + Auth
│── frontend/ # Next.js (App Router)
│── docs/ # System design + ER diagram
│── README.md

yaml
Copy code

---

## 📖 Documentation

- [System Design Spec](./docs/system-design.md)
- [ER Diagram](./docs/er-diagram.md)
- Backend-specific notes → `backend/docs/`
- Frontend-specific notes → `frontend/docs/`

---

## ⚙️ Tech Stack

- **Database**: PostgreSQL
- **Auth**: Auth.js (Google, Facebook, Email/Password)
- **Backend**: Bun + Hono REST API + Drizzle ORM
- **Frontend**: Next.js (App Router)

---

## 🧠 AI Agent Guide

⚡ For Copilot / AI agents:

- Always follow [`docs/system-design.md`](./docs/system-design.md).
- Respect domain models & ER diagram.
- **Do not** create new fields/APIs unless written in docs.
- **Frontend** must follow Next.js App Router conventions.
- **Backend** must follow Hono REST API + Drizzle ORM.
- All records are scoped by **messId**.
- Role-based authorization is **always enforced**.
