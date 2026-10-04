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
| `partnership.json` | `page` | Banner, why-partner list, form, CTA |
| `about.json` | `page` | Journey, mission/vision, 6 core values, team (3), certifications, CTA |
| `contact.json` | `page` | Banner, contact info, WhatsApp button, form |
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

## Other page templates (shop, partnership, about, contact, header, footer)
These were **not** changed by the homepage rebuild. They still use the older
Section/Column model with native widgets, and everything below this point
in this README describes them.

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
- **Forms** — all three forms (Partnership, Contact, footer Subscribe) are
  set to email `support@ajaliscogroup.com` on submit. That only actually
  sends if your host has outgoing mail (SMTP) configured — a common
  WordPress gotcha unrelated to Elementor. Consider an SMTP plugin if
  emails don't arrive.
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
- **Images on the other five page templates** (`about.json`, `shop.json`,
  etc.) used in native `image` widgets (journey photos, team photos, blog
  thumbnails, certificates) point at the live GitHub Pages site; Elementor's
  *Saved Templates* JSON import does not sideload external images into your
  Media Library on its own (only a full Kit import with bundled media does
  that), so these stay hotlinked to `joshuaetok.github.io/ajalisco-site`
  until you manually re-upload and swap them — which is fine indefinitely,
  since that's your own repo and isn't going anywhere.
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
  other five page templates** — every column width, font size and spacing
  value on those is the desktop one. Elementor's own default responsive
  behaviour (columns stack on mobile) will keep them usable, but won't
  match the live site's hand-tuned phone layout (e.g. the header's three
  columns will stack into a tall sticky bar rather than collapsing into a
  hamburger menu). Expect to spend time in Elementor's mobile/tablet
  preview modes tightening these up — it wasn't attempted for them.
  `home.json` doesn't have this problem — see its own section above.
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
