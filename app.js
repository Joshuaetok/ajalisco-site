(() => {
  const WHATSAPP = "2347078581881";
  const EMAIL = "support@ajaliscogroup.com";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Catalogue — mirrors how the products will exist in WooCommerce:
     simple products, one category each (Jalix Bread / Premium Water).
  ------------------------------------------------------------------ */
  const PACK = { chocolate: "assets/pack-chocolate.webp", creamy: "assets/pack-creamy.webp", sandwich: "assets/pack-sandwich.webp", cocoluxe: "assets/pack-cocoluxe.webp" };
  const BREAD = "Jalix Bread", WATER = "Premium Water";
  const PRODUCTS = [
    { id: "small-round", cat: "bread", catLabel: BREAD, name: "Small Round", price: 250, label: "Quick bite", size: 1, h: 46, pack: "chocolate", t: ["#F8E9D7", "#EBCB9F"],
      best: "One person, one quick bite", short: "A soft little loaf that's perfect for a quick breakfast or a snack on the go." },
    { id: "round", cat: "bread", catLabel: BREAD, name: "Round", price: 300, label: "Everyday", size: 2, h: 56, pack: "creamy", t: ["#FCF1CD", "#F0D57F"],
      best: "Everyday breakfast for two", short: "Our classic round loaf. Soft crumb and a golden top, lovely with tea." },
    { id: "block", cat: "bread", catLabel: BREAD, name: "Block", price: 450, label: "Popular", size: 3, h: 66, pack: "sandwich", t: ["#FAE4D2", "#EDB98F"],
      best: "Toast, sandwiches and more", short: "A compact loaf that slices cleanly for toast and sandwiches." },
    { id: "long", cat: "bread", catLabel: BREAD, name: "Long", price: 650, label: "Family size", size: 4, h: 76, pack: "cocoluxe", t: ["#FBDEDC", "#EE9F9B"],
      best: "Sharing at home", short: "A long, generous loaf made for sharing at home." },
    { id: "slice", cat: "bread", catLabel: BREAD, name: "Slice", price: 850, label: "Pre-sliced", size: 5, h: 86, pack: "chocolate", t: ["#F8E9D7", "#EBCB9F"],
      best: "Sandwiches and lunch boxes, ready to go", short: "Evenly sliced and ready for sandwiches, toast and lunch boxes." },
    { id: "jumbo", cat: "bread", catLabel: BREAD, name: "Jumbo", price: 1700, label: "Best value", size: 6, h: 96, pack: "creamy", t: ["#FCF1CD", "#F0D57F"],
      best: "Big families, caterers and parties", short: "Our biggest loaf, made for big families, caterers and parties." },
    { id: "water", cat: "water", catLabel: WATER, name: "A Bag of Table Water", price: 300, label: "NAFDAC registered", short: "Produced under strict quality standards, each sachet is purified through multi-stage filtration to ensure clean, safe and great-tasting water." },
  ];
  const BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const BREADS = PRODUCTS.filter((p) => p.cat === "bread");

  const fmt = (n) => "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const priceHTML = (n) => `<span class="price"><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">₦</span>${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</bdi></span></span>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------------------- Cart ---------------------------- */
  const KEY = "ajalisco-cart-v4";
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };
  const cartIds = () => Object.keys(cart).filter((id) => BY_ID[id]);
  const cartCount = () => cartIds().reduce((s, id) => s + cart[id], 0);
  const cartTotal = () => cartIds().reduce((s, id) => s + cart[id] * BY_ID[id].price, 0);

  /* ------------------------- Product media ------------------------ */
  function media(p, big) {
    if (p.cat === "water") return `<div class="pm pm--water"><img src="assets/sachet.webp" alt="${esc(p.name)}" ${big ? "" : 'loading="lazy"'}></div>`;
    return `<div class="pm pm--bread" style="--t1:${p.t[0]};--t2:${p.t[1]}"><span class="pm__ghost" aria-hidden="true">0${p.size}</span><span class="pm__ring" aria-hidden="true"></span>
      <img class="pm__pack" src="${PACK[p.pack]}" alt="Jalix ${esc(p.name)} bread" style="height:${p.h}%" ${big ? "" : 'loading="lazy"'}></div>`;
  }
  const meter = (p) => p.cat !== "bread" ? "" : `<span class="meter" aria-label="Size ${p.size} of 6">${BREADS.map((b, i) => `<i class="${i < p.size ? "on" : ""}" style="height:${7 + i * 2.6}px"></i>`).join("")}<em>Size ${p.size}/6</em></span>`;
  const addBtn = (p, cls = "") => `<a href="?add-to-cart=${p.id}" class="button product_type_simple add_to_cart_button ajax_add_to_cart ${cls}" data-product_id="${p.id}" aria-label="Add “${esc(p.name)}” to your cart" rel="nofollow">Add to cart</a>`;

  /* --------------------- Product loop (Woo markup) ------------------- */
  const card = (p) => `
    <li class="product type-product product_cat-${p.cat}" data-id="${p.id}" data-cat="${p.cat}">
      <span class="onsale">${p.label}</span>
      <a class="woocommerce-LoopProduct-link woocommerce-loop-product__link" href="#/product/${p.id}">
        ${media(p)}
        <span class="product_cat">${p.catLabel}</span>
        <h2 class="woocommerce-loop-product__title">${p.name}</h2>
        ${meter(p)}
        ${priceHTML(p.price)}
      </a>
      ${addBtn(p)}
    </li>`;
  const loop = (list, cols = 4) => `<ul class="products columns-${cols}">${list.map(card).join("")}</ul>`;

  const state = { home: { filter: "all" }, shop: { filter: "all", order: "menu_order" } };
  function renderGrid(name, skeleton) {
    const host = $(`[data-grid="${name}"]`); if (!host) return;
    const st = state[name];
    let list = PRODUCTS.filter((p) => st.filter === "all" || p.cat === st.filter);
    if (st.order === "price") list = [...list].sort((a, b) => a.price - b.price);
    if (st.order === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    const paint = () => {
      host.innerHTML = loop(list);
      if (name === "shop") $("#shopCount").textContent = list.length === 1 ? "Showing the single result" : `Showing all ${list.length} results`;
    };
    if (skeleton && !reduce) { host.innerHTML = `<ul class="products columns-4">${list.map(() => '<li class="product skel"></li>').join("")}</ul>`; setTimeout(paint, 360); }
    else paint();
  }
  function setFilter(name, f, skeleton = true) {
    state[name].filter = f;
    $$(`[data-tabs="${name}"] button`).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.filter === f)));
    renderGrid(name, skeleton);
  }
  $$("[data-tabs]").forEach((t) => t.addEventListener("click", (e) => { const b = e.target.closest("[data-filter]"); if (b) setFilter(t.dataset.tabs, b.dataset.filter); }));
  $("#shopSort").addEventListener("change", (e) => { state.shop.order = e.target.value; renderGrid("shop", true); });
  document.addEventListener("click", (e) => { const l = e.target.closest("[data-filter-link]"); if (l) setFilter("shop", l.dataset.filterLink, false); });

  /* ------------------ Add to cart (Woo AJAX pattern) ----------------- */
  function addToCart(id, qty = 1, btn) {
    cart[id] = Math.min(999, (cart[id] || 0) + qty); save(); refreshCart();
    if (btn) {
      btn.classList.remove("loading"); btn.classList.add("added");
      if (!btn.nextElementSibling?.classList.contains("added_to_cart")) btn.insertAdjacentHTML("afterend", '<a href="#/cart" class="added_to_cart wc-forward" title="View cart">View cart</a>');
    }
    $$(".cart-btn__icon").forEach((el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".ajax_add_to_cart, .single_add_to_cart_button");
    if (!b) return;
    e.preventDefault();
    if (b.classList.contains("loading")) return;
    const id = b.dataset.product_id;
    const qty = b.classList.contains("single_add_to_cart_button") ? Math.max(1, parseInt($("#qtyInput")?.value, 10) || 1) : 1;
    b.classList.add("loading"); b.classList.remove("added");
    setTimeout(() => {
      addToCart(id, qty, b);
      if (b.classList.contains("single_add_to_cart_button")) {
        const n = $("#wcNotice"); if (n) { n.hidden = false; n.innerHTML = `<a href="#/cart" class="button wc-forward">View cart</a> “${esc(BY_ID[id].name)}” has been added to your cart.`; }
      }
    }, reduce ? 0 : 420);
  });

  /* --------------------------- Mini cart ------------------------- */
  const mini = $("#miniCart");
  function refreshCart() {
    save();
    $$("[data-count]").forEach((el) => (el.textContent = cartCount()));
    $$("[data-total]").forEach((el) => (el.textContent = fmt(cartTotal())));
    renderMini();
    if ($("#page-cart").classList.contains("active")) renderCartPage();
  }
  function renderMini() {
    const ids = cartIds();
    $("#mcBody").innerHTML = !ids.length
      ? `<p class="woocommerce-mini-cart__empty-message">No products in the cart.</p><a class="button wc-forward" href="#/shop" data-close>Return to shop</a>`
      : `<ul class="woocommerce-mini-cart">${ids.map((id) => { const p = BY_ID[id]; return `
          <li class="woocommerce-mini-cart-item">
            <a class="remove" href="#" data-remove="${id}" aria-label="Remove ${esc(p.name)} from cart">×</a>
            <span class="mini__thumb">${p.cat === "water" ? '<img src="assets/sachet.webp" alt="">' : `<img src="${PACK[p.pack]}" alt="">`}</span>
            <span class="mini__info"><a href="#/product/${id}" data-close>${p.name}</a><span class="quantity">${cart[id]} × ${priceHTML(p.price)}</span></span>
          </li>`; }).join("")}</ul>
        <p class="woocommerce-mini-cart__total total"><strong>Subtotal:</strong> ${priceHTML(cartTotal())}</p>
        <p class="woocommerce-mini-cart__buttons buttons"><a href="#/cart" class="button wc-forward" data-close>View cart</a><a href="#" class="button checkout wc-forward" data-checkout>Checkout</a></p>`;
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-cart]")) { renderMini(); mini.showModal(); return; }
    const rm = e.target.closest("[data-remove]");
    if (rm) { e.preventDefault(); delete cart[rm.dataset.remove]; refreshCart(); return; }
    if (e.target.closest("[data-checkout]")) { e.preventDefault(); toast("Preview only — on your live site this opens the WooCommerce checkout."); return; }
    const c = e.target.closest("[data-close]"); if (c) { c.closest("dialog")?.close(); }
    const sc = e.target.closest("[data-scroll]"); if (sc) { e.preventDefault(); document.getElementById(sc.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
  mini.addEventListener("click", (e) => { if (e.target === mini) mini.close(); });

  /* --------------------------- Cart page ------------------------- */
  function renderCartPage() {
    const ids = cartIds(), host = $("#cartView");
    if (!ids.length) { host.innerHTML = `<div class="cart-empty"><p class="cart-empty__msg">Your cart is currently empty.</p><a class="button wc-backward" href="#/shop">Return to shop</a></div>`; return; }
    host.innerHTML = `
      <div class="cart-layout">
        <form class="woocommerce-cart-form" onsubmit="return false">
          <table class="shop_table cart"><thead><tr><th class="product-remove"><span class="sr">Remove</span></th><th class="product-thumbnail"><span class="sr">Thumbnail</span></th><th class="product-name">Product</th><th class="product-price">Price</th><th class="product-quantity">Quantity</th><th class="product-subtotal">Subtotal</th></tr></thead><tbody>
          ${ids.map((id) => { const p = BY_ID[id]; return `<tr class="cart_item">
            <td class="product-remove"><a href="#" class="remove" data-remove="${id}" aria-label="Remove ${esc(p.name)} from cart">×</a></td>
            <td class="product-thumbnail"><span class="mini__thumb">${p.cat === "water" ? '<img src="assets/sachet.webp" alt="">' : `<img src="${PACK[p.pack]}" alt="">`}</span></td>
            <td class="product-name" data-title="Product"><a href="#/product/${id}">${p.name}</a></td>
            <td class="product-price" data-title="Price">${priceHTML(p.price)}</td>
            <td class="product-quantity" data-title="Quantity"><div class="quantity"><button type="button" data-qty="-1" data-id="${id}" aria-label="Decrease ${esc(p.name)}">−</button><input type="number" min="1" value="${cart[id]}" data-qtyin="${id}" aria-label="${esc(p.name)} quantity" inputmode="numeric"><button type="button" data-qty="1" data-id="${id}" aria-label="Increase ${esc(p.name)}">+</button></div></td>
            <td class="product-subtotal" data-title="Subtotal">${priceHTML(p.price * cart[id])}</td></tr>`; }).join("")}
          </tbody></table>
        </form>
        <div class="cart_totals"><h2>Cart totals</h2>
          <table class="shop_table"><tr class="cart-subtotal"><th>Subtotal</th><td>${priceHTML(cartTotal())}</td></tr><tr class="order-total"><th>Total</th><td><strong>${priceHTML(cartTotal())}</strong></td></tr></table>
          <a href="#" class="checkout-button button alt wc-forward" data-checkout>Proceed to checkout</a>
          <a href="#/shop" class="continue">← Continue shopping</a>
        </div>
      </div>`;
  }
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]");
    if (q) { const id = q.dataset.id; const n = (cart[id] || 1) + parseInt(q.dataset.qty, 10); if (n < 1) delete cart[id]; else cart[id] = Math.min(999, n); refreshCart(); }
  });
  document.addEventListener("change", (e) => {
    const i = e.target.closest("[data-qtyin]");
    if (i) { const n = parseInt(i.value, 10); if (!n || n < 1) delete cart[i.dataset.qtyin]; else cart[i.dataset.qtyin] = Math.min(999, n); refreshCart(); }
  });

  /* ------------------------- Single product ---------------------- */
  function renderProduct(id) {
    const p = BY_ID[id]; if (!p) { location.hash = "#/shop"; return; }
    $("#pTitleBanner").textContent = p.catLabel;
    document.title = `${p.name} — Ajalisco Production Industries Limited`;
    const related = PRODUCTS.filter((x) => x.id !== id && x.cat === p.cat).slice(0, 3);
    const more = related.length < 3 ? [...related, ...PRODUCTS.filter((x) => x.id !== id && x.cat !== p.cat)].slice(0, 3) : related;
    $("#productView").innerHTML = `
      <nav class="woocommerce-breadcrumb" aria-label="Breadcrumb"><a href="#/">Home</a> <span>/</span> <a href="#/shop" data-filter-link="${p.cat}">${p.catLabel}</a> <span>/</span> ${p.name}</nav>
      <div id="wcNotice" class="woocommerce-message" role="alert" hidden></div>
      <div class="product single-product">
        <div class="woocommerce-product-gallery">${media(p, true)}<span class="onsale">${p.label}</span></div>
        <div class="summary entry-summary">
          <h1 class="product_title entry-title">${p.name}</h1>
          ${priceHTML(p.price)}
          <div class="woocommerce-product-details__short-description"><p>${p.short}</p></div>
          ${meter(p)}
          <form class="cart" onsubmit="return false">
            <div class="quantity"><button type="button" data-step="-1" aria-label="Decrease quantity">−</button><input type="number" id="qtyInput" value="1" min="1" inputmode="numeric" aria-label="Quantity"><button type="button" data-step="1" aria-label="Increase quantity">+</button></div>
            <button type="button" class="single_add_to_cart_button button alt" data-product_id="${p.id}">Add to cart</button>
          </form>
          <div class="product_meta"><span class="posted_in">Category: <a href="#/shop" data-filter-link="${p.cat}">${p.catLabel}</a></span></div>
        </div>
      </div>
      <div class="woocommerce-tabs" id="wcTabs">
        <ul class="tabs wc-tabs" role="tablist"><li class="active"><a href="#" data-tab="description">Description</a></li><li><a href="#" data-tab="additional">Additional information</a></li><li><a href="#" data-tab="reviews">Reviews (0)</a></li></ul>
        <div class="woocommerce-Tabs-panel" data-panel="description"><h2>Description</h2><p>${p.short}</p><p>${p.cat === "bread" ? "Baked fresh by Ajalisco Production Industries Limited in Umuahia, Abia State, and packed for freshness." : "Made and sealed by Ajalisco Production Industries Limited in Umuahia, Abia State. NAFDAC registered."}</p></div>
        <div class="woocommerce-Tabs-panel" data-panel="additional" hidden><h2>Additional information</h2><table class="woocommerce-product-attributes"><tr><th>${p.cat === "bread" ? "Size" : "Pack"}</th><td>${p.cat === "bread" ? p.name : "Bag of sachet water"}</td></tr><tr><th>Brand</th><td>${p.cat === "bread" ? "Jalix" : "Ajalisco"}</td></tr></table></div>
        <div class="woocommerce-Tabs-panel" data-panel="reviews" hidden><h2>Reviews</h2><p class="woocommerce-noreviews">There are no reviews yet.</p></div>
      </div>
      <section class="related products-related"><h2>Related products</h2>${loop(more, 3)}</section>`;
  }
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-step]");
    if (s) { const i = $("#qtyInput"); i.value = Math.max(1, (parseInt(i.value, 10) || 1) + parseInt(s.dataset.step, 10)); }
    const t = e.target.closest("[data-tab]");
    if (t) {
      e.preventDefault();
      $$("#wcTabs .wc-tabs li").forEach((li) => li.classList.toggle("active", li === t.parentElement));
      $$("#wcTabs [data-panel]").forEach((pn) => (pn.hidden = pn.dataset.panel !== t.dataset.tab));
    }
  });

  /* --------------------------- Size picker ----------------------- */
  let pickIdx = 2;
  function renderPicker() {
    const sizes = $("#pickerSizes"), stage = $("#pickerStage"); if (!sizes) return;
    sizes.innerHTML = BREADS.map((p, i) => `<button role="tab" type="button" aria-selected="${i === pickIdx}" data-pick="${i}"><b>${p.name}</b><span>${fmt(p.price).replace(".00", "")}</span></button>`).join("");
    const p = BREADS[pickIdx];
    stage.innerHTML = `
      <div class="picker__visual" style="--t1:${p.t[0]};--t2:${p.t[1]}">
        <span class="picker__num" aria-hidden="true">${p.size}<small>/6</small></span>
        <div class="picker__ruler" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <img class="picker__pack" src="${PACK[p.pack]}" alt="Jalix ${esc(p.name)} bread" style="height:${p.h - 6}%">
        <span class="picker__shadow" aria-hidden="true"></span>
      </div>
      <div class="picker__info">
        <span class="onsale onsale--static">${p.label}</span>
        <h3>${p.name}</h3>
        ${priceHTML(p.price)}
        <p class="picker__best"><b>Best for:</b> ${p.best}</p>
        <p>${p.short}</p>
        ${meter(p)}
        <div class="picker__cta">${addBtn(p, "alt")}<a class="picker__link" href="#/product/${p.id}">View details →</a></div>
      </div>`;
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (b) { pickIdx = +b.dataset.pick; renderPicker(); } });

  /* ------------------------------ Toast -------------------------- */
  let toastT;
  function toast(msg, type = "ok") {
    const t = $("#toast"); t.textContent = msg; t.className = "toast show " + type;
    clearTimeout(toastT); toastT = setTimeout(() => (t.className = "toast"), 4600);
  }

  /* ------------------------------ Forms -------------------------- */
  const openWhatsApp = (text) => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  $$("[data-form]").forEach((form) => {
    form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const kind = form.dataset.form, f = new FormData(form), get = (k) => (f.get(k) || "").toString().trim();
      let bad = 0;
      $$("[required]", form).forEach((inp) => {
        const empty = !inp.value.trim(), badMail = inp.type === "email" && inp.value && !emailOK(inp.value.trim());
        inp.closest(".field")?.classList.toggle("invalid", empty || badMail); if (empty || badMail) bad++;
      });
      if (bad) { toast("Please fill in the highlighted fields.", "err"); $(".invalid input, .invalid textarea", form)?.focus(); return; }
      if (kind === "subscribe") {
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Subscribe to Ajalisco updates")}&body=${encodeURIComponent("Please add " + get("email") + " to your updates list.")}`;
        toast("Thanks! Your email app will open to confirm your subscription."); form.reset(); return;
      }
      openWhatsApp((kind === "partnership"
        ? ["Hello Ajalisco 👋 Partnership request:", "", `Name: ${get("name")}`, `Email: ${get("email")}`, `Phone: ${get("phone")}`, `Business: ${get("business") || "-"}`, `Location: ${get("location")}`, `Message: ${get("message") || "-"}`]
        : ["Hello Ajalisco 👋 New message from the website:", "", `Name: ${get("name")}`, `Email: ${get("email")}`, `Phone: ${get("phone")}`, `Business: ${get("business") || "-"}`, `Enquiry: ${get("inquiry") || "-"}`, `Message: ${get("message")}`]).join("\n"));
      toast("Opening WhatsApp — just press send to reach us.");
    });
  });

  /* --------------------------- CTA banners ----------------------- */
  $$("[data-cta]").forEach((el) => {
    const c = JSON.parse(el.dataset.cta);
    el.innerHTML = `<div class="cta rv"><div class="bubbles bubbles--sm" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <h2>Proudly Made in Nigeria, Trusted by <span>Thousands</span></h2>
      <p>Let’s bring clean water and fresh bread to more homes in Nigeria.</p>
      <div class="btn-row btn-row--center"><a class="btn btn--green btn--lg" href="${c.primary[1]}">${c.primary[0]}</a>${c.secondary ? `<a class="btn btn--ghost-light btn--lg" href="${c.secondary[1]}">${c.secondary[0]}</a>` : ""}</div></div>`;
  });

  /* ------------------------------ Router ------------------------- */
  const ROUTES = ["home", "shop", "partnership", "about", "contact", "cart", "product"];
  const io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }) : null;
  const watch = (scope) => $$(".rv:not(.in)", scope).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
    const r = parts[0] || "home", page = ROUTES.includes(r) ? r : "home";
    $$(".page").forEach((p) => p.classList.toggle("active", p.id === "page-" + page));
    const el = $("#page-" + page);
    document.title = el.dataset.title;
    const navKey = page === "product" || page === "cart" ? "shop" : page;
    $$(".nav__links a[data-route]").forEach((a) => a.classList.toggle("active", a.dataset.route === navKey));
    setMenu(false);
    if (page === "product") renderProduct(parts[1]);
    if (page === "cart") renderCartPage();
    if (page === "shop") renderGrid("shop");
    scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    requestAnimationFrame(() => watch(el));
  }
  addEventListener("hashchange", route);

  /* ------------------------ Nav / scroll / misc ------------------ */
  const nav = $("#nav"), burger = $("#burger");
  function setMenu(open) { nav.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", String(open)); document.body.classList.toggle("no-scroll", open && innerWidth < 960); }
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  const progress = $("#progress"), toTop = $("#toTop");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    nav.classList.toggle("is-stuck", scrollY > 8); toTop.classList.toggle("show", scrollY > 700);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();
  const track = $("#reviewsTrack");
  track.insertAdjacentHTML("beforeend", track.innerHTML.replace(/<figure class="review">/g, '<figure class="review" aria-hidden="true">'));

  /* ------------------------------ Init --------------------------- */
  renderGrid("home"); renderGrid("shop"); renderPicker(); refreshCart(); route();

  const loader = $("#loader"), barEl = $("#loaderBar"), num = $("#loaderNum");
  let p = 0;
  const finish = () => { document.body.classList.add("ready"); loader.classList.add("done"); setTimeout(() => loader.remove(), 700); };
  if (reduce) finish();
  else {
    const t = setInterval(() => { p = Math.min(100, p + 9 + Math.random() * 12); num.textContent = Math.floor(p); barEl.style.width = p + "%"; if (p >= 100) { clearInterval(t); setTimeout(finish, 250); } }, 70);
    setTimeout(() => { if (document.body.contains(loader)) finish(); }, 4000);
  }
})();
