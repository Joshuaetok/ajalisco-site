(() => {
  const WHATSAPP = "2347078581881";

  // All loaves share one scale (SVG units) so cards compare honestly.
  const BREAD = [
    { id: "small-round", name: "Small Round", price: 250, badge: "Quick bite", shape: "round", w: 92, h: 60,
      desc: "A soft little loaf, perfect for school bags and a quick breakfast." },
    { id: "round", name: "Round", price: 300, badge: "Everyday", shape: "round", w: 124, h: 76,
      desc: "Our classic round loaf with a golden top. Lovely with tea." },
    { id: "block", name: "Block", price: 450, badge: "Popular", shape: "block", w: 132, h: 94,
      desc: "A compact tin loaf that slices clean for toast and sandwiches." },
    { id: "long", name: "Long", price: 650, badge: "Family", shape: "long", w: 228, h: 88,
      desc: "A generous long loaf made for sharing at home." },
    { id: "slice", name: "Slice", price: 850, badge: "Pre-sliced", shape: "slice", w: 196, h: 98,
      desc: "Evenly pre-sliced and ready for sandwiches and lunch boxes." },
    { id: "jumbo", name: "Jumbo", price: 1700, badge: "Best value", shape: "block", w: 268, h: 128,
      desc: "Our biggest loaf, for big families, caterers and parties." },
  ];
  const WATER = { id: "water", name: "Bag of Sachet Water", price: 300, badge: "NAFDAC approved",
    desc: "Multi-stage purified, hygienically sealed sachets. Cool, clean and refreshing." };
  const CATALOG = Object.fromEntries([...BREAD, WATER].map((p) => [p.id, p]));
  const naira = (n) => "₦" + n.toLocaleString("en-NG");

  // ---------- Loaf illustration ----------
  function loafSVG(p) {
    const G = 176, cx = p.shape === "slice" ? 132 : 160;
    const { w, h, id } = p;
    const l = cx - w / 2, r = cx + w / 2, top = G - h;
    let body, extra = "";

    if (p.shape === "round") {
      body = `M${l + 2} ${G} C${l - 6} ${top + h * 0.35} ${l + w * 0.12} ${top} ${cx} ${top} C${r - w * 0.12} ${top} ${r + 6} ${top + h * 0.35} ${r - 2} ${G} Z`;
      // scored cross-hatch & flour
      extra = [-0.22, 0, 0.22].map((t) => {
        const x = cx + w * t;
        return `<path d="M${x - w * 0.09} ${top + h * 0.5} Q${x} ${top + h * 0.12} ${x + w * 0.09} ${top + h * 0.34}" stroke="#F7D9A6" stroke-width="${w * 0.03}" fill="none" stroke-linecap="round" opacity=".9"/>`;
      }).join("") + Array.from({ length: 16 }, (_, i) => {
        const a = (i * 137.5) % 360, rr = (i % 5) / 5;
        return `<circle cx="${cx + Math.cos(a) * w * 0.28 * rr}" cy="${top + h * 0.22 + Math.sin(a) * h * 0.12 * rr}" r="${0.9 + (i % 3) * 0.4}" fill="#fff" opacity=".55"/>`;
      }).join("");
    } else {
      const sh = top + h * 0.46;
      body = `M${l + 5} ${G} L${l + 1} ${sh} C${l - 5} ${top + h * 0.04} ${l + w * 0.1} ${top} ${cx} ${top} C${r - w * 0.1} ${top} ${r + 5} ${top + h * 0.04} ${r - 1} ${sh} L${r - 5} ${G} Z`;
      extra = `<path d="M${l + 2} ${sh} Q${cx} ${sh + 8} ${r - 2} ${sh}" stroke="#FFE4B8" stroke-opacity=".7" stroke-width="3.5" fill="none"/>`;
      if (p.shape === "long") {
        extra += [-0.3, -0.1, 0.1, 0.3].map((t) => {
          const x = cx + w * t;
          return `<path d="M${x - 16} ${top + h * 0.3} Q${x} ${top + 2} ${x + 18} ${top + h * 0.16}" stroke="#F7D9A6" stroke-width="5" fill="none" stroke-linecap="round"/>`;
        }).join("");
      }
      if (p.shape === "slice") {
        for (let i = 1; i < 9; i++) {
          const x = l + (w / 9) * i;
          extra += `<path d="M${x} ${top + 5} L${x - 1} ${G - 2}" stroke="#5B2A0B" stroke-opacity=".35" stroke-width="2"/>`;
        }
        // two fanned slices showing crumb
        const sx = r + 6;
        const slice = (dx, rot) => `<g transform="rotate(${rot} ${sx + dx + 18} ${G})">
            <path d="M${sx + dx} ${G} L${sx + dx} ${top + 34} C${sx + dx - 4} ${top + 6} ${sx + dx + 40} ${top + 6} ${sx + dx + 36} ${top + 34} L${sx + dx + 36} ${G} Z" fill="#F3DDB0" stroke="#B8651E" stroke-width="5"/>
            ${[[10, 58], [22, 80], [14, 104], [26, 124], [12, 142]].map(([ox, oy]) => `<ellipse cx="${sx + dx + ox}" cy="${top + oy * (h / 140) + 10}" rx="2.4" ry="1.6" fill="#DDBF8C"/>`).join("")}
          </g>`;
        extra += slice(4, 8) + slice(20, 18);
      }
    }

    return `<svg class="loaf-svg" viewBox="0 0 320 200" role="img" aria-label="${p.name} loaf, shown to scale">
      <defs>
        <linearGradient id="c-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F0B566"/><stop offset=".5" stop-color="#C8732A"/><stop offset="1" stop-color="#8A4516"/>
        </linearGradient>
        <radialGradient id="s-${id}" cx=".38" cy=".18" r=".55">
          <stop offset="0" stop-color="#FFF3D6" stop-opacity=".85"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/>
        </radialGradient>
        <filter id="t-${id}" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="${id.length}" result="n"/>
          <feDiffuseLighting in="n" lighting-color="#fff" surfaceScale="1.4" result="lit"><feDistantLight azimuth="225" elevation="58"/></feDiffuseLighting>
          <feComposite in="lit" in2="SourceAlpha" operator="in" result="tex"/>
          <feBlend in="SourceGraphic" in2="tex" mode="multiply"/>
        </filter>
      </defs>
      <ellipse cx="${cx + (p.shape === "slice" ? 14 : 0)}" cy="${G + 4}" rx="${Math.min(150, w * 0.56 + (p.shape === "slice" ? 26 : 0))}" ry="8" fill="#2A1204" opacity=".35"/>
      <g filter="url(#t-${id})"><path d="${body}" fill="url(#c-${id})"/></g>
      <path d="${body}" fill="url(#s-${id})"/>
      ${extra}
    </svg>`;
  }

  const meter = (idx) => `<div class="meter" aria-label="Size ${idx + 1} of 6">
      ${BREAD.map((_, i) => `<i class="${i <= idx ? "on" : ""}" style="height:${8 + i * 2.8}px"></i>`).join("")}
      <span>Size ${idx + 1}/6</span>
    </div>`;

  // ---------- Cart ----------
  const KEY = "ajalisco-cart-v2";
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };

  const control = (id) => {
    const q = cart[id] || 0, n = CATALOG[id].name;
    if (!q) return `<button class="add" type="button" data-add="${id}" aria-label="Add ${n} to cart">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/></svg>
        Add to Cart</button>`;
    return `<div class="qty" role="group" aria-label="${n} quantity">
        <button type="button" data-dec="${id}" aria-label="Remove one ${n}">−</button>
        <output aria-live="polite">${q} in cart</output>
        <button type="button" data-inc="${id}" aria-label="Add one ${n}">+</button>
      </div>`;
  };

  // ---------- Product cards ----------
  const grid = document.querySelector("[data-products]");
  const breadCard = (p, i) => `
    <article class="card reveal" style="--i:${i}" data-cat="bread" data-card="${p.id}">
      <div class="card__media card__media--bread">
        <span class="card__badge">${p.badge}</span>
        ${loafSVG(p)}
      </div>
      <div class="card__body">
        <p class="card__cat">Jalix Bread</p>
        <div class="card__row"><h3>${p.name}</h3><p class="card__price">${naira(p.price)}</p></div>
        <p class="card__desc">${p.desc}</p>
        ${meter(i)}
        <div class="card__ctrl" data-ctrl="${p.id}"></div>
      </div>
    </article>`;
  const waterCard = `
    <article class="card card--water reveal" style="--i:6" data-cat="water" data-card="water">
      <div class="card__media card__media--water">
        <span class="card__badge card__badge--blue">${WATER.badge}</span>
        <div class="card__sachet"><img src="assets/sachet.webp" alt="Ajalisco table water sachet" loading="lazy"></div>
      </div>
      <div class="card__body">
        <p class="card__cat card__cat--blue">Ajalisco Water</p>
        <div class="card__row"><h3>${WATER.name}</h3><p class="card__price card__price--blue">${naira(WATER.price)}</p></div>
        <p class="card__desc">${WATER.desc}</p>
        <div class="card__ctrl" data-ctrl="water"></div>
      </div>
    </article>`;
  grid.innerHTML = BREAD.map(breadCard).join("") + waterCard;

  // Filter tabs
  const tabs = document.querySelectorAll("[data-filter]");
  const applyFilter = (f) => {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.filter === f)));
    grid.querySelectorAll("[data-cat]").forEach((c) => (c.hidden = f !== "all" && c.dataset.cat !== f));
    grid.dataset.filter = f;
  };
  tabs.forEach((t) => t.addEventListener("click", () => applyFilter(t.dataset.filter)));
  document.querySelectorAll("[data-jump]").forEach((a) => a.addEventListener("click", () => applyFilter(a.dataset.jump)));

  // ---------- Render ----------
  const sheet = document.querySelector("[data-sheet]");
  const items = document.querySelector("[data-sheet-items]");
  const bar = document.querySelector("[data-orderbar]");

  function render() {
    document.querySelectorAll("[data-ctrl]").forEach((el) => (el.innerHTML = control(el.dataset.ctrl)));
    document.querySelectorAll("[data-card]").forEach((c) => c.classList.toggle("is-in", !!cart[c.dataset.card]));
    const ids = Object.keys(cart).filter((id) => CATALOG[id]);
    const count = ids.reduce((s, id) => s + cart[id], 0);
    const total = ids.reduce((s, id) => s + cart[id] * CATALOG[id].price, 0);
    document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = count));
    document.querySelectorAll("[data-total]").forEach((el) => (el.textContent = naira(total)));
    document.querySelectorAll("[data-items-label]").forEach((el) => (el.textContent = count === 1 ? "item" : "items"));
    bar.hidden = !count;
    document.body.classList.toggle("has-cart", count > 0);

    items.innerHTML = ids.map((id) => `
      <li>
        <span class="sheet__thumb ${id === "water" ? "is-water" : ""}" aria-hidden="true">${id === "water" ? "💧" : "🍞"}</span>
        <span class="sheet__name">${CATALOG[id].name}<small>${naira(CATALOG[id].price)} each · <b>${naira(cart[id] * CATALOG[id].price)}</b></small></span>
        ${control(id)}
      </li>`).join("");
    const empty = count === 0;
    document.querySelector("[data-sheet-empty]").hidden = !empty;
    ["[data-sheet-total]", "[data-fields]", "[data-send]", ".sheet__fine"].forEach((s) => (document.querySelector(s).hidden = empty));
  }

  const setQty = (id, q) => {
    q = Math.max(0, Math.min(999, q | 0));
    if (q) cart[id] = q; else delete cart[id];
    save(); render();
  };

  const pulse = () => document.querySelectorAll(".cart-btn__count, .orderbar").forEach((el) => {
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-open-order],[data-close]");
    if (!t) return;
    const inSheet = !!t.closest("[data-sheet]");
    let focusSel = null;
    if (t.dataset.add) { setQty(t.dataset.add, 1); pulse(); focusSel = `[data-inc="${t.dataset.add}"]`; }
    else if (t.dataset.inc) { setQty(t.dataset.inc, (cart[t.dataset.inc] || 0) + 1); pulse(); focusSel = `[data-inc="${t.dataset.inc}"]`; }
    else if (t.dataset.dec) { const id = t.dataset.dec; setQty(id, (cart[id] || 0) - 1); focusSel = `[data-dec="${id}"],[data-add="${id}"]`; }
    else if ("openOrder" in t.dataset) sheet.showModal();
    else if ("close" in t.dataset) sheet.close();
    if (focusSel) {
      const scope = inSheet ? sheet : grid.parentElement;
      scope.querySelector(focusSel)?.focus({ preventScroll: true });
    }
  });
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

  document.querySelector("[data-order-form]").addEventListener("submit", (e) => {
    if (e.submitter?.value !== "send") return;
    e.preventDefault();
    const f = new FormData(e.target);
    const ids = Object.keys(cart).filter((id) => CATALOG[id]);
    const total = ids.reduce((s, id) => s + cart[id] * CATALOG[id].price, 0);
    const msg = [
      "Hello Ajalisco 👋 I'd like to place an order:", "",
      ...ids.map((id) => `• ${cart[id]} × ${CATALOG[id].name}${id === "water" ? "" : " bread"} — ${naira(cart[id] * CATALOG[id].price)}`),
      "", `Total: ${naira(total)}`, "",
      `Name: ${f.get("name")}`, `Phone: ${f.get("phone")}`,
      `Delivery: ${f.get("address") || "(to confirm)"}`,
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  // ---------- Nav ----------
  const nav = document.querySelector("[data-nav]");
  const menuBtn = document.querySelector("[data-menu-btn]");
  const setMenu = (open) => { nav.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", String(open)); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  document.querySelectorAll("[data-menu] a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  const onScroll = () => nav.classList.toggle("is-stuck", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Duplicate testimonials for a seamless marquee
  const track = document.querySelector("[data-track]");
  track.innerHTML += track.innerHTML.replace(/<figure class="t-card">/g, '<figure class="t-card" aria-hidden="true">');

  // ---------- Reveal ----------
  const els = document.querySelectorAll(".reveal");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    els.forEach((el) => io.observe(el));
  }

  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  render();
})();
