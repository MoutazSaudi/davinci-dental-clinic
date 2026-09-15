# Project Context

## Project

Modern dental clinic platform based in Damascus.

The project consists of:

1. Public multilingual dental clinic website.
2. Admin dashboard for managing clinic content.
3. Appointment management.
4. Services.
5. Doctors.
6. Blog.
7. FAQ.
8. Testimonials.

The current goal is to build the frontend/UI using realistic mock data before completing production backend functionality.

---

## Tech Stack

- Next.js 16
- App Router
- React 19
- TypeScript strict
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod
- pnpm

---

## Architecture

The project follows Clean Architecture.

Database access must remain behind the service layer.

UI components must not directly access Prisma.

Server-only functionality must never be exposed to client components.

---

## Routing

Public pages use:

/[locale]/*

Supported locales:

- ar
- en

Examples:

/ar
/en

/ar/services
/en/services

/ar/doctors
/en/doctors

/ar/blog
/en/blog

Admin pages use:

/admin/*

The admin area is intentionally separated from the public localized routing.

---

## Internationalization

Arabic is RTL.

English is LTR.

Static UI translations belong in:

src/lib/i18n/dictionaries/

Dynamic content must NOT be stored in translation JSON files.

Dynamic content must come from the data layer.

---

## Current Development Stage

The project is currently in the UI/design phase.

Use mock/demo data where backend data is not yet available.

Do not introduce unnecessary authentication, Odoo, WhatsApp API,
or production integrations during the UI phase.

Do not replace the existing architecture just to simplify UI development.

---

## Important Existing Areas

Before modifying anything, inspect:

src/app/
src/components/
src/lib/
src/data/
prisma/
AGENTS.md

Never assume a component, utility, service, or route does not exist.
Inspect the repository first.