# Ajalisco Careers

A small, self-contained WordPress plugin: manage job postings as a custom
post type, and show them on the front end as a modern card grid with a
role-detail + application modal. No other plugin is required.

## What it adds

- **Job Postings** — a custom post type in wp-admin (left-hand menu) with
  a "Job Details" box per post: Employment Type, Location, Short Summary,
  Responsibilities (one per line), and "What We're Looking For" (one per
  line). There is deliberately no salary field.
- **Job Postings → Settings** — one field, **Receiving Email**. Every
  application submitted on the front end is emailed here. Leave it blank
  to fall back to the site's admin email.
- **`[ajalisco_jobs]` shortcode** — renders the role grid and the
  detail/apply modal. Drop it into any page; in Elementor Pro, add a
  **Shortcode** widget and paste `[ajalisco_jobs]` into it.

## Installing

1. Zip the `ajalisco-careers` folder (or upload it as-is via FTP into
   `wp-content/plugins/`).
2. In wp-admin: **Plugins → Add New → Upload Plugin**, then **Activate**.
   Activating seeds five starter roles (Franchise Partner, Baker, Bakery
   Assistant, Mixer Operator, Loader) matching the GitHub Pages preview —
   edit or delete them freely afterwards; this only happens once.
3. Go to **Job Postings → Settings** and set the Receiving Email.
4. Add the `[ajalisco_jobs]` shortcode to your Careers page.

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
