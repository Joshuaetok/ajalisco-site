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
| `home.json` | `page` | Hero, ticker tapes, bread/water adverts, size strip, product teaser, purification steps, "who it's for" tiles, journey, values, testimonials, blog, CTA |
| `shop.json` | `page` | Banner, breadcrumb, category links, product grid |
| `partnership.json` | `page` | Banner, why-partner list, form, CTA |
| `about.json` | `page` | Journey, mission/vision, 6 core values, team (3), certifications, CTA |
| `contact.json` | `page` | Banner, contact info, WhatsApp button, form |
| `products-import.csv` | WooCommerce CSV | The 6 bread sizes + sachet water, real prices/descriptions/images |
| `preloader-snippet.html` | Custom Code snippet | The loading-screen animation (site-wide, not a page) |

Every page uses **native Elementor widgets** for text, images, buttons, icon
boxes, icon lists, testimonials and forms — so headings, prices, descriptions
and images are directly editable in Elementor. Purely decorative pieces that
have no Elementor-native equivalent (the hero's floating rings/chips, the
crossing ticker tapes, the bread "ghost" watermark + price burst, the water
droplet glow) are small embedded HTML/CSS widgets — all pure CSS, no JS, so
they render identically everywhere, but you'd edit them in the HTML widget's
code box rather than Elementor's visual controls.

Brand colours and fonts (Outfit/Nunito, `#0256DB` blue, `#28A745` green,
`#1C244B` navy…) are hardcoded into every widget rather than relying on your
site's Global Kit, so the import looks right regardless of your site's
current settings.

## Animations
- **Scroll-entrance** (the fade-up-as-you-scroll effect) uses Elementor's own
  Advanced → Motion Effects → Entrance Animation on each section/column —
  visible and changeable from the panel. Card grids (values, team, blog
  posts, "who it's for" tiles, certifications) stagger in 100ms apart. The
  delay is written under both key spellings different Elementor versions use
  internally, so the stagger should hold regardless of which one yours reads.
- **Hover lift** on every button and content image uses Elementor's native
  per-widget Hover Animation control (`float` / `grow`) — editable from the
  Style tab. On icon boxes the same control only animates the icon itself,
  not the whole card (that's an Elementor limitation, not a setting I could
  fix); the icon box's own entrance animation still fires when the card
  scrolls into view.
- **Decorative motion** with no Elementor control for it — the hero's
  floating price chips, the pulsing "fresh" dot, the bread banner's slowly
  turning price badge, the water sachet's gentle bob, the two crossing
  ticker tapes, the rising bubbles — is plain CSS `@keyframes` inside the
  relevant HTML widget. You'd open that widget's code box to change it.
- Testimonials use Elementor Pro's native Testimonial Carousel (autoplay on)
  rather than the live site's sideways-scrolling marquee — the closest
  native equivalent, not a literal copy, but still a continuously-moving
  effect. Elementor Pro's exact repeater field names for this widget differ
  across versions; both schemas are written into the data so the real four
  testimonials should show up either way instead of Elementor's own
  placeholder content — if they don't, re-enter them once by hand in the
  panel (quick: four short quotes).
- **Not included** (present in the live site's CSS, no equivalent added
  here — cosmetic, nothing functional): the hero product image's idle bob,
  the three rings around it spinning (two are included but static), the
  "22+ yrs" badge's float, water/NAFDAC chip floats elsewhere on the page,
  the bread banner's tilt-on-hover, the purification steps' slide-right and
  green underline on hover, the arrow-nudge on "Read More" links, the
  scroll-progress bar, and the back-to-top button. None of these affect
  function — the content and layout are all there — they're small motion
  polish you'd add back by hand in Elementor if you want them.

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
- **Images** used in `image` widgets (journey photos, team photos, blog
  thumbnails, certificates, the logo) get sideloaded into your Media Library
  automatically by Elementor's own import — you don't need to re-upload
  those. Images that appear *inside* HTML/text-editor widgets (the hero
  illustration, the bread/water art, the chips and badges) are plain
  `<img>` tags pointing at the live GitHub Pages site and stay hotlinked
  there; swap those widget-by-widget with your own uploads whenever
  convenient — there's no rush, that site isn't going away.
- **Hero heading / section titles are HTML, not plain Elementor headings** —
  a few (the hero H1 with its underline swoosh, several section H2s) are
  `text-editor` widgets holding raw HTML/inline SVG rather than Elementor's
  Heading widget, because the Heading widget's title field doesn't reliably
  render embedded markup like the swoosh. Editing the *words* in these is
  fine; if you open one in Elementor's visual (non-HTML) text editor and
  save, double-check the swoosh/inline styling survived — TinyMCE can strip
  raw SVG on save. If it does, switch that widget's editor to "Text" (HTML)
  mode before editing, not "Visual."
- **No responsive (tablet/mobile) overrides are set anywhere** — every
  column width, font size and spacing value is the desktop one. Elementor's
  own default responsive behaviour (columns stack on mobile) will keep the
  site usable, but it won't match the live site's hand-tuned phone layout
  (e.g. the header's three columns will stack into a tall sticky bar rather
  than collapsing into a hamburger menu). Expect to spend time in Elementor's
  mobile/tablet preview modes tightening this up — it wasn't attempted here.
- **Product cards use WooCommerce's/your theme's default styling** — the
  live site's custom to-scale ghost-size-number product card design isn't
  recreated for the real `[products]` shortcode output (that would need a
  custom WooCommerce loop template, a larger undertaking than a page
  template). You'll get your theme's normal WooCommerce product grid.
- **Ticker tapes may need checking on narrow phone widths** — the two
  crossing tape banners rotate slightly outside their own section edges by
  design (matching the live site); the section doesn't explicitly clip
  overflow the way the live site's CSS does, so test at phone width after
  import and add `overflow: hidden` on that section if you see any
  horizontal scroll.

## Known simplifications (things that were interactive JS and no longer are)
- The homepage's **interactive one-size-at-a-time picker** is now a plain
  6-up strip of the real bread products (`[products category="jalix-bread"
  limit="6" columns="6"]`) — live WooCommerce data, just not a click-to-
  spotlight interaction.
- The **category filter tabs** (All/Bread/Water) are now plain links to the
  real category archive pages, not JS-filtered in place.
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
the Nav Menu widget, and `testimonial-carousel` on the home page; if any
shows blank or wrong, delete it and drag the equivalent in fresh from
Elementor's panel (Pro → WooCommerce / General categories) — the surrounding
content is unaffected. The `[woocommerce_breadcrumb]` and `[products ...]`
shortcodes on the Shop and Home pages are core WooCommerce, not
Elementor-version-dependent, so those are the least likely to need fixing.
