# SEO Guidelines

SEO is a first-class requirement.

Every public page must be designed with SEO in mind.

---

## Metadata

Every indexable page should have:

- Unique title
- Unique description
- Canonical URL
- Language alternates
- Open Graph metadata where appropriate

Do not use the same title and description across all pages.

---

## Localization

Arabic and English pages must use proper language alternates.

Examples:

/ar/services
/en/services

The Arabic page should reference its English equivalent and vice versa.

---

## Semantic HTML

Prefer semantic HTML:

<header>
<nav>
<main>
<section>
<article>
<footer>

Use headings in logical order.

Do not use headings only for visual styling.

Each page should normally have one primary H1.

---

## Images

All meaningful images must have descriptive alt text.

Decorative images should use empty alt text.

Do not stuff keywords into alt attributes.

---

## URLs

URLs should be:

- Short
- Descriptive
- Stable
- SEO friendly

Avoid unnecessary query parameters for indexable content.

---

## Dynamic Content

Services, doctors and blog posts should generate their own metadata dynamically.

Example:

/ar/services/[slug]

should have metadata based on the actual service.

---

## Structured Data

Where appropriate, use Schema.org structured data.

Potential schemas include:

- Dentist
- MedicalBusiness
- Service
- Article
- FAQPage
- BreadcrumbList

Never fabricate medical claims, reviews, ratings,
statistics or credentials.

---

## Sitemap

All important public indexable pages should eventually appear in:

/sitemap.xml

Admin pages must not be included.

---

## Robots

/admin must not be indexed.

---

## Performance

SEO implementation must not unnecessarily hurt:

- LCP
- CLS
- INP

Prefer optimized Next.js images and fonts.

Avoid unnecessary client components.