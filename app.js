(() => {
  const WHATSAPP = "2347078581881";
  const EMAIL = "support@ajaliscogroup.com";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Catalogue ----------
  const PRODUCTS = [
    { id: "small-round", cat: "bread", name: "Small Round", price: 250, badge: "Quick bite", h: 44,
      desc: "A soft little loaf that's perfect for a quick breakfast or a snack on the go." },
    { id: "round", cat: "bread", name: "Round", price: 300, badge: "Everyday", h: 54,
      desc: "Our classic round loaf. Soft crumb and a golden top, lovely with tea." },
    { id: "block", cat: "bread", name: "Block", price: 450, badge: "Popular", h: 64,
      desc: "A compact loaf that slices cleanly for toast and sandwiches." },
    { id: "long", cat: "bread", name: "Long", price: 650, badge: "Family size", h: 74,
      desc: "A long, generous loaf made for sharing at home." },
    { id: "slice", cat: "bread", name: "Slice", price: 850, badge: "Pre-sliced", h: 84,
      desc: "Evenly sliced and ready for sandwiches, toast and lunch boxes." },
    { id: "jumbo", cat: "bread", name: "Jumbo", price: 1700, badge: "Best value", h: 94,
      desc: "Our biggest loaf, made for big families, caterers and parties." },
    { id: "water", cat: "water", name: "A Bag of Table Water", price: 300, badge: "NAFDAC registered",
      desc: "Produced under strict quality standards, each sachet is purified through multi-stage filtration to ensure clean, safe and great-tasting water." },
  ];
  const BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const naira = (n) => "₦" + n.toLocaleString("en-NG");
  const money = (n) => "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });

  // ---------- Cart ----------
  const KEY = "ajalisco-cart-v3";
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };

  const control = (id) => {
    const q = cart[id] || 0, n = BY_ID[id].name;
    if (!q) return `<button class="add" type="button" data-add="${id}" aria-label="Add ${n} to cart">Add to cart</button>`;
    return `<div class="qty" role="group" aria-label="${n} quantity">
      <button type="button" data-dec="${id}" aria-label="Remove one ${n}">−</button>
      <output aria-live="polite">${q}<span class="qty__lbl"> in cart</span></output>
      <button type="button" data-inc="${id}" aria-label="Add one ${n}">+</button></div>`;
  };

  // ---------- Product cards ----------
  const mediaHTML = (p) => p.cat === "water"
    ? `<div class="media media--water"><img src="assets/sachet.webp" alt="${p.name}" loading="lazy"></div>`
    : `<div class="media media--bread"><img class="pack" src="assets/pack-chocolate.webp" alt="Jalix ${p.name} bread" loading="lazy" style="height:${p.h}%"><span class="media__size">${p.name}</span></div>`;

  const cardHTML = (p, i) => `
    <article class="card rv" style="--i:${i % 4}" data-card="${p.id}" data-cat="${p.cat}">
      <button class="card__open" type="button" data-open="${p.id}" aria-label="View ${p.name}">
        <span class="badge">${p.badge}</span>${mediaHTML(p)}
      </button>
      <div class="card__body">
        <p class="card__cat">${p.cat === "water" ? "Premium Water" : "Jalix Bread"}</p>
        <h3><button type="button" class="linkbtn" data-open="${p.id}">${p.name}</button></h3>
        <p class="card__price">${naira(p.price)}<small>.00</small></p>
        <div class="card__ctrl" data-ctrl="${p.id}"></div>
      </div>
    </article>`;

  const state = { home: { filter: "all" }, shop: { filter: "all", sort: "default" } };
  function renderGrid(name, skeleton) {
    const grid = $(`[data-grid="${name}"]`); if (!grid) return;
    const st = state[name];
    let list = PRODUCTS.filter((p) => st.filter === "all" || p.cat === st.filter);
    if (st.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (st.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    const paint = () => {
      grid.innerHTML = list.map(cardHTML).join("");
      grid.classList.remove("is-loading");
      $$(".rv", grid).forEach((el) => el.classList.add("in"));
      renderCart();
      if (name === "shop") $("#shopCount").textContent = list.length === PRODUCTS.length ? `Showing all ${list.length} results` : `Showing ${list.length} of ${PRODUCTS.length} results`;
    };
    if (skeleton && !reduce) { grid.classList.add("is-loading"); grid.innerHTML = list.map(() => '<div class="skel"></div>').join(""); setTimeout(paint, 380); }
    else paint();
  }

  function setFilter(name, f, skeleton = true) {
    state[name].filter = f;
    $$(`[data-tabs="${name}"] button`).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.filter === f)));
    renderGrid(name, skeleton);
  }
  $$("[data-tabs]").forEach((tabs) => tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]"); if (b) setFilter(tabs.dataset.tabs, b.dataset.filter);
  }));
  $("#shopSort").addEventListener("change", (e) => { state.shop.sort = e.target.value; renderGrid("shop", true); });
  document.addEventListener("click", (e) => {
    const l = e.target.closest("[data-filter-link]"); if (l) setFilter("shop", l.dataset.filterLink, false);
  });

  // ---------- Cart UI ----------
  const sheet = $("[data-sheet]"), items = $("[data-sheet-items]"), bar = $("[data-orderbar]");
  function renderCart() {
    $$("[data-ctrl]").forEach((el) => (el.innerHTML = control(el.dataset.ctrl)));
    $$("[data-card]").forEach((c) => c.classList.toggle("is-in", !!cart[c.dataset.card]));
    const ids = Object.keys(cart).filter((id) => BY_ID[id]);
    const count = ids.reduce((s, id) => s + cart[id], 0);
    const total = ids.reduce((s, id) => s + cart[id] * BY_ID[id].price, 0);
    $$("[data-count]").forEach((el) => (el.textContent = count));
    $$("[data-total]").forEach((el) => (el.textContent = money(total)));
    $$("[data-items-label]").forEach((el) => (el.textContent = count === 1 ? "item" : "items"));
    bar.hidden = !count;
    document.body.classList.toggle("has-cart", count > 0);
    items.innerHTML = ids.map((id) => `
      <li><span class="sheet__thumb ${id === "water" ? "is-water" : ""}" aria-hidden="true"><img src="assets/${id === "water" ? "sachet.webp" : "pack-chocolate.webp"}" alt=""></span>
        <span class="sheet__name">${BY_ID[id].name}<small>${naira(BY_ID[id].price)} each · <b>${naira(cart[id] * BY_ID[id].price)}</b></small></span>
        ${control(id)}</li>`).join("");
    const empty = !count;
    $("[data-sheet-empty]").hidden = !empty;
    ["[data-sheet-total]", "[data-fields]", "[data-send]", ".sheet__fine"].forEach((s) => ($(s).hidden = empty));
    const pm = $("#pmBody [data-ctrl]"); if (pm) pm.innerHTML = control(pm.dataset.ctrl);
  }
  const setQty = (id, q) => {
    q = Math.max(0, Math.min(999, q | 0));
    if (q) cart[id] = q; else delete cart[id];
    save(); renderCart();
  };
  const pulse = () => $$(".cart-btn__icon, .orderbar").forEach((el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-open-cart],[data-close],[data-open]");
    if (!t) return;
    let focus = null;
    if (t.dataset.add) { setQty(t.dataset.add, 1); pulse(); focus = `[data-inc="${t.dataset.add}"]`; }
    else if (t.dataset.inc) { setQty(t.dataset.inc, (cart[t.dataset.inc] || 0) + 1); pulse(); focus = `[data-inc="${t.dataset.inc}"]`; }
    else if (t.dataset.dec) { const id = t.dataset.dec; setQty(id, (cart[id] || 0) - 1); focus = `[data-dec="${id}"],[data-add="${id}"]`; }
    else if ("openCart" in t.dataset) { if (modal.open) modal.close(); sheet.showModal(); }
    else if ("close" in t.dataset) { const d = t.closest("dialog"); if (d) d.close(); }
    else if (t.dataset.open) openProduct(t.dataset.open);
    if (focus) { const scope = t.closest("dialog") || document; scope.querySelector(focus)?.focus({ preventScroll: true }); }
  });
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

  $("[data-order-form]").addEventListener("submit", (e) => {
    if (e.submitter?.value !== "send") return;
    e.preventDefault();
    const f = new FormData(e.target), ids = Object.keys(cart).filter((id) => BY_ID[id]);
    const total = ids.reduce((s, id) => s + cart[id] * BY_ID[id].price, 0);
    openWhatsApp([
      "Hello Ajalisco 👋 I'd like to place an order:", "",
      ...ids.map((id) => `• ${cart[id]} × ${BY_ID[id].name}${BY_ID[id].cat === "bread" ? " bread" : ""} — ${naira(cart[id] * BY_ID[id].price)}`),
      "", `Total: ${naira(total)}`, "", `Name: ${f.get("name")}`, `Phone: ${f.get("phone")}`, `Delivery: ${f.get("address") || "(to confirm)"}`,
    ].join("\n"));
  });

  // ---------- Product modal ----------
  const modal = $("#productModal");
  function openProduct(id) {
    const p = BY_ID[id]; if (!p) return;
    $("#pmBody").innerHTML = `
      <div class="pm__media">${mediaHTML(p).replace('loading="lazy"', "")}</div>
      <div class="pm__info">
        <span class="badge badge--static">${p.badge}</span>
        <p class="card__cat">${p.cat === "water" ? "Premium Water" : "Jalix Bread"}</p>
        <h2 id="pmTitle">${p.name}</h2>
        <p class="pm__price">${naira(p.price)}<small>.00</small></p>
        <p class="pm__desc">${p.desc}</p>
        <div class="card__ctrl" data-ctrl="${p.id}"></div>
        <a class="btn btn--whatsapp btn--block" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello Ajalisco, I have a question about ${p.name}.`)}">Ask about this on WhatsApp</a>
        <ul class="pm__meta"><li>NAFDAC registered brand</li><li>Made in Umuahia, Abia State</li></ul>
      </div>`;
    renderCart();
    modal.showModal();
  }
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  // ---------- WhatsApp + forms ----------
  const openWhatsApp = (text) => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  let toastT;
  function toast(msg, type = "ok") {
    const t = $("#toast"); t.textContent = msg; t.className = "toast show " + type;
    clearTimeout(toastT); toastT = setTimeout(() => (t.className = "toast"), 4200);
  }
  const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  $$("[data-form]").forEach((form) => {
    form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const kind = form.dataset.form, f = new FormData(form), get = (k) => (f.get(k) || "").toString().trim();
      let bad = 0;
      $$("[required]", form).forEach((inp) => {
        const empty = !inp.value.trim(), badMail = inp.type === "email" && inp.value && !emailOK(inp.value.trim());
        inp.closest(".field")?.classList.toggle("invalid", empty || badMail);
        if (empty || badMail) bad++;
      });
      if (bad) { toast("Please fill in the highlighted fields.", "err"); $(".invalid input, .invalid textarea", form)?.focus(); return; }
      if (kind === "subscribe") {
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Subscribe to Ajalisco updates")}&body=${encodeURIComponent("Please add " + get("email") + " to your updates list.")}`;
        toast("Thanks! Your email app will open to confirm your subscription."); form.reset(); return;
      }
      const lines = kind === "partnership"
        ? ["Hello Ajalisco 👋 Partnership request:", "", `Name: ${get("name")}`, `Email: ${get("email")}`, `Phone: ${get("phone")}`, `Business: ${get("business") || "-"}`, `Location: ${get("location")}`, `Message: ${get("message") || "-"}`]
        : ["Hello Ajalisco 👋 New message from the website:", "", `Name: ${get("name")}`, `Email: ${get("email")}`, `Phone: ${get("phone")}`, `Business: ${get("business") || "-"}`, `Enquiry: ${get("inquiry") || "-"}`, `Message: ${get("message")}`];
      openWhatsApp(lines.join("\n"));
      toast("Opening WhatsApp — just press send to reach us.");
    });
  });

  // ---------- CTA banners ----------
  $$("[data-cta]").forEach((el) => {
    const c = JSON.parse(el.dataset.cta);
    el.innerHTML = `<div class="cta rv"><div class="bubbles bubbles--sm" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <h2>Proudly Made in Nigeria, Trusted by <span>Thousands</span></h2>
      <p>Let’s bring clean water and fresh bread to more homes in Nigeria.</p>
      <div class="btn-row btn-row--center"><a class="btn btn--green btn--lg" href="${c.primary[1]}">${c.primary[0]}</a>${c.secondary ? `<a class="btn btn--ghost-light btn--lg" href="${c.secondary[1]}">${c.secondary[0]}</a>` : ""}</div></div>`;
  });

  // ---------- Router ----------
  const ROUTES = ["home", "shop", "services", "partnership", "about", "contact"];
  const io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }) : null;
  const watch = (scope) => $$(".rv:not(.in)", scope).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  function route() {
    const r = (location.hash.replace(/^#\/?/, "").split("?")[0] || "home");
    const page = ROUTES.includes(r) ? r : "home";
    $$(".page").forEach((p) => p.classList.toggle("active", p.id === "page-" + page));
    const el = $("#page-" + page);
    document.title = el.dataset.title;
    $$(".nav__links a[data-route]").forEach((a) => a.classList.toggle("active", a.dataset.route === page));
    setMenu(false);
    scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    requestAnimationFrame(() => watch(el));
  }
  addEventListener("hashchange", route);

  // ---------- Nav, scroll, misc ----------
  const nav = $("#nav"), burger = $("#burger");
  function setMenu(open) { nav.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", String(open)); document.body.classList.toggle("no-scroll", open && innerWidth < 960); }
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  const progress = $("#progress"), toTop = $("#toTop");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    nav.classList.toggle("is-stuck", scrollY > 8);
    toTop.classList.toggle("show", scrollY > 700);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();
  const track = $("#reviewsTrack");
  track.insertAdjacentHTML("beforeend", track.innerHTML.replace(/<figure class="review">/g, '<figure class="review" aria-hidden="true">'));
  $$(".ticker__track").forEach((t) => t.insertAdjacentHTML("beforeend", t.innerHTML));

  // ---------- Init ----------
  renderGrid("home"); renderGrid("shop"); renderCart(); route();

  const loader = $("#loader"), barEl = $("#loaderBar"), num = $("#loaderNum");
  let p = 0;
  const finish = () => { document.body.classList.add("ready"); loader.classList.add("done"); setTimeout(() => loader.remove(), 700); };
  if (reduce) finish();
  else {
    const t = setInterval(() => {
      p = Math.min(100, p + 9 + Math.random() * 12); num.textContent = Math.floor(p); barEl.style.width = p + "%";
      if (p >= 100) { clearInterval(t); setTimeout(finish, 250); }
    }, 70);
    setTimeout(() => { if (document.body.contains(loader)) finish(); }, 4000);
  }
})();
