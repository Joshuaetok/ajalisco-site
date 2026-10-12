# Ajalisco — Elementor Pro template export

Converts the GitHub Pages site into **Elementor Pro template JSON** you can import
and edit visually, plus the pieces that don't fit the template model.

This export has been through two passes: an initial build, then a full
independent review (listing structural bugs, wrong widget keys and a couple
of factual errors in this README) with every finding either fixed or — where
fixing it was out of scope for this pass — written up honestly below rather
than silently shipped. There is still no real WordPress/Elementor install to
test-import against, so some risk remains; see "If something fails to
import" at the end.

## What's in this folder
| File | Elementor template type | Covers |
|---|---|---|
| `header.json` | `header` | Logo, nav, cart icon, Order Now button |
| `footer.json` | `footer` | About blurb, quick links, contact info, subscribe form, bottom bar |
| `home.json` | `page` | The homepage — rebuilt on Elementor Containers to match the live site; **read the `home.json` section below before importing** |
| `shop.json` | `page` | Banner, breadcrumb, category links, product grid |
| `partnership.json` | `page` | Banner, why-partner list, form, CTA — rebuilt on Elementor Containers to match the live site, same as `home.json`; **read the `partnership.json` section below before importing** |
| `about.json` | `page` | Journey, mission/vision, 6 core values, team (3), certifications, CTA — rebuilt on Elementor Containers to match the live site, same as `home.json`/`partnership.json`; **read the `about.json` section below before importing** |
| `contact.json` | `page` | Banner, contact info, WhatsApp button, form — rebuilt on Elementor Containers to match the live site, same as `home.json`/`partnership.json`/`about.json`; **read the `contact.json` section below before importing** |
| `products-import.csv` | WooCommerce CSV | The 6 bread sizes + sachet water, real prices/descriptions/images |
| `preloader-snippet.html` | Custom Code snippet | The loading-screen animation (site-wide, not a page) — identical to the live site's loader |
| `assets/images/` | Real image files | Every image the homepage and preloader use (15 files), copied byte-for-byte from this repo's `/assets` |
| `assets/fonts/` | Real font files | Outfit + Nunito (the live site's self-hosted fonts) |

## home.json — how it's built and what it needs

### What it is
The homepage, rebuilt to look and behave the same as the GitHub Pages site at
every screen size. It uses Elementor **Containers** (flexbox) for structure —
no Sections/Columns anywhere — with one root container per homepage section
(hero, ticker tapes, bread advert, size picker, water advert, products,
purification, who-we-serve, journey, values, testimonials, blog, CTA).

Inside them, the content is the live site's own markup, styled by the live
site's own stylesheet (`styles.css`), carried over automatically rather than
re-typed by hand. That's what makes it match: same CSS, same breakpoints
(1100 / 960 / 640px), same `clamp()` fluid sizing, same animations.

### How it was checked
It was compared against the live site in a real browser (headless Chromium
with true phone/tablet emulation). The JSON was rendered the way Elementor
renders it: Elementor's container markup and CSS, including its default
paddings/gaps; standard WooCommerce `[products]` markup and its default
CSS; and Hello-theme base styles. Every section's position, width and
height was then measured against the live site at 360, 390, 641, 700, 768,
960, 1024, 1280 and 1440px wide — **all match to the pixel**. Side-by-side
screenshots at phone and desktop width match visually, the picker and the
filter tabs were click-tested, and it was checked that nothing stays
invisible inside the Elementor editor or if JavaScript fails. This is an
emulation of Elementor, not a real WordPress install, so do give it a look
after import — but it's measured, not guessed.

### The "Ajalisco styles & scripts (keep)" block
The **first** container on the page holds one HTML widget with the scoped
stylesheet, the fonts, and a small script. In the editor it shows as a thin
yellow "keep this block" label; on the live page it takes no space.
**Don't delete it, and keep it first** — without it the page loses its
design. Everything in it is scoped to the homepage's own containers (class
`ajx`), so it can't restyle your header, footer, theme or other pages.

The script does four things, all matching the live site:
- **Scroll reveal** — the fade-up as you scroll. It's disabled inside the
  Elementor editor, and if the script ever fails, everything simply shows
  without the animation (never stuck invisible).
- **Product filter tabs** (All / Bread / Premium Water) filter the product
  grid in place, like the live site.
- **Product cards** — WooCommerce's normal `[products]` cards are reshaped
  into the live design (tinted background, big ghost size number, size
  meter, label badge). Prices, links and **Add to cart** stay real
  WooCommerce.
- **Size picker** — the interactive "Find your loaf" picker works like the
  live one. Its **Add to cart** is the real WooCommerce button for that
  product, and "View details" opens the real product page — both taken from
  the product grid lower down the page, so they always point at your actual
  products and prices.

### Requirements
1. **Elementor 3.6 or newer, with Containers on.** Containers are the
   default from roughly 3.30; on 3.6–3.29, enable them under
   **Elementor → Settings → Features/Experiments → Container** *before*
   importing.
2. **Import `products-import.csv` first, and keep the product names**
   (Small Round, Round, Block, Long, Slice, Jumbo, A Bag of Table Water) and
   the category names (Jalix Bread, Premium Water). The picker and card
   styling match products by name. If you rename one, that product still
   shows and sells normally — it just loses the live-site card art, and the
   picker's button for it falls back to linking the Jalix Bread category.
3. **Page Layout → "Elementor Full Width"** (the JSON asks for this
   automatically; check it if your theme overrides it), so the sections
   can run edge to edge like the live site.
4. **Caching/optimisation plugins**: if a plugin "delays JavaScript until
   user interaction" (WP Rocket, LiteSpeed, etc.), the scroll animations
   start on the first scroll or tap instead of on load. Nothing breaks;
   exclude the page from JS delay if you want them on load.

### Editing it
- **Section titles** (the big blue centred headings) are native Elementor
  **Heading** widgets — edit the text in the panel. Their size follows
  the live site's fluid sizing from the styles block, so the panel's font
  size setting has no visible effect.
- **Everything else** (hero copy, advert text and prices, picker sizes,
  tiles, values, testimonials, blog cards, CTA) is in **HTML** widgets
  holding the live site's markup — click the widget and edit the text in
  its code box. Text sits between tags, e.g. `<h3>Block</h3>`.
- **Picker data** (names, prices, "Best for" text, pack image per size)
  lives in the script inside the styles block, as one list near the top,
  plus the starting view in the picker's own HTML widget. Change both if you
  change a size's wording.
- **Layout ratios and breakpoints** come from the styles block, not the
  Elementor panel, because that's the only way to reproduce the live site's
  exact 960px/640px breakpoints (Elementor's tablet breakpoint is 1024px).
  The panel's width/direction settings are filled in to match, as a
  fallback.

### Images and fonts
All 15 images and both fonts the homepage and preloader use are in
`assets/images/` and `assets/fonts/` in this folder, copied byte-for-byte
from this repo — your own originals. Elementor's template JSON format can't
carry image files inside it, only URLs, so `home.json` loads them from
`https://joshuaetok.github.io/ajalisco-site/assets/`. That's this repo's own
GitHub Pages site (fonts are served there with the cross-origin header
browsers need), so it works immediately after import with no extra steps.
To serve them from your own WordPress instead (optional):
1. **Media → Add New**: upload all of `assets/images/` in one go, so the
   files land together in one `/wp-content/uploads/<year>/<month>/` folder.
2. **Elementor → Tools → Replace URL**:
   old `https://joshuaetok.github.io/ajalisco-site/assets/`,
   new `https://yoursite.com/wp-content/uploads/<year>/<month>/`
   (the month you just uploaded into). One pass swaps every image.
3. That pass also rewrites the two font URLs, which live one folder deeper
   (`.../assets/fonts/`). Either upload the fonts too and run Replace URL
   once more, old `https://yoursite.com/wp-content/uploads/<year>/<month>/fonts/`,
   new `https://yoursite.com/wp-content/uploads/<year>/<month>/`, or, if
   WordPress refuses `.woff2` uploads, point them back at GitHub Pages:
   same old URL, new `https://joshuaetok.github.io/ajalisco-site/assets/fonts/`.

### Not reproduced (live-site behaviour that isn't part of the homepage)
The scroll-progress bar, back-to-top button, sticky header, cart drawer and
loader are site-wide features of the live site, not page content. The loader
is `preloader-snippet.html`; header and cart come from `header.json` +
WooCommerce. The live site's "skeleton shimmer" while products load isn't
needed — WooCommerce renders the products server-side.

## partnership.json — how it's built and what it needs

### What it is
The Partnership Hub page, rebuilt the same way as `home.json`: Elementor
**Containers** (flexbox), no Sections/Columns, with the live site's own
markup carried into HTML widgets and styled by a scoped copy of the live
site's own CSS (`partnership-styles.css` in this folder is that scoped
stylesheet, kept as a readable reference — the same content is embedded in
`partnership.json` itself inside the first "keep this block" container).
Three root containers: **Banner** ("Partnership Hub" heading), **Why
partner + form** (the two-column why-partner copy and the partnership
request form card, same 1.05fr/.95fr ratio as the live site's `.two` grid,
stacking to one column at 960px), and **Call to action** (the shared CTA
banner, single-button variant — this page's CTA only shows "Explore Our
Products", unlike the homepage's two-button version).

The form reproduces the live site's actual behaviour: it opens WhatsApp
with a pre-filled message on submit (same validation, same message format
as `app.js`'s `partnership` form handler) — **not** email. An earlier
version of this file assumed the Partnership/Contact/Subscribe forms all
emailed `support@ajaliscogroup.com`; checking against the live `app.js`
showed only the footer Subscribe form does that, so this rebuild corrects
the Partnership form to match what the live site actually does. (See the
"Manual follow-ups" note below, which now applies only to Contact and the
footer Subscribe form.)

### How it was checked
There's no real WordPress/Elementor install here either, so this is the
same emulation approach as `home.json`, with one difference: it was
checked with a real headless Chromium render (available in this
environment), not just a structural CSS trace. A plain-HTML reconstruction
using the exact scoped stylesheet and container/widget markup from this
JSON — with Elementor's own per-element CSS and the `.e-con-boxed` boxed-
width behaviour approximated as ordinary (non-inline) stylesheet rules, so
the same specificity rules decide the outcome — was screenshotted at 1440,
768 and 375px and compared side-by-side against the live site at the same
widths. Typography, colours, the two-column ratio and its 960px stacking,
button styles, form field styling, and the CTA's single-button variant all
matched. This caught one real bug before it shipped: the `.banner` rule
was initially missing its own `padding` declaration, which would have
rendered the banner with no vertical padding — now fixed and re-verified.
This is still not a real Elementor/WooCommerce render, so give it a look
after import, but it's closer to measured than `home.json`'s own
structural-only fallback would have been.

### Requirements and editing
Same as `home.json`'s **Requirements** and **Editing it** sections above
(Elementor 3.6+ with Containers on, "Elementor Full Width" page layout,
section titles would be native Heading widgets but this page has none of
the homepage's centred `.title`-style headings so everything here —
including "Partnership Hub", "Tell us about you and your business" and
"Reach Out Lets Discuss" — stays as HTML widgets holding the live markup).
No product data, picker, or filter tabs on this page, so none of
`home.json`'s script logic beyond scroll-reveal applies here.

## about.json — how it's built and what it needs

### What it is
The About page, rebuilt the same way as `home.json` and `partnership.json`:
Elementor **Containers** (flexbox), no Sections/Columns, with the live
site's own markup carried into HTML widgets and styled by a scoped copy of
the live site's own CSS (`about-styles.css` in this folder is that scoped
stylesheet, kept as a readable reference — the same content is embedded in
`about.json` itself inside the first "keep this block" container). Seven
root containers: **Banner** ("About Us" heading), **Journey** (two-column
copy + round photo, same even-split pattern as the live site's `.split`
grid, stacking to one column at 960px), **Mission & Vision** (2 cards,
gray background), **Core Values** (centred heading + 6 cards, 3 columns
down to 2 at 1100px and 1 at 640px), **Team** (centred heading + 3 member
cards, same column breakpoints as Core Values, gray background),
**Certifications** (centred heading + 2 cert cards), and **Call to
action** (the shared CTA banner, single-button variant — "Become a
Distributor" only, same as `partnership.json`'s CTA pattern but linking to
`/partnership/`). The three centred section headings (Core Values, Team,
Certifications) are native Elementor **Heading** widgets, same convention
as `home.json`'s "big blue centred headings"; the Journey section's
left-aligned sub-heading stays inside its HTML widget, matching how
`partnership.json` treated its own non-centred headings.

### How it was checked
Same emulation approach as `partnership.json`: a plain-HTML reconstruction
built from the exact container/widget markup and the scoped stylesheet in
this JSON — approximating Elementor's own per-element CSS (including each
container's `flex-direction`/`align-items` settings) and the `.e-con-boxed`
boxed-width behaviour as ordinary stylesheet rules, so real cascade and
specificity decide the outcome — was screenshotted with a real headless
Chromium render at 1440, 768 and 375px and compared side-by-side against
the live About page at the same widths. Typography, colours, the Journey
split and its 960px stacking, the Mission/Vision/Core Values/Team grids
and their 1100px/640px column drops, the certification cards, and the
CTA's single-button variant all matched. This round's reconstruction had
a bug in the *verification tooling itself* (the centred section headings
rendered sideways because the first draft of the plain-HTML reconstruction
didn't carry over each container's own flex-direction/align-items
settings) — once fixed, everything matched; no bug was found in
`about.json`'s own content this time. This is still not a real
Elementor/WooCommerce render, so give it a look after import.

### A pre-existing risk, not caused by this rebuild
The Journey photo (`kitchen.webp`) is loaded from
`https://joshuaetok.github.io/ajalisco-site/assets/kitchen.webp`, same as
every other image in this export. That URL is live and working right now,
but this repo's own working tree currently has `assets/kitchen.webp`
**deleted** (an uncommitted change, present before this rebuild started).
As long as that deletion stays unpushed, the live URL keeps serving the
file and nothing here breaks. If it ever does get committed and pushed,
the image will 404 both on the live site's own About page and in this
page's Journey section — worth resolving (restore the file, or point the
live site and this JSON at a replacement) before that deletion ships.

### Images added to this export
`team-ceo.webp`, `team-emily.webp`, `team-joshua.webp` and `cac.webp` have
been copied byte-for-byte into `assets/images/` alongside the homepage's
existing 15 images, for the same optional self-hosting workflow described
in `home.json`'s **Images and fonts** section above. `nafdac.png` was
already there. `kitchen.webp` could not be added for the reason above —
its source file no longer exists in this repo's working tree.

### Requirements and editing
Same as `home.json`'s **Requirements** and **Editing it** sections above.
No product data, picker, or filter tabs on this page either, so none of
`home.json`'s script logic beyond scroll-reveal applies here — and unlike
`partnership.json`, this page has no form, so its "keep this block" script
is scroll-reveal only.

## contact.json — how it's built and what it needs

### What it is
The Contact page, rebuilt the same way as `home.json`, `partnership.json`
and `about.json`: Elementor **Containers** (flexbox), no Sections/Columns,
with the live site's own markup carried into HTML widgets and styled by a
scoped copy of the live site's own CSS (`contact-styles.css` in this folder
is that scoped stylesheet, kept as a readable reference — the same content
is embedded in `contact.json` itself inside the first "keep this block"
container). Two root containers: **Banner** ("Contact Us" heading) and
**Contact info + form** (the contact info card and the message form, same
two-column pattern as the live site's `.two--contact` grid — `.9fr 1.1fr`,
info narrower, form wider — gap and 960px stack identical to the generic
`.two` grid). This page has no CTA banner, matching the live site.

The form reproduces the live site's actual behaviour: it opens WhatsApp
with a pre-filled message on submit (same validation, same message format
as `app.js`'s default/`contact` form handler) — **not** email. The
"Manual follow-ups" note below previously claimed Contact emailed
`support@ajaliscogroup.com`; checking `app.js` directly shows this is
wrong — only the footer Subscribe form emails. That note has been
corrected (see below).

### How it was checked
Same emulation approach as `partnership.json`/`about.json`: a plain-HTML
reconstruction built from the exact container/widget markup and the scoped
stylesheet in this JSON — approximating Elementor's own per-element CSS and
the `.e-con-boxed` boxed-width behaviour as ordinary stylesheet rules, so
real cascade and specificity decide the outcome — was screenshotted with a
real headless Chromium render at 1440, 768 and 375px and compared
side-by-side against the live Contact page at the same widths. Typography,
colours, the info/form column ratio and its 960px stack, the info card's
icons/rows, the WhatsApp button, and the form's field styling all matched.
No bug was found in this page's own content.

One thing to flag honestly rather than paper over: this page's boxed
content width (`boxed_width: 1148`, inherited unchanged from the same
convention `partnership.json`/`about.json` already use) is modelled in
this verification as the width *inside* the live site's `.wrap`'s own
`clamp()` padding — i.e. `1220px − 2×36px = 1148px`. If real Elementor
instead treats "boxed width" as the outer box (padding added on top, the
way `.wrap` itself works), the true equivalent would be `1220`, not
`1148`, and desktop content on this page — and equally on
`partnership.json`/`about.json`, since they share the exact same number —
would render about 70px narrower than the live site at wide viewports.
This wasn't possible to settle without a real Elementor install; it's a
shared, pre-existing modelling question across all three rebuilt pages,
not something new to this page, but worth checking for real after import.

### Requirements and editing
Same as `home.json`'s **Requirements** and **Editing it** sections above.
No product data, picker, filter tabs, or CTA on this page, so its "keep
this block" script handles only form submission and scroll-reveal.

## Other page templates (shop, header, footer)
These were **not** changed by the homepage rebuild, and `partnership.json`,
`about.json` and `contact.json` no longer belong to this group — see their
own sections above. The remaining three still use the older Section/Column
model with native widgets, and everything below this point in this README
describes them.

Brand colours and fonts (Outfit/Nunito, `#0256DB` blue, `#28A745` green,
`#1C244B` navy…) are hardcoded into every widget rather than relying on your
site's Global Kit, so the import looks right regardless of your site's
current settings.

### Animations (other pages)
- **Scroll-entrance** uses Elementor's own Advanced → Motion Effects →
  Entrance Animation on sections/columns, editable from the panel.
- **Hover lift** on buttons and images uses Elementor's Hover Animation
  control.
- **Decorative motion** is plain CSS `@keyframes` inside the relevant HTML
  widget.

## Import order
1. **WooCommerce → Products → Import** → upload `products-import.csv`.
   Creates the 7 products with real prices, descriptions and images already
   attached (pulled from the live GitHub Pages site, so no re-uploading).
   This creates the **Jalix Bread** and **Premium Water** categories too —
   the shop/home pages' product grids depend on these exact category names.
2. **Templates → Saved Templates → Import Templates** → upload the `.json`
   files one at a time to be safe (Elementor's multi-file import exists in
   recent versions but behaviour has varied by version — if yours offers it
   and it works, use it; otherwise seven one-at-a-time imports is quick).
3. For `header.json` / `footer.json`: **Templates → Theme Builder** → import
   each as its template type, then set its display condition to
   **Entire Site**.
4. For the 5 page templates: create a WordPress Page for each, **using these
   exact slugs** (Permalink, not just the title) so every internal link in
   the export resolves: `home` → `shop` → `partnership` → `about` →
   `contact` (note: **not** `contact-us` — every link in these files points
   to `/contact/`). Edit each page with Elementor → **Insert Template** →
   pick the matching imported template.
5. Set **Settings → Reading → Homepage** to your new Home page.
6. **Don't** assign your new Shop page as WooCommerce's official Shop page
   (WooCommerce → Settings → Products → Shop page) — once a page holds that
   role, WordPress serves WooCommerce's own product-archive template there
   instead of this page's Elementor content, so the banner/breadcrumb/filter
   design you just built would never show. Two ways to get a working result:
   - **Simple (what these files assume):** leave your new page as a normal
     page at `/shop/` and don't touch the WooCommerce Shop-page setting at
     all — the product grid on it comes from the `[products]` shortcode, not
     from being "the" shop page, so it works fine without that assignment.
     WooCommerce will auto-create its own separate page (commonly titled
     "Shop", usually landing at a different slug since `/shop/` is already
     taken) — you can leave that one unlinked and unused, or redirect it.
   - **Native route (more setup, closer to stock WooCommerce behaviour):**
     keep WooCommerce's own Shop page as-is and instead customise it via
     Elementor Pro's Theme Builder → **Products Archive** template, rebuilding
     the banner/filter header around the real archive loop. `shop.json` isn't
     built for this route.
7. Paste `preloader-snippet.html` into **Elementor Pro → Custom Code**
   (location: **Body Start** — this avoids a flash of the unstyled page
   before the loading screen paints over it; condition: Entire Site).

## Manual follow-ups (can't be set from JSON)
- **Header nav menu** — the Nav Menu widget needs an actual WordPress menu
  selected in its panel (menu IDs aren't portable between sites). Create a
  menu under Appearance → Menus with Shop/Partnership/About/Contact Us, then
  select it in the widget.
- **Header cart icon** — Elementor Pro's WooCommerce "Menu Cart" widget is
  included at its own defaults (deliberately not styled from this export —
  its style-control keys vary enough across versions that guessing them
  risked them being silently ignored). It should show a live item count out
  of the box once WooCommerce is active; style it from the panel afterwards
  to match the brand colours.
- **Forms** — only the footer Subscribe form is set to email
  `support@ajaliscogroup.com` on submit (that only actually sends if your
  host has outgoing mail/SMTP configured — a common WordPress gotcha
  unrelated to Elementor; consider an SMTP plugin if it doesn't arrive).
  The Partnership and Contact forms are different: both match the live
  site by opening WhatsApp with a pre-filled message instead (see the
  `partnership.json`/`contact.json` sections above) — nothing to configure
  for either of them. An earlier version of this note wrongly lumped
  Contact in with Subscribe as an email form; checking `app.js` directly
  showed that was wrong, so it's corrected here.
- **Store currency** — the CSV ships plain numeric prices (e.g. `300.00`).
  They'll display in whatever currency your WooCommerce store is set to.
  Set **WooCommerce → Settings → General → Currency** to Nigerian Naira
  before or right after importing the CSV so ₦300 doesn't show as $300.
- **Internal links** use plain slugs (`/shop/`, `/partnership/`, `/about/`,
  `/contact/`, `/product-category/jalix-bread/`,
  `/product-category/premium-water/`) baked directly into the JSON as plain
  text, not Elementor dynamic links. If your pages end up at different
  slugs, **Elementor → Tools → Replace URL** can bulk-fix them, but it only
  matches absolute URLs — since these are relative paths, the more reliable
  fix is matching the exact slugs in step 4 above in the first place.
- **Images on the remaining Section/Column page template** (`shop.json`)
  used in native `image` widgets (blog thumbnails, etc.) point at the live
  GitHub Pages site; Elementor's *Saved Templates* JSON import does not
  sideload external images into your Media Library on its own (only a
  full Kit import with bundled media does that), so these stay hotlinked
  to `joshuaetok.github.io/ajalisco-site` until you manually re-upload and
  swap them — which is fine indefinitely, since that's your own repo and
  isn't going anywhere. `home.json`, `partnership.json` and `about.json`
  all do the same hotlinking (see their own sections above), the only
  difference being they carry images as plain `<img>` tags inside HTML
  widgets rather than native `image` widgets. `contact.json` uses no
  images at all (icons are inline SVG), so this doesn't apply to it.
- **Hero heading / section titles are HTML, not plain Elementor headings**
  (other pages) — a few (the hero H1 with its underline swoosh, several section H2s) are
  `text-editor` widgets holding raw HTML/inline SVG rather than Elementor's
  Heading widget, because the Heading widget's title field doesn't reliably
  render embedded markup like the swoosh. Editing the *words* in these is
  fine; if you open one in Elementor's visual (non-HTML) text editor and
  save, double-check the swoosh/inline styling survived — TinyMCE can strip
  raw SVG on save. If it does, switch that widget's editor to "Text" (HTML)
  mode before editing, not "Visual."
- **No responsive (tablet/mobile) overrides on the header, footer or the
  remaining Section/Column page template** (shop, plus the header and
  footer) —
  every column width, font size and spacing value on those is the desktop
  one. Elementor's own default responsive behaviour (columns stack on
  mobile) will keep them usable, but won't match the live site's
  hand-tuned phone layout (e.g. the header's three columns
  will stack into a tall sticky bar rather than collapsing into a
  hamburger menu). Expect to spend time in Elementor's mobile/tablet
  preview modes tightening these up — it wasn't attempted for them.
  `home.json`, `partnership.json` and `about.json` don't have this
  problem — see their own sections above.
- **Product cards use WooCommerce's/your theme's default styling** — the
  live site's custom to-scale ghost-size-number product card design isn't
  recreated for the real `[products]` shortcode output (that would need a
  custom WooCommerce loop template, a larger undertaking than a page
  template). You'll get your theme's normal WooCommerce product grid on
  the Shop page. (The homepage's product grid *does* get the live card
  design — see the `home.json` section.)
## Known simplifications (things that were interactive JS and no longer are)
- The Shop page's **category filter tabs** (All/Bread/Water) are plain links
  to the real category archive pages, not JS-filtered in place. (On the
  homepage, the size picker and the filter tabs work like the live site.)
- The **custom cart drawer, "Add to cart" animation, and WhatsApp-order
  flow** are gone — WooCommerce's own cart/checkout does the job now (that
  was the point of rebuilding the storefront around WooCommerce earlier in
  this project).
- The **flavour shelf** was removed from the live site before this export
  (per your last request) and isn't included here either.

## If something fails to import
A wrong or version-mismatched `widgetType` string renders as a blank/"not
found" widget in that one spot — it won't break the rest of the page. The
riskiest widgets (version-wise) are `woocommerce-menu-cart` in the header,
and the Nav Menu widget; if either
shows blank or wrong, delete it and drag the equivalent in fresh from
Elementor's panel (Pro → WooCommerce / General categories) — the surrounding
content is unaffected. The `[woocommerce_breadcrumb]` and `[products ...]`
shortcodes on the Shop and Home pages are core WooCommerce, not
Elementor-version-dependent, so those are the least likely to need fixing.
`home.json` itself only uses three basic widget types (Container, HTML,
Heading) plus the Shortcode widget, all core Elementor, so it has no
Elementor Pro or version-specific widgets to go wrong.
