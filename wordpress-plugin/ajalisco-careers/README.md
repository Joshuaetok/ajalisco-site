# Ajalisco Careers

A small, self-contained WordPress plugin: manage job postings as a custom
post type, and show them on the front end as a modern card grid with a
role-detail + application modal. No other plugin is required.

## What it adds

- **Job Postings** — a custom post type in wp-admin (left-hand menu) with
  a "Job Details" box per post: Employment Type, Location, Short Summary,
  Responsibilities (one per line), and "What We're Looking For" (one per
  line). There is deliberately no salary field.
- **Job Postings → Settings** — two fields: **Careers Page** (a dropdown
  of every WordPress Page, so the plugin knows which one has the
  shortcode on it — purely a convenience link, explained below) and
  **Receiving Email**. Every application submitted on the front end is
  emailed to that address; leave it blank to fall back to the site's
  admin email.
- **`[ajalisco_jobs]` shortcode** — two distinct modes, and the shortcode
  picks between them based on one attribute. Drop it into any page; in
  Elementor Pro, add a **Shortcode** widget and paste the shortcode into it.
  - **Bare — `[ajalisco_jobs]` — use this on the actual Careers page.**
    Shows every published job in a plain responsive grid (3 columns, down
    to 2 then 1 as the screen narrows). No cap, no slider, no "View All" —
    you're already looking at the full list.
  - **With `view_all_url` — use this anywhere else, e.g. a homepage
    teaser section:** `[ajalisco_jobs view_all_url="/careers/"]`. Shows at
    most 4 jobs in a horizontally-slidable row (swipe, trackpad-scroll, or
    the prev/next arrows), followed by a "View All Roles" tile that links
    to the URL you gave it.

## Installing

1. Zip the `ajalisco-careers` folder (or upload it as-is via FTP into
   `wp-content/plugins/`).
2. In wp-admin: **Plugins → Add New → Upload Plugin**, then **Activate**.
   Activating seeds five starter roles (Franchise Partner, Baker, Bakery
   Assistant, Mixer Operator, Loader) matching the GitHub Pages preview —
   edit or delete them freely afterwards; this only happens once.
3. Add the `[ajalisco_jobs]` shortcode to your Careers page (if you're
   importing `elementor/careers.json`, it's already there as a native
   Shortcode widget — you just need the page itself to exist first).
4. Go to **Job Postings → Settings**, pick that page under **Careers
   Page**, and set the **Receiving Email**.

## Is a job's visibility actually linked to the Careers page?

Yes, automatically, with nothing extra to configure: the shortcode never
stores or caches a copy of the job list — every time the page is viewed,
it runs a fresh query for published Job Postings. Delete a job (or set it
to Draft) in **Job Postings**, and it disappears from every page showing
`[ajalisco_jobs]` immediately, with no separate "remove from the careers
page" step. The **Careers Page** setting doesn't change this behaviour —
it's just a pointer so wp-admin can show you a "View your Careers page"
link; the shortcode itself works the same with or without it set, and
would still work correctly even if you added it to more than one page.

## How an application reaches you

The front end submits the form by AJAX to `wp-admin/admin-ajax.php`. The
plugin validates the submission (name, a real email address, phone — all
required; a message and a résumé/CV are optional), and calls `wp_mail()`
to send it to the Receiving Email, with the résumé (PDF or Word, up to
5MB) attached if one was provided. **Nothing is stored in the database** —
there's no applicant list inside wp-admin, and any uploaded résumé is
deleted from the server immediately after the email is sent. If you later
want a stored/searchable log of applications inside wp-admin, that's a
separate, deliberate addition — ask for it rather than assuming it's here.

## Security notes

- The AJAX handler checks a nonce, sanitizes every field, and validates
  the email format server-side (the honeypot field and 5MB size check in
  the front-end JS are conveniences, not the real enforcement — the PHP
  side re-checks file size and restricts uploads to PDF/DOC/DOCX via
  WordPress's own `wp_handle_upload`, which sniffs the real file type).
- The Settings page is gated behind `manage_options` and uses WordPress's
  Settings API (which supplies its own nonce).
- `wp_mail()` depends on your host/SMTP setup actually being able to send
  mail — if applications aren't arriving, that's the first thing to test
  (a plugin like WP Mail SMTP can help if your host's default mail is
  unreliable, which is common).

## Styling

`assets/careers.css` is fully self-contained (its own CSS variables,
scoped under `.ajx-careers`) so it doesn't depend on, or leak into, your
active theme. It mirrors the same visual language as the GitHub Pages
preview and the `elementor/` export (Outfit for headings, Nunito for
body text) — if your WordPress theme doesn't already load those fonts,
add `@font-face` rules or swap in your own font names at the top of that
file.
