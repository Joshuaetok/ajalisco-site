(() => {
  const WHATSAPP = "2347078581881";

  // Bread sizes are drawn on one shared scale (w/h in SVG units).
  const PRODUCTS = [
    { id: "small-round", name: "Small Round", price: 250, tag: "Quick bite", shape: "round", w: 78, h: 50,
      desc: "A soft little loaf for school bags, quick breakfasts and one hungry person." },
    { id: "round", name: "Round", price: 300, tag: "Everyday", shape: "round", w: 106, h: 66,
      desc: "Our classic round loaf. Soft crumb and a golden top, lovely with tea." },
    { id: "block", name: "Block", price: 450, tag: "Toast & akara", shape: "tin", w: 118, h: 80,
      desc: "A compact tin loaf that slices clean for sandwiches, toast and akara." },
    { id: "long", name: "Long", price: 650, tag: "Share size", shape: "tin", w: 196, h: 82,
      desc: "A long loaf with generous portions for households and small gatherings." },
    { id: "slice", name: "Sliced", price: 850, tag: "Pre-sliced", shape: "sliced", w: 170, h: 90,
      desc: "Evenly pre-sliced and ready for sandwiches, toast and lunch boxes." },
    { id: "jumbo", name: "Jumbo", price: 1700, tag: "Biggest loaf", shape: "tin", w: 236, h: 118,
      desc: "Our biggest bread, made for big families, caterers and parties." },
  ];
  const WATER = { id: "water", name: "Bag of sachet water", price: 300 };
  const CATALOG = Object.fromEntries([...PRODUCTS, WATER].map((p) => [p.id, p]));

  const naira = (n) => "₦" + n.toLocaleString("en-NG");

  // ---------- Bread illustrations ----------
  function loafSVG(p) {
    const G = 150, cx = p.shape === "sliced" ? 118 : 130;
    const { w, h } = p;
    const l = cx - w / 2, r = cx + w / 2, top = G - h;
    const id = "g" + p.id;
    let body = "", extra = "";

    if (p.shape === "round") {
      body = `M${l} ${G} C${l - 3} ${top + h * 0.2} ${l + w * 0.16} ${top} ${cx} ${top} C${r - w * 0.16} ${top} ${r + 3} ${top + h * 0.2} ${r} ${G} Z`;
      extra = [0.34, 0.5, 0.66].map((t) => {
        const x = l + w * t;
        return `<path d="M${x - w * 0.07} ${top + h * 0.42} Q${x} ${top + h * 0.18} ${x + w * 0.07} ${top + h * 0.34}" stroke="#7A3A10" stroke-opacity=".35" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      }).join("");
    } else {
      const sh = top + h * 0.42;
      body = `M${l + 4} ${G} L${l} ${sh} C${l - 4} ${top + h * 0.06} ${l + w * 0.1} ${top} ${cx} ${top} C${r - w * 0.1} ${top} ${r + 4} ${top + h * 0.06} ${r} ${sh} L${r - 4} ${G} Z`;
      extra = `<path d="M${l + 1} ${sh} Q${cx} ${sh + 7} ${r - 1} ${sh}" stroke="#FFE2B0" stroke-opacity=".55" stroke-width="3" fill="none"/>`;
      if (p.shape === "sliced") {
        const n = 8;
        for (let i = 1; i < n; i++) {
          const x = l + (w / n) * i;
          extra += `<path d="M${x} ${top + 6} L${x} ${G - 2}" stroke="#6E3310" stroke-opacity=".32" stroke-width="2"/>`;
        }
        const sx = r + 8, sw = 22, stop = top + 10;
        extra += `<g transform="rotate(10 ${sx + sw / 2} ${G})">
          <path d="M${sx} ${G} L${sx} ${stop + 18} C${sx} ${stop} ${sx + sw} ${stop} ${sx + sw} ${stop + 18} L${sx + sw} ${G} Z" fill="#F6E1B6" stroke="#B4621F" stroke-width="4"/>
          <circle cx="${sx + 8}" cy="${stop + 40}" r="1.6" fill="#D9B98A"/><circle cx="${sx + 14}" cy="${stop + 58}" r="1.4" fill="#D9B98A"/><circle cx="${sx + 9}" cy="${stop + 72}" r="1.2" fill="#D9B98A"/>
        </g>`;
      }
    }

    return `<svg viewBox="0 0 260 168" role="img" aria-label="${p.name} loaf illustration, drawn to scale">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#EDB262"/><stop offset=".55" stop-color="#C9772E"/><stop offset="1" stop-color="#94501C"/>
        </linearGradient>
        <radialGradient id="${id}s" cx=".35" cy=".25" r=".5">
          <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="${p.shape === "sliced" ? 130 : cx}" cy="${G + 5}" rx="${w * 0.6 + (p.shape === "sliced" ? 16 : 0)}" ry="7" fill="#5A2E0E" opacity=".16"/>
      <path d="${body}" fill="url(#${id})"/>
      <path d="${body}" fill="url(#${id}s)"/>
      ${extra}
    </svg>`;
  }

  // ---------- Cart state ----------
  const KEY = "ajalisco-order-v1";
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };

  const setQty = (id, q) => {
    q = Math.max(0, Math.min(999, q | 0));
    if (q) cart[id] = q; else delete cart[id];
    save();
    render();
  };

  function stepperHTML(id) {
    const q = cart[id] || 0;
    const name = CATALOG[id].name;
    if (!q) return `<button class="add-btn" type="button" data-add="${id}" aria-label="Add ${name}">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>Add</button>`;
    return `<div class="stepper" role="group" aria-label="${name} quantity">
      <button type="button" data-dec="${id}" aria-label="Remove one ${name}">−</button>
      <output aria-live="polite">${q}</output>
      <button type="button" data-inc="${id}" aria-label="Add one ${name}">+</button>
    </div>`;
  }

  // ---------- Render ----------
  const grid = document.querySelector("[data-products]");
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="loaf reveal" style="--i:${i}" data-product-card="${p.id}">
      <div class="loaf__stage">
        <span class="loaf__tag">${p.tag}</span>
        ${loafSVG(p)}
      </div>
      <div class="loaf__body">
        <div class="loaf__row">
          <h3>${p.name}</h3>
          <p class="loaf__price">${naira(p.price)}</p>
        </div>
        <p class="loaf__desc">${p.desc}</p>
        <div class="stepper-slot" data-stepper="${p.id}"></div>
      </div>
    </article>`).join("");

  document.querySelectorAll('[data-price="water"]').forEach((el) => (el.innerHTML = `${naira(WATER.price)}<small>/bag</small>`));

  const sheet = document.querySelector("[data-sheet]");
  const sheetItems = document.querySelector("[data-sheet-items]");
  const orderbar = document.querySelector("[data-orderbar]");

  function render() {
    document.querySelectorAll("[data-stepper]").forEach((slot) => (slot.innerHTML = stepperHTML(slot.dataset.stepper)));
    document.querySelectorAll("[data-product-card]").forEach((c) => c.classList.toggle("is-in", !!cart[c.dataset.productCard]));

    const ids = Object.keys(cart).filter((id) => CATALOG[id]);
    const count = ids.reduce((s, id) => s + cart[id], 0);
    const total = ids.reduce((s, id) => s + cart[id] * CATALOG[id].price, 0);

    document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = count));
    document.querySelectorAll("[data-total]").forEach((el) => (el.textContent = naira(total)));
    document.querySelectorAll("[data-items-label]").forEach((el) => (el.textContent = count === 1 ? "item" : "items"));
    orderbar.hidden = count === 0;
    document.body.classList.toggle("has-order", count > 0);

    sheetItems.innerHTML = ids.map((id) => `
      <li>
        <span class="sheet__name">${CATALOG[id].name}<small>${naira(CATALOG[id].price)} each</small></span>
        <span class="stepper-slot">${stepperHTML(id)}</span>
        <b>${naira(cart[id] * CATALOG[id].price)}</b>
      </li>`).join("");
    document.querySelector("[data-sheet-empty]").hidden = count > 0;
    document.querySelector("[data-fields]").hidden = count === 0;
    document.querySelector("[data-send]").hidden = count === 0;
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-open-order]");
    if (!t) return;
    if (t.dataset.add) setQty(t.dataset.add, 1), bump();
    else if (t.dataset.inc) setQty(t.dataset.inc, (cart[t.dataset.inc] || 0) + 1), bump();
    else if (t.dataset.dec) setQty(t.dataset.dec, (cart[t.dataset.dec] || 0) - 1);
    else if ("openOrder" in t.dataset) sheet.showModal();
    // Re-rendering replaces the pressed button; keep keyboard focus in place.
    const sel = t.dataset.inc || t.dataset.add ? `[data-inc="${t.dataset.inc || t.dataset.add}"]` : t.dataset.dec ? `[data-dec="${t.dataset.dec}"],[data-add="${t.dataset.dec}"]` : null;
    if (sel) {
      const scope = t.closest("[data-sheet]") || document.querySelector(`[data-stepper="${t.dataset.inc || t.dataset.add || t.dataset.dec}"]`)?.parentElement || document;
      (scope.querySelector(sel) || document.querySelector(sel))?.focus({ preventScroll: true });
    }
  });

  function bump() {
    document.querySelectorAll(".badge, .orderbar").forEach((el) => {
      el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
    });
  }

  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

  document.querySelector("[data-order-form]").addEventListener("submit", (e) => {
    const submitter = e.submitter;
    if (!submitter || submitter.value !== "send") return;
    e.preventDefault();
    const f = new FormData(e.target);
    const ids = Object.keys(cart).filter((id) => CATALOG[id]);
    const total = ids.reduce((s, id) => s + cart[id] * CATALOG[id].price, 0);
    const lines = [
      "Hello Ajalisco 👋 I'd like to place an order:",
      "",
      ...ids.map((id) => `• ${cart[id]} × ${CATALOG[id].name} — ${naira(cart[id] * CATALOG[id].price)}`),
      "",
      `Total: ${naira(total)}`,
      "",
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      f.get("address") ? `Delivery: ${f.get("address")}` : "Delivery: (to confirm)",
    ];
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  // ---------- Reveal on scroll ----------
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  }

  // Header shadow once scrolled
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  render();
})();
