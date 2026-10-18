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
| `careers.json` | `page` | Banner, Open Roles (a single Shortcode widget, `[ajalisco_jobs]`), CTA — almost entirely native widgets; **requires the Ajalisco Careers plugin active first, read the `careers.json` section below before importing** |
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
The Partnership Hub page, **rebuilt from scratch on native Elementor
widgets** (Heading, Text Editor, Divider, Icon List, Form, Button)
instead of the HTML-widget-heavy approach used the first time around —
see "Two bugs fixed here" below for why. Four root containers: **Banner**
("Partnership Hub" heading), **Why partner + form** (a two-column
container — copy on the left using `flex_grow: 105`, the form card on
the right using `flex_grow: 95`, approximating the live site's
`1.05fr .95fr` grid ratio, stacking to one column at Elementor's tablet
breakpoint), and **CTA** (the shared banner, single-button variant —
this page's live CTA only shows "Explore Our Products", confirmed by
reading `index.html` directly rather than assumed).

The "Why partner" column uses a native **Icon List** widget for the four
ticks (Reliable Supply Chain, Attractive Margins, Marketing Support, Bulk
Order Access), and the three numbered "how it works" steps are each a
small native Heading widget (title "1"/"2"/"3") styled as a circle purely
through that widget's own Advanced-tab Background/Border-Radius/Width/
Padding controls — no custom CSS at all. The form card uses Elementor
Pro's native **Form** widget for every field (Full Name, Email, Phone
Number, Business Name, Location, Message, and an "I agree…" Acceptance
field) — editable labels, placeholders and required-flags, unlike the
previous hand-built HTML `<form>`.

The live site's actual form behaviour (confirmed by reading `app.js`'s
`partnership` handler directly) is opening WhatsApp with a pre-filled
message, not emailing anyone. Elementor's native Form widget has no
built-in action that builds a `wa.me` link from field values, so that one
piece of behaviour is a deliberate, isolated JS exception: a small script
in the "keep" HTML widget listens for Elementor Pro's own documented
`submit_success` event on this specific form and opens WhatsApp with the
exact same message format `app.js` uses. It only reads field values and
sets no styling — see `partnership-styles.css`'s header comment for the
full list of exceptions.

### Two bugs fixed here that applied to the whole export
The previous version of this page (like `home.json`/`about.json`/
`contact.json`) had two real bugs, found while rebuilding `careers.json`
and fixed here too — full writeup in `careers.json`'s README section
above:

1. **Native typography settings were silently overridden** by a
   `.ajx-title`-style CSS class whose `:not(#ajx-n)` selector embeds an ID
   and so always outranks Elementor's own generated rules — meaning the
   JSON looked native but fonts rendered from the override, not the
   widget's own Typography panel, and editing that panel did nothing
   visible. This rebuild's "keep" stylesheet contains zero `font-size`/
   `font-family`/`font-weight`/`color` rules for any heading, text,
   button or form element.
2. **`boxed_width` was set to 1148 instead of 1220**, double-subtracting
   the live site's own 36px gutter padding and rendering content about
   70px narrower than the live site at desktop widths. This rebuild uses
   `boxed_width: 1220` on every content container, matching `.wrap`.

### How it was checked
There's no real WordPress/Elementor install available to import into, so
this had to be verified two ways, and it's important to be honest about
the difference between them: (1) **structurally** — the JSON is
well-formed; a widget-type census shows real content living entirely in
native widgets (old: `{container:7, html:7}` with all page content inside
those 7 `html` widgets; new: `{container:11, html:5, heading:10,
text-editor:7, icon-list:1, form:1, button:1, divider:1}` with the 5
remaining `html` widgets carrying zero visible text — font-loading and
decorative backgrounds only); a grep confirms zero CSS rules touching
typography properties outside `@font-face` blocks. (2) **a values sanity
check** — a script read the JSON's own typography/color/background/field
settings directly and rendered them as plain HTML to catch gross mistakes
(wrong colour, wrong copy, a badly-shaped field list), screenshotted at
1300px wide. That script is not a model of Elementor's real CSS output —
it cannot prove this looks pixel-right inside actual Elementor, only that
the values themselves are sane and the two-column layout, icon list,
numbered steps and form fields are all present and correctly ordered.

**One specific area of lower confidence, flagged honestly rather than
glossed over:** the native Form widget's exact settings key names (the
`field_typography_*`/`label_typography_*`/`button_typography_*` prefix
convention, and the shape of the "Acceptance" field type used for the "I
agree…" checkbox) were reconstructed from well-documented Elementor Pro
conventions, not verified against a real Elementor Pro install or any
working Form-widget example elsewhere in this repo (none exists). Field
labels, types, required-flags and order are simple content and should be
right regardless; the typography key *names* specifically carry more
uncertainty than every other widget on this page. If the field styling
doesn't pick up after import, that's the first place to check — the
field-level `css_classes` (`ajx-f-name`, `ajx-f-email`, etc., used by the
WhatsApp script to find values) should still work even if a typography
key name needs correcting.

### Requirements and editing
Needs **Elementor Pro** (for the native Form widget — the free version of
Elementor doesn't include it). Otherwise same as `home.json`'s
**Requirements** section (Elementor 3.6+ with Containers on, "Elementor
Full Width" page layout). No product data, picker, or filter tabs on this
page, so none of `home.json`'s script logic beyond the WhatsApp hook
above applies here.

## about.json — how it's built and what it needs

### What it is
The About page, **rebuilt from scratch on native Elementor widgets**
(Heading, Text Editor, Divider, Image, Icon Box, Button) instead of the
HTML-widget-heavy approach used the first time around — see "Two bugs
fixed here" below for why. Seven root containers, matching the live page
exactly: **Banner** ("About Us" heading), **Journey** (an even two-column
split — copy on the left, a round photo on the right, each using
`flex_grow: 100` so they split evenly like the live site's `.split`'s
`1fr 1fr` grid, stacking to one column at Elementor's tablet breakpoint),
**Mission & Vision** (2 native **Icon Box** widgets, gray background),
**Core Values** (centred heading + 6 cards — each a native Container with
its own left border set purely through that container's native
Advanced-tab Border controls, no custom CSS), **Team** (centred heading +
3 member cards, each a native **Image** widget plus Heading/Text-Editor
for name, role and bio), **Certifications** (centred heading + 2 cards,
each a native Image widget plus caption), and **CTA** (the shared single-
button variant, "Become a Distributor" → `/partnership/`, confirmed from
`index.html` rather than assumed).

### Two bugs fixed here that applied to the whole export
The previous version of this page (like `home.json`/`partnership.json`/
`contact.json`) had two real bugs, found while rebuilding `careers.json`
and fixed in `partnership.json` first — full writeup in those two
sections above:

1. **Native typography settings were silently overridden** by a
   `.ajx-title`-style CSS class whose `:not(#ajx-n)` selector embeds an ID
   and so always outranks Elementor's own generated rules. This rebuild's
   "keep" stylesheet contains zero `font-size`/`font-family`/
   `font-weight`/`color` rules for any heading, text, image caption or
   button.
2. **`boxed_width` was set to 1148 instead of 1220**, double-subtracting
   the live site's own 36px gutter padding. This rebuild uses
   `boxed_width: 1220` on all seven content containers, matching `.wrap`.

### A new, honestly-flagged limitation: object-position and aspect-ratio
Elementor's native **Image** widget has an Object Fit control (Cover/
Contain/Fill) but no **object-position** control — there's no native way
to choose *which part* of an image shows when it's cropped. The live
site deliberately crops the Journey photo and all three team photos off-
center (`object-position: 60% 50%` and `50% 20%` respectively, so faces
aren't cut off). Rather than accept a worse crop or invent a settings key
that might not exist, this rebuild handles `object-position` (and the
Journey photo's `aspect-ratio: 1`, for the same reason — its exact native
"Aspect Ratio" control key/shape could not be confirmed against a real
install) as four small, scoped CSS rules in the "keep" stylesheet, the
same honest-exception category as the Banner/CTA's second gradient layer.
Neither touches typography. Check after import whether your Elementor
version exposes a native Aspect Ratio control that could replace the
second one.

### How it was checked
Same two-part method as `careers.json`/`partnership.json`, and it's worth
repeating the distinction plainly: (1) **structurally** — the JSON is
well-formed; a widget-type census shows real content living entirely in
native widgets (old: `{container:14, html:13, heading:3}` with all page
content inside those 13 `html` widgets; new: `{container:29, html:5,
heading:23, text-editor:15, image:6, icon-box:2, button:1, divider:1}`
with the 5 remaining `html` widgets carrying zero visible text —
font-loading and decorative backgrounds only); a grep confirms zero CSS
rules touching typography properties outside `@font-face` blocks; a
`boxed_width` check confirms 1220 on all seven containers. (2) **a values
sanity check** — a script read the JSON's own settings directly and
rendered them as plain HTML to catch gross mistakes, screenshotted at
1300px wide (Banner, Journey, Mission & Vision, Team and Certifications/
CTA were all visually spot-checked this way; Core Values' card settings
were checked directly in the JSON instead of by screenshot, after the
local environment ran out of disk space mid-render — its border/width/
radius values were confirmed structurally correct). This script is not a
model of Elementor's real CSS output — it cannot prove this looks
pixel-right inside actual Elementor, only that the values themselves are
sane. Please check it for real after importing.

**Two specific areas of lower confidence, flagged honestly:** the native
**Icon Box** widget's exact settings key names (`view`/`shape`/
`primary_color`/`secondary_color` for the circular icon background, and
the `title_typography_*`/`description_typography_*` prefix convention)
were reconstructed from standard Elementor Pro convention, not verified
against a real install or working example elsewhere in this repo —
content (which icon, which text) should be correct regardless. Also, the
Mission/Vision icons are Font Awesome substitutes (`fa-bullseye`,
`fa-eye`) for the live site's custom inline SVGs — a deliberate,
documented substitution, not an oversight; swapping in a closer match or
uploading the original SVGs as a custom icon is a two-minute edit in
Elementor afterward if you want the exact original glyphs.

### Two more bugs found and fixed on re-verification
A later pass comparing this page's actual settings values against the
live site (not just screenshotting an approximation, but checking the
JSON's own flex/width fields directly) found two real responsive-layout
bugs the first build missed:

1. **Mission & Vision's two cards had no `flex_grow`.** The Journey
   section correctly uses `flex_grow: 100` on each column so they split
   evenly — Mission & Vision's two cards had neither `flex_grow` nor
   `width` set at all, so in a `flex_direction: row` container with no
   wrap, they'd have sized to their own content instead of splitting
   50/50 like the live site's `.mv` grid. Fixed by adding `flex_grow: 100`
   to both.
2. **Core Values' 6 cards and Team's 3 cards had `width` but no
   `width_tablet`/`width_mobile`.** Each card correctly sits at `31.5%`
   width for the 3-column desktop layout, but with no responsive
   override, that 31.5% would persist all the way down to mobile —
   three cramped ~100px columns instead of the live site's 3 → 2 → 1
   collapse (`.cvals`/`.team` in `styles.css`, breakpoints at 1100px/
   640px). Fixed by adding `width_tablet: 48.5%` and `width_mobile: 100%`
   to all 9 cards, using Elementor's own tablet/mobile breakpoint slots
   as the nearest native equivalent (same approximation already used for
   this export's typography breakpoints — Elementor's slots aren't
   guaranteed to sit at exactly 1100px/640px).

Both are now verified present in the JSON directly (not just visually).
Partnership's and Contact's two-column splits were checked too and don't
have this problem — both already set `flex_direction_tablet: "column"`
on the parent row, so they were correct from the first build.

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
Otherwise same as `home.json`'s **Requirements** and **Editing it**
sections above, with one difference: this page's "keep" widget has no
`<script>` tag at all, not even for scroll-reveal — unlike the still
HTML-widget-heavy `home.json`/`contact.json`, nothing on this native
rebuild depends on JS to appear correctly.

## contact.json — how it's built and what it needs

### What it is
The Contact page, **rebuilt from scratch on native Elementor widgets**
(Heading, Text Editor, Divider, Icon Box, Button, Form) instead of the
HTML-widget-heavy approach used the first time around — see "Two bugs
fixed here" below for why. Two root containers, matching the live page
exactly (no CTA banner, confirmed from `index.html` rather than assumed):
**Banner** ("Contact Us" heading) and **Contact info + form** — a
two-column row (`flex_grow: 90` / `flex_grow: 110`, approximating the
live site's `.9fr 1.1fr` `.two--contact` grid, stacking to one column at
Elementor's tablet breakpoint) containing an info card (native **Icon
Box** widgets for Address/Phone/Email/Office Hours, a native Text-Editor
widget for the "Open in Google Maps →" link, a native **Button** widget
for the WhatsApp CTA) and a form card using Elementor Pro's native
**Form** widget for every field (Full Name, Email, Phone Number, Business
Name, "Inquire About Our Products", Message, and an "I agree…" Acceptance
field) — editable labels, placeholders and required-flags, unlike the
previous hand-built HTML `<form>`.

The live site's actual form behaviour (confirmed by reading `app.js`'s
default/`contact` handler directly, not assumed) is opening WhatsApp with
a pre-filled message — **not** email. (An older note in this file once
claimed Contact emailed `support@ajaliscogroup.com`; that was wrong even
before this rebuild — only the footer Subscribe form emails — and no
longer applies now that the real behaviour is reproduced directly.)
Elementor's native Form widget has no built-in action that builds a
`wa.me` link from field values, so that one piece of behaviour is a
deliberate, isolated JS exception, built the same way `partnership.json`
already established: a small script in the "keep" HTML widget listens for
Elementor Pro's own documented `submit_success` event on this specific
form and opens WhatsApp with the exact same message format `app.js` uses
(including Contact's own field set — "Enquiry" instead of Partnership's
"Location"). It only reads field values and sets no styling — see
`contact-styles.css`'s header comment for the full list of exceptions.

### Two bugs fixed here that applied to the whole export
The previous version of this page (like the original `home.json`/
`partnership.json`/`about.json`) had two real bugs, found while rebuilding
`careers.json` and fixed in `partnership.json`/`about.json` first — full
writeup in those sections above:

1. **Native typography settings were silently overridden** by a
   `.ajx-title`-style CSS class whose `:not(#ajx-n)` selector embeds an ID
   and so always outranks Elementor's own generated rules — meaning the
   JSON looked native but fonts rendered from the override, not the
   widget's own Typography panel. This rebuild's "keep" stylesheet
   contains zero `font-size`/`font-family`/`font-weight`/`color` rules for
   any heading, text, icon-box, button or form element.
2. **`boxed_width` was set to 1148 instead of 1220**, double-subtracting
   the live site's own 36px gutter padding and rendering content about
   70px narrower than the live site at desktop widths. This rebuild uses
   `boxed_width: 1220` on both content containers, matching `.wrap`. (This
   settles the question the previous version of this section left open —
   the earlier text said real Elementor's boxed-width behaviour "wasn't
   possible to settle without a real Elementor install." Re-reading how
   Elementor's own `boxed_width` control works relative to `.wrap`'s own
   box model settles it: 1220 is correct, not 1148, with padding kept on
   top exactly as `.wrap` already does.)

### How it was checked
Same two-part method as `careers.json`/`partnership.json`/`about.json`,
and the same honesty about the limits of that method applies here: (1)
**structurally** — the JSON is well-formed; a widget-type census shows
real content living entirely in native widgets (old: `{container:6,
html:6}` with all page content inside those 6 `html` widgets; new:
`{container:5, html:3, heading:3, text-editor:3, divider:1, icon-box:4,
button:1, form:1}`, with the 3 remaining `html` widgets being the
font/script "keep" block plus 2 purely decorative elements carrying zero
visible text); a grep confirms zero CSS rules touching typography
properties outside `@font-face` blocks; a `boxed_width` check confirms
1220 on both content containers. (2) **a values sanity check** — a script
read the JSON's own settings directly (including every form field's
type/label/required-flag/css_classes, in order) and rendered them as
plain HTML to catch gross mistakes, screenshotted at 1300px wide. This
script is not a model of Elementor's real CSS output — it cannot prove
this looks pixel-right inside actual Elementor, only that the values
themselves are sane and complete. Please check it for real after
importing.

**One specific area of lower confidence, flagged honestly:** the native
Form widget's field-settings convention was matched directly against
`partnership.json`'s (same `field_typography_*`/`label_typography_*`/
`button_typography_*` prefix keys, same Acceptance-field shape) for
consistency between the two pages, but — same as noted there — this
convention itself was reconstructed from standard Elementor Pro
documentation, not verified against a real install or a working example
elsewhere in this repo. The Icon Box widget's exact settings key names
(`view`/`shape`/`primary_color`/`secondary_color`, `position: "left"` for
the icon-beside-text layout) carry the same category of uncertainty,
matched against `about.json`'s Icon Box usage for consistency. Content —
which fields, which icons, what order, what's required — should be
correct regardless; it's specifically the settings key *names* that carry
more risk than the structural content.

### Requirements and editing
Needs **Elementor Pro** (for the native Form widget — the free version of
Elementor doesn't include it), same as `partnership.json`. Otherwise same
as `home.json`'s **Requirements** section. No product data, picker,
filter tabs, or CTA on this page, so none of `home.json`'s script logic
beyond the WhatsApp hook above applies here.

## careers.json — how it's built and what it needs

### What it is
The Careers page. Unlike the other four pages, this one is built almost
entirely from **native Elementor widgets** — Heading, Text Editor,
Divider, Button, Shortcode — with no HTML widget carrying real content.
Three root containers: **Banner** ("Careers" heading), **Open Roles**
(a kicker, a heading, and a single native **Shortcode** widget containing
`[ajalisco_jobs]`), and **CTA** ("Become a Distributor"). The role cards,
the detail/apply modal, form validation, the optional résumé upload, and
emailing the application are all handled by the **Ajalisco Careers**
WordPress plugin (`wordpress-plugin/ajalisco-careers/` — see its own
README for installing and configuring the receiving email) through that
one shortcode. This page genuinely needs almost nothing hand-built in
Elementor beyond placing that widget.

The only non-native pieces, pasted into the "Ajalisco styles (keep)" HTML
widget (mirrored readably in `careers-styles.css`), are: `@font-face`
rules for Outfit/Nunito (loading only, never font-size/family/weight —
nothing here competes with a widget's own Typography controls), the
rising-bubbles decorative animation on the Banner/CTA, and a second
radial-gradient layer under the Banner/CTA's native gradient background
(Elementor's own background control only supports one gradient layer, so
the live site's two-layer effect is approximated, not reproduced exactly
— an honest limitation, not a bug).

### Two bugs fixed here that applied to the whole export
Building this page surfaced two real bugs shared by the original
`home.json`/`partnership.json`/`about.json`/`contact.json` work, fixed
here and corrected in the rebuilt `partnership.json`/`about.json`/
`contact.json` too:

1. **Native typography settings were silently overridden.** The earlier
   pages added an extra CSS class (e.g. `.ajx-title`) styled by a rule
   like `.ajx:not(#ajx-n) .ajx-title .elementor-heading-title { font-size:
   clamp(...) }`. The `:not(#ajx-n)` trick embeds an ID selector, which
   under CSS's specificity rules outranks anything Elementor itself
   generates for that widget — so even though the JSON carried correct
   `typography_font_size`/`_tablet`/`_mobile` values, they never actually
   took effect, and editing them in the Elementor panel would have done
   nothing visible. This page's "keep" stylesheet contains zero
   `font-size`/`font-family`/`color` rules for any heading or text
   element — typography is governed solely by each widget's own native
   controls, with nothing left to out-rank them.
2. **`boxed_width` was set to the wrong number.** The live site's `.wrap`
   is `width: min(1220px, 100%)` with `padding-inline: clamp(…, 36px)`
   applied *inside* that width (global `box-sizing: border-box`), giving
   1220 − 2×36 = 1148px of actual content. The earlier pages set
   Elementor's `boxed_width` to **1148** and *also* kept the 36px
   padding, double-subtracting the gutter and rendering about 70px
   narrower than the live site at desktop widths. This page (and the
   rebuilt partnership/about/contact) set `boxed_width: 1220` instead,
   matching `.wrap` itself, with padding applied on top exactly as the
   live site does.

### How it was checked
There's no real WordPress/Elementor install available in this environment
to import into, so this could only be verified two ways, and it's
important to be honest about the difference: (1) **structurally** — the
JSON is well-formed, a widget-type census confirms real content (headings,
text, the button, the shortcode) lives entirely in native widgets and the
only `html` widgets left contain zero visible text, and a grep confirms no
CSS rule anywhere in the "keep" stylesheet touches typography properties;
(2) **a values sanity check** — a small script read the JSON's own
`typography_*`/color/background fields directly and rendered them as
plain HTML to catch gross mistakes (wrong colour, wrong copy, a broken
shortcode tag), screenshotted at 1300px wide. That script is not a model
of Elementor's actual CSS output, so it cannot prove this will look
pixel-right inside real Elementor — only that the values themselves are
sane. Please check it for real after importing, the same way you'd check
any new import.

### Requirements and editing
Needs the **Ajalisco Careers** plugin installed and activated (see
`wordpress-plugin/ajalisco-careers/README.md`) with a receiving email set
under Job Postings → Settings — the shortcode renders nothing useful
without it. No product data, cart, or scroll-reveal JS is needed on this
page at all.

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
2. **Plugins → Add New → Upload Plugin** → upload
   `wordpress-plugin/ajalisco-careers.zip` and **Activate**. This seeds five
   starter job postings and must be active before you import `careers.json`
   — its "Open Roles" section is a single Shortcode widget
   (`[ajalisco_jobs]`) that renders nothing without this plugin. Set a
   receiving email under **Job Postings → Settings** while you're there.
3. **Templates → Saved Templates → Import Templates** → upload the `.json`
   files one at a time to be safe (Elementor's multi-file import exists in
   recent versions but behaviour has varied by version — if yours offers it
   and it works, use it; otherwise eight one-at-a-time imports is quick).
4. For `header.json` / `footer.json`: **Templates → Theme Builder** → import
   each as its template type, then set its display condition to
   **Entire Site**.
5. For the 6 page templates: create a WordPress Page for each, **using these
   exact slugs** (Permalink, not just the title) so every internal link in
   the export resolves: `home` → `shop` → `partnership` → `about` →
   `careers` → `contact` (note: **not** `contact-us` — every link in these
   files points to `/contact/`). Edit each page with Elementor → **Insert
   Template** → pick the matching imported template.
6. Set **Settings → Reading → Homepage** to your new Home page.
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
