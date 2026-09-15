<!-- BEGIN:nextjs-agent-rules -->

**# This is NOT the Next.js you know**

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Overview

This project is a production-ready full-stack dental clinic platform built with Next.js App Router.

The system consists of:

* Public bilingual website
* Admin Dashboard / CMS
* Dynamic content management
* Appointment management
* SEO infrastructure
* Arabic and English localization
* PostgreSQL database
* Prisma ORM
* Authentication and authorization
* External integrations such as Odoo and WhatsApp

The application must be:

* Production-ready
* Maintainable
* Scalable
* Secure
* SEO-friendly
* Accessible
* Fully responsive
* Optimized for performance

---

# 1. Core Architecture

Use a pragmatic Clean Architecture approach.

The primary dependency flow should be:

```text
UI / Pages
    ↓
Server Actions / Route Handlers
    ↓
Business / Application Services
    ↓
Prisma
    ↓
PostgreSQL
```

Keep responsibilities separated:

```text
app/
→ Routing, pages, layouts, route handlers and server actions

components/
→ Reusable UI components

lib/services/
→ Business and application logic

lib/auth/
→ Authentication and authorization

lib/integrations/
→ External service integrations

lib/validations/
→ Zod validation schemas

lib/seo/
→ SEO utilities and structured data

lib/i18n/
→ Static UI translations

lib/utils/
→ Generic reusable utilities

prisma/
→ Database schema, migrations and seed data

types/
→ Shared TypeScript types
```

Do not put business logic directly inside React components or page files.

Do not put large Prisma queries directly inside UI components.

Avoid unnecessary abstraction and unnecessary architectural layers.

Prefer simple, maintainable solutions over over-engineering.

Do not rewrite or restructure the existing architecture unless explicitly requested or clearly required.

Prefer incremental changes that preserve existing functionality.

---

# 2. Repository-First Agent Behavior

Before implementing any task:

1. Inspect the relevant existing files.
2. Search the repository for related functionality.
3. Identify existing components, utilities, services and patterns.
4. Check the existing database schema before introducing new models or fields.
5. Check existing dependencies before adding new packages.
6. Understand how the affected feature currently works.
7. Identify the smallest appropriate change.
8. Implement the change.
9. Validate the implementation.
10. Review the final diff.

Do not make assumptions about:

* APIs
* Database models
* Environment variables
* Business rules
* Existing components
* External services
* Authentication behavior

If something cannot be determined from the repository, clearly state the assumption before implementing it.

Do not silently make major architectural decisions.

Do not rewrite working code without a clear reason.

---

# 3. Next.js Rules

Use Next.js App Router.

The generated Next.js agent rules at the top of this file are authoritative.

Before implementing Next.js functionality, inspect the relevant documentation under:

```text
node_modules/next/dist/docs/
```

Do not rely solely on prior knowledge of Next.js.

Prefer Server Components by default.

Use `"use client"` only when client-side interactivity is actually required.

Do not convert entire pages into Client Components unnecessarily.

Prefer:

* Server Components for server-side data fetching
* Server Actions for internal mutations
* Route Handlers for external APIs and webhooks
* `next/image` for images
* `next/font` for fonts
* Next.js Metadata API for SEO
* `generateMetadata()` for dynamic metadata

Do not use deprecated Pages Router patterns.

Do not use:

```text
getServerSideProps
getStaticProps
getInitialProps
```

unless explicitly required by an existing legacy part of the project.

---

# 4. Server and Client Boundaries

Never import server-only code into Client Components.

Client Components must not directly access:

* Prisma
* PostgreSQL
* Server-only secrets
* Private API credentials
* Server-only integrations

Use `server-only` for modules that must never enter a client bundle when appropriate.

For example, server-only modules may include:

```text
lib/prisma.ts
lib/services/*
lib/integrations/*
```

Do not expose server-side business logic through client bundles.

---

# 5. Data Access and Business Logic

Prisma should normally be accessed through the service layer.

Preferred flow:

```text
Page / Server Action
        ↓
Business Service
        ↓
Prisma
        ↓
PostgreSQL
```

Example:

```text
lib/services/service.service.ts
lib/services/doctor.service.ts
lib/services/blog.service.ts
lib/services/appointment.service.ts
```

Pages should call service functions instead of containing raw Prisma queries.

Do not duplicate database queries across multiple pages.

Reuse existing service functions whenever possible.

Service functions should encapsulate business rules and data-access logic appropriate to the feature.

Server Actions are entry points to the application, not a replacement for the service layer.

---

# 6. Full-Stack and CMS Rules

The public website and Admin Dashboard are two parts of the same application.

Any dynamic content displayed on the public website must have a clearly defined source of truth.

The source of truth for business content must normally be PostgreSQL.

Do not hardcode dynamic business content inside React components or pages.

Dynamic content includes:

* Services
* Doctors
* Blog posts
* FAQs
* Testimonials
* Gallery
* Clinic information
* Appointments

Dynamic content must be manageable through the Admin Dashboard when appropriate.

The Admin Dashboard should support:

* Create
* Edit
* Delete
* Save Draft
* Publish
* Unpublish
* Preview
* Translation management
* SEO metadata management

Before implementing a new CMS-managed entity, inspect and define:

* Database model
* Relationships
* Translation requirements
* Lifecycle/status
* Validation schema
* Service layer
* Authorization requirements
* Admin UI
* Public rendering
* SEO behavior
* Cache invalidation

Do not implement only the public page while leaving the content-management side undefined.

---

# 7. Admin Dashboard

The Admin Dashboard should be separated from the public website UI.

Preferred structure:

```text
app/
└── admin/
    ├── login/
    └── dashboard/
        ├── services/
        ├── doctors/
        ├── blog/
        ├── gallery/
        ├── faq/
        ├── testimonials/
        ├── appointments/
        ├── users/
        └── settings/
```

Use:

```text
components/admin/
```

for admin-specific components.

Admin pages should support:

* Loading states
* Error states
* Empty states
* Form validation
* Search
* Filtering
* Pagination where needed
* Confirmation before destructive operations
* Success/error feedback

Destructive operations such as deletion must require confirmation.

Do not hide important functionality on mobile.

---

# 8. Draft and Publishing System

Dynamic content should support appropriate lifecycle states.

Do not force the same status model onto every entity.

For publishable content such as blog posts and services, support states such as:

```text
DRAFT
PUBLISHED
ARCHIVED
```

or an equivalent model.

For operational entities such as appointments, use domain-specific statuses.

Example:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
NO_SHOW
```

Use entity-specific lifecycle fields where appropriate.

Do not assume every entity should use `isPublished`.

Published content may include:

```text
publishedAt
```

and appropriate status fields.

---

# 9. Cache and Revalidation

Caching must be intentional.

Do not apply the same caching strategy to every page.

Public content such as:

* Services
* Doctors
* Blog posts
* FAQs

may use caching / ISR where appropriate.

Sensitive or real-time data such as appointments should not use stale public caching.

When content is created, updated, published, or unpublished from the Admin Dashboard, invalidate the relevant cached pages/data.

Use the current Next.js-supported mechanisms such as:

```text
revalidatePath()
revalidateTag()
```

as appropriate for the installed Next.js version.

Do not force users to wait for a fixed hourly revalidation period after publishing content.

---

# 10. Database Rules

Use PostgreSQL with Prisma.

Major entities should normally include:

```text
createdAt
updatedAt
```

Publishable entities may include:

```text
publishedAt
```

Use:

* Appropriate indexes
* Unique constraints
* Foreign keys
* Proper relationships

Do not modify the Prisma schema casually.

Before changing the schema, consider:

* Relationships
* Indexes
* Uniqueness
* Existing data
* Migrations
* Multilingual requirements
* Backward compatibility

Use Prisma migrations for committed schema changes.

Do not use `prisma db push` as the normal production schema-change workflow.

Never modify production data directly during normal development.

---

# 11. Multilingual Database Content

Supported locales:

```text
ar
en
```

Public URLs must use:

```text
/ar/...
/en/...
```

Dynamic content should support independent Arabic and English translations where required.

Example:

```text
Service
├── id
├── image
├── category
├── status
└── translations
    ├── ar
    └── en
```

Translation records may contain:

```text
title
shortDescription
fullDescription
seoTitle
seoDescription
```

Every translatable entity must clearly define whether translations are:

* Required
* Optional
* Allowed to fall back to another locale

Do not publish content that lacks required translations unless fallback behavior is explicitly part of the requirements.

---

# 12. Static UI Translations

Use:

```text
lib/i18n/
```

for static UI translations.

For example:

```text
lib/i18n/dictionaries/ar.json
lib/i18n/dictionaries/en.json
```

These files should contain UI text such as:

* Navigation
* Buttons
* Form labels
* Validation messages
* Generic UI text

Do not store dynamic business content in JSON dictionaries.

Do not store these in `ar.json` or `en.json`:

* Doctor records
* Services
* Blog posts
* FAQs
* Testimonials
* SEO content

Those belong in PostgreSQL.

Reusable UI components should not contain unnecessary hardcoded Arabic or English UI strings.

---

# 13. URL and Slug Rules

Localized slugs are allowed and may be preferable for SEO.

For example:

```text
/ar/services/زراعة-الأسنان
/en/services/dental-implants
```

or equivalent URL-safe slugs.

Do not assume Arabic and English slugs must be identical.

The language switcher should preserve the current page whenever an equivalent translation exists.

Example:

```text
/ar/services/dental-implants
        ↓
/en/services/dental-implants
```

Do not redirect users to the homepage when an equivalent localized page exists.

---

# 14. RTL / LTR Rules

Arabic must use RTL.

English must use LTR.

The document language and direction should be configured at the appropriate layout level.

Prefer CSS logical properties:

```text
margin-inline-start
margin-inline-end
padding-inline
inset-inline-start
inset-inline-end
```

Avoid unnecessary hardcoded directional properties such as:

```text
margin-left
margin-right
left
right
```

Use them only when technically justified.

All components must work correctly in both RTL and LTR.

---

# 15. SEO Rules

SEO is a core project requirement.

Every indexable page must have appropriate:

* Title
* Description
* Canonical URL
* Open Graph metadata
* Twitter metadata where appropriate
* hreflang
* Structured data where relevant

Use the current Next.js Metadata API.

Dynamic pages should generate metadata from their actual content.

Examples:

* Services
* Doctors
* Blog posts
* FAQ pages
* Other indexable dynamic content

Do not hardcode fake business information.

Never invent:

* Clinic address
* Phone numbers
* Doctors
* Certifications
* Reviews
* Opening hours
* Medical claims
* Awards
* Success rates

Use actual project data or clearly marked placeholders when explicitly requested.

---

# 16. Medical SEO and Content Safety

This is a medical/dental website.

Do not generate unsupported medical claims.

Do not invent:

* Treatment guarantees
* Success rates
* Medical statistics
* Patient outcomes
* Qualifications
* Certifications
* Clinical claims

Do not describe the clinic as "the best" or make similar competitive claims unless explicitly provided and approved by the project owner.

Medical content provided by the project owner should be preserved accurately.

Do not substantially alter medical claims without instruction.

---

# 17. Structured Data

Generate structured data from actual project/database content.

Use appropriate Schema.org types where relevant, such as:

```text
MedicalClinic
Physician
Person
MedicalProcedure
Article
FAQPage
BreadcrumbList
Organization
WebSite
```

Only use schema types that accurately represent the page.

Do not add structured data merely for SEO manipulation.

Do not include information in JSON-LD that is not visible or supported by the actual website content.

---

# 18. Sitemap and Robots

The sitemap must be dynamic where required.

Only published and indexable content should appear in the sitemap.

Include localized URLs when applicable.

Do not include:

```text
/admin
/login
private pages
draft content
non-indexable pages
```

The robots configuration must appropriately protect private/admin areas.

---

# 19. Authentication and Authorization

Admin functionality must be protected by authentication.

Do not rely on frontend route hiding for security.

Authorization must be enforced on the server.

Possible roles include:

```text
SUPER_ADMIN
ADMIN
EDITOR
RECEPTION
```

Do not assume a user is authorized because they can access an admin page.

Every sensitive Server Action and API endpoint must verify:

1. Authentication
2. Authorization
3. Input validity

Permissions should be based on business requirements rather than arbitrary frontend checks.

---

# 20. Validation

Use Zod for validation where appropriate.

All external input must be validated:

* Forms
* API requests
* Server Actions
* Webhooks
* Query parameters where appropriate

Never trust client-side validation alone.

Reuse validation schemas instead of duplicating validation logic.

Validation errors should be presented clearly to users without exposing internal implementation details.

---

# 21. Security

Never expose secrets to the client.

Use environment variables for:

```text
DATABASE_URL
AUTH_SECRET
API_KEYS
ODOO_CREDENTIALS
WHATSAPP_CREDENTIALS
STORAGE_CREDENTIALS
```

Never commit real secrets.

Never put secrets inside:

```text
NEXT_PUBLIC_*
```

Do not expose private server environment variables to Client Components.

Validate and sanitize user-controlled data.

Protect sensitive endpoints with appropriate authentication and authorization.

Protect webhooks using signatures or authentication where supported.

Use rate limiting for sensitive/public endpoints where appropriate.

Never return raw database or internal server errors to users.

---

# 22. Environment Variables

Before adding a new environment variable:

1. Search the repository for existing configuration.
2. Follow existing naming conventions.
3. Determine whether the variable actually needs to exist.
4. Document required variables in `.env.example`.

Never put real credentials in `.env.example`.

Do not duplicate environment variables under different names without a clear reason.

---

# 23. Images and File Uploads

User-uploaded images should not be stored directly in PostgreSQL.

Use appropriate object storage/CDN when required, such as:

```text
Cloudinary
S3-compatible storage
Cloudflare R2
```

Do not add a storage provider until the project requirements justify one.

Images should support:

* Appropriate dimensions
* Optimized formats
* Alt text
* Reasonable file sizes
* Responsive delivery

Use `next/image`.

Do not load unnecessarily large images.

---

# 24. API and Server Actions

Do not create API endpoints unnecessarily.

Prefer Server Actions for internal mutations where appropriate.

Use Route Handlers when:

* An external client needs an API
* A webhook is required
* An integration requires HTTP
* A public API contract is required

Server Actions should:

1. Authenticate the user where required.
2. Authorize the operation.
3. Validate input.
4. Call the appropriate service.
5. Handle errors.
6. Revalidate affected content.

API responses should be consistent and predictable.

Never expose internal database errors directly to users.

---

# 25. External Integrations

External integrations must be isolated under:

```text
lib/integrations/
```

Example:

```text
lib/integrations/
├── odoo/
├── whatsapp/
└── notifications/
```

Do not tightly couple business logic to a specific provider.

Preferred architecture:

```text
Appointment Service
        ↓
Notification Service
        ↓
WhatsApp Provider
```

Avoid:

```text
Appointment Page
        ↓
Twilio API
```

External API failures must be handled gracefully.

Implement retries and idempotency where appropriate.

External providers should be replaceable without rewriting core business logic.

---

# 26. Webhooks

Webhook endpoints must be treated as untrusted external input.

Validate:

* Authentication/signature
* Request structure
* Required fields
* Event type

Implement idempotency where duplicate webhook delivery is possible.

Do not process the same business event multiple times unintentionally.

Log important webhook failures without exposing secrets or sensitive information.

---

# 27. Appointment Management

Appointments are business-critical data.

Use explicit domain statuses such as:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
NO_SHOW
```

Validate appointment date/time on the server.

Prevent duplicate bookings where possible.

Do not publicly cache sensitive appointment information.

Keep appointment business logic inside the appointment service layer.

---

# 28. TypeScript

Use strict TypeScript.

Avoid:

```typescript
any
```

unless there is a documented and unavoidable reason.

Prefer explicit and reusable types.

Do not duplicate types unnecessarily.

Keep shared types under:

```text
types/
```

Use inferred types from validation schemas where appropriate.

Do not use unsafe type assertions simply to silence TypeScript errors.

---

# 29. Components and UI Architecture

Build reusable components.

Reuse existing components whenever possible.

Do not create duplicate components that solve the same problem.

Keep components focused.

Avoid giant components containing:

* Data fetching
* Business logic
* Validation
* API calls
* Complex UI

all together.

Prefer composition.

Use:

```text
components/ui/
```

for generic reusable UI components.

Use:

```text
components/website/
```

for public website-specific components.

Use:

```text
components/admin/
```

for admin-specific components.

---

# 30. Design System Consistency

If an existing design system, theme, tokens, or component library exists, reuse it.

Do not introduce arbitrary:

* Colors
* Font sizes
* Border radii
* Shadows
* Spacings
* Breakpoints

when existing project conventions already exist.

Do not redesign existing UI unless explicitly requested.

Maintain visual consistency across the website and Admin Dashboard.

---

# 31. Responsive Design

The entire application must be responsive.

Use a mobile-first approach.

Every significant UI change should be considered for:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Do not solve responsiveness by hiding important content or functionality.

Avoid fixed widths that cause horizontal scrolling.

Ensure forms, tables, navigation and admin functionality remain usable on small screens.

---

# 32. Accessibility

Follow practical WCAG principles.

Use:

* Semantic HTML
* Proper heading hierarchy
* Accessible labels
* Keyboard navigation
* Visible focus states
* Appropriate ARIA attributes
* Alt text for meaningful images

Prefer semantic HTML before adding ARIA.

Do not use clickable `<div>` elements when a `<button>` or `<a>` is appropriate.

Ensure interactive components are keyboard accessible.

---

# 33. Performance

Performance is important, but do not optimize blindly.

Prefer:

* Server Components
* `next/image`
* `next/font`
* Appropriate caching
* Lazy loading for heavy components
* Minimal client-side JavaScript
* Efficient database queries

Do not use `useEffect` for data fetching when the operation can be performed on the server.

Avoid unnecessary client state.

Do not install libraries when native Next.js/React functionality is sufficient.

Do not introduce artificial delays such as `setTimeout()` to simulate loading in production.

---

# 34. Loading, Error and Empty States

Important asynchronous operations should have appropriate:

```text
Loading
Error
Empty
Success
```

states.

Use Next.js mechanisms such as:

```text
loading.tsx
error.tsx
not-found.tsx
```

where appropriate.

Forms should provide clear feedback after submission.

Do not leave blank screens during loading or failure states.

---

# 35. Search, Filtering and Pagination

Admin lists should support search/filtering when the dataset can grow.

Examples:

* Services
* Doctors
* Blog posts
* Appointments
* Users

Use server-side pagination for large datasets.

Do not load unnecessarily large datasets into the browser.

---

# 36. Audit Logging

Important administrative actions should be auditable when required.

Consider logging:

```text
User
Action
Entity
Entity ID
Timestamp
```

Examples:

```text
Updated Service
Published Blog Post
Deleted Doctor
Changed Appointment Status
```

Do not log passwords, API keys, tokens, or unnecessary sensitive information.

---

# 37. Testing

Use appropriate testing levels where the project supports them:

```text
Unit Tests
Integration Tests
E2E Tests
```

Prioritize testing for:

* Authentication
* Authorization
* Admin CRUD
* Publishing
* Appointment logic
* Language switching
* SEO-critical behavior
* Webhooks
* External integrations

Do not remove existing tests to make a task pass.

---

# 38. Dependencies

Before installing a new dependency:

1. Check `package.json`.
2. Search the existing codebase.
3. Check whether an existing dependency already solves the problem.
4. Check whether native Next.js/React functionality is sufficient.
5. Consider bundle size.
6. Consider maintenance and security.

Do not add a dependency for a trivial utility.

Do not upgrade major dependencies unless explicitly requested or necessary.

---

# 39. Git and File Safety

Make focused changes.

Do not modify unrelated files.

Do not remove existing functionality unless required.

Do not commit:

```text
.env
credentials
secrets
node_modules
build artifacts
```

Keep generated files that are intentionally maintained by the framework when required.

Use clear and focused commits when commits are requested.

---

# 40. Documentation

When introducing a significant architectural decision, document it appropriately.

Update documentation when adding:

* New integrations
* New environment variables
* New database architecture
* New authentication behavior
* New deployment requirements
* Important operational procedures

Do not create unnecessary documentation for trivial code changes.

---

# 41. Agent Decision-Making Rules

When multiple implementations are possible:

1. Prefer the existing project pattern.
2. Prefer the simplest solution.
3. Prefer server-side solutions when appropriate.
4. Prefer existing dependencies.
5. Prefer maintainability over cleverness.
6. Prefer incremental changes.
7. Avoid unnecessary abstraction.

Do not silently choose between materially different architectures.

For major architectural decisions, explain:

* What will change
* Why it is needed
* Which files are affected
* Trade-offs
* Any assumptions

---

# 42. Do Not Rewrite the Project

Never perform a broad rewrite merely because the existing code is not ideal.

Do not:

* Replace the entire architecture
* Migrate frameworks
* Replace libraries
* Rename large numbers of files
* Rebuild the design system
* Rewrite working features

unless explicitly requested or technically necessary.

When improving existing code, prefer small, isolated refactors.

---

# 43. Definition of Done

Before declaring a task complete:

1. Verify the implementation against the requested requirements.
2. Inspect the final diff.
3. Run TypeScript checks.
4. Run ESLint.
5. Run relevant tests.
6. Run the production build when appropriate.
7. Check responsive behavior.
8. Check Arabic and English behavior where applicable.
9. Check RTL/LTR behavior where applicable.
10. Check SEO behavior where applicable.
11. Check authentication and authorization for protected functionality.
12. Check cache invalidation for content mutations.
13. Check that no secrets are exposed.
14. Check that no unnecessary dependencies were added.
15. Report any known remaining issues.

Do not declare a feature complete if important known issues remain unreported.

---

# 44. Priority Order

When requirements conflict, use the following priority:

1. Security
2. Correctness
3. Data integrity
4. Existing project architecture
5. Accessibility
6. SEO
7. Performance
8. Maintainability
9. Developer convenience

Never sacrifice security or data integrity for performance or convenience.
