# Ajalisco — Elementor Pro template export

Converts the GitHub Pages site into **Elementor Pro template JSON** you can import
and edit visually, plus the pieces that don't fit the template model.

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
The original site's scroll-reveal and hover-lift motion is included, built
natively rather than copied in as custom code:
- **Scroll-entrance** (the fade-up-as-you-scroll effect) uses Elementor's own
  Advanced → Motion Effects → Entrance Animation on each section/column —
  visible and changeable from the panel (Off / a different effect / a
  different duration), not buried in code. Card grids (values, team,
  testimonials' siblings, blog posts, "who it's for" tiles, certifications)
  stagger in one after another (100ms apart) the same way the live site does.
- **Hover lift** on every button, content image and icon box uses Elementor's
  native per-widget Hover Animation control (`float` on buttons/icon boxes,
  `grow` on images) — again editable from the Style tab, not code.
- **Decorative motion** that has no Elementor control for it — the hero's
  floating price chips, the pulsing "fresh" dot, the bread banner's slowly
  turning price badge, the water sachet's gentle bob, the two crossing
  ticker tapes, the rising bubbles — is plain CSS `@keyframes` inside the
  relevant HTML widget, the same technique the live site uses, so it's
  identical motion, just not Elementor-panel-editable (you'd open that
  widget's code box to change it).
- The testimonials section uses Elementor Pro's native Testimonial Carousel
  (autoplay on) rather than the live site's sideways-scrolling marquee —
  a genuine carousel, not a literal copy of the marquee, but the closest
  native equivalent and still a continuously-moving, professional effect.

## Import order
1. **WooCommerce → Products → Import** → upload `products-import.csv`.
   Creates the 7 products with real prices, descriptions and images already
   attached (pulled from the live GitHub Pages site, so no re-uploading).
   This creates the **Jalix Bread** and **Premium Water** categories too —
   the shop/home pages' product grids depend on these exact category names.
2. **Templates → Saved Templates → Import Templates** → upload each `.json`
   one at a time (or select all 7 together, Elementor accepts multi-file
   import).
3. For `header.json` / `footer.json`: **Site Settings → Theme Builder** →
   assign each imported template with condition **Entire Site**.
4. For the 5 page templates: create a WordPress Page for each (Home, Shop,
   Partnership, About, Contact Us) → edit with Elementor → **Insert Template**
   → pick the matching imported template.
5. Set **Settings → Reading → Homepage** to your new Home page, and
   **WooCommerce → Settings → Products → Shop page** to your new Shop page.
6. Paste `preloader-snippet.html` into **Elementor Pro → Custom Code**
   (location: Body End, condition: Entire Site).

## Manual follow-ups (can't be set from JSON)
- **Header nav menu** — the Nav Menu widget needs an actual WordPress menu
  selected in its panel (menu IDs aren't portable between sites). Create a
  menu under Appearance → Menus with Shop/Partnership/About/Contact Us, then
  select it in the widget.
- **Header cart icon** — I used Elementor Pro's WooCommerce "Menu Cart"
  widget, which shows a live item count automatically once WooCommerce is
  active; no extra setup should be needed, but if it renders blank, re-drag
  it in from the panel (Elementor occasionally needs that after a JSON
  import for Pro/WooCommerce widgets).
- **Forms** — all four forms (Partnership, Contact, footer Subscribe) are set
  to email `support@ajaliscogroup.com` on submit. That only actually sends
  if your host has outgoing mail (SMTP) configured — a common WordPress
  gotcha unrelated to Elementor. Consider an SMTP plugin if emails don't
  arrive.
- **Internal links** use plain slugs (`/shop/`, `/partnership/`, `/about/`,
  `/contact/`, `/product-category/jalix-bread/`,
  `/product-category/premium-water/`). If your pages end up at different
  slugs, Elementor's **Site Settings → Navigator → Find & Replace** (or a
  find-replace plugin) can fix every link in one pass.
- **Images** are referenced by direct URL to the live GitHub Pages site
  (`https://joshuaetok.github.io/ajalisco-site/assets/...`), not uploaded to
  your Media Library. They'll display immediately; replace them widget-by-
  widget with your own uploads whenever convenient — there's no rush, the
  GitHub Pages copy isn't going away.

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
riskiest widgets (version-wise) are `woocommerce-menu-cart` in the header and
`testimonial-carousel` on the home page; if either shows blank, delete it and
drag the equivalent in fresh from Elementor's panel (Pro → WooCommerce /
General categories) — the surrounding content is unaffected.
