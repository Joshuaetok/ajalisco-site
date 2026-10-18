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

  /* ------------------------------------------------------------------
     Careers — mirrors how each role will exist as a "Job" custom post
     type once this becomes a real WordPress plugin.
  ------------------------------------------------------------------ */
  const JOBS = [
    { slug: "franchise", title: "Franchise Partner", type: "Business Partnership", location: "Nationwide, Nigeria",
      summary: "Bring Ajalisco's water and bread products to your community by owning and running a franchise outlet backed by our production, training and brand support.",
      responsibilities: [
        "Set up and manage a retail or distribution outlet under the Ajalisco brand",
        "Maintain agreed stock levels of Ajalisco water and Jalix bread products",
        "Uphold Ajalisco's quality, hygiene and customer service standards",
        "Report sales performance and inventory to the partnerships team",
      ],
      requirements: [
        "Registered business, or willingness to register one",
        "Suitable retail or storage space in your target location",
        "Capital to meet the franchise's minimum stock order",
        "Strong local market knowledge and customer network",
      ] },
    { slug: "baker", title: "Baker", type: "Full-time", location: "Umuahia, Abia State",
      summary: "Produce Jalix bread to our quality and hygiene standards across every daily bake, from mixing through to the final bake.",
      responsibilities: [
        "Prepare and bake dough according to Ajalisco's recipes and standards",
        "Monitor oven temperatures and bake times for consistent quality",
        "Follow food safety and hygiene procedures at every stage",
        "Work with the mixing and packaging teams to meet daily production targets",
      ],
      requirements: [
        "Prior experience baking bread in a commercial or industrial setting",
        "Comfortable with early shifts and a fast-paced production floor",
        "Attention to detail and consistency",
        "Basic literacy for reading recipes and production logs",
      ] },
    { slug: "bakery-assistant", title: "Bakery Assistant", type: "Full-time", location: "Umuahia, Abia State",
      summary: "Support the bakery team with preparation, packaging and general production tasks that keep the line running smoothly.",
      responsibilities: [
        "Assist bakers with ingredient preparation and dough handling",
        "Pack finished bread into Jalix bags, ready for dispatch",
        "Keep the production area clean and organised throughout shifts",
        "Support loading and unloading of ingredients and finished goods as needed",
      ],
      requirements: [
        "No prior bakery experience required — training provided",
        "Willing to work on your feet in a hands-on production role",
        "Reliable, punctual and able to work as part of a team",
        "Comfortable with early shifts",
      ] },
    { slug: "mixer-operator", title: "Mixer Operator", type: "Full-time", location: "Umuahia, Abia State",
      summary: "Operate and maintain our dough mixing equipment, ensuring every batch meets Ajalisco's consistency and quality standards.",
      responsibilities: [
        "Measure and combine ingredients according to standard recipes",
        "Operate industrial mixers safely and correctly",
        "Monitor dough consistency and flag issues early",
        "Carry out basic cleaning and maintenance checks on mixing equipment",
      ],
      requirements: [
        "Experience operating industrial mixing or food-production equipment is an advantage",
        "Comfortable following precise measurements and recipes",
        "Basic mechanical aptitude for routine equipment checks",
        "Physically able to lift and handle ingredient sacks",
      ] },
    { slug: "loader", title: "Loader", type: "Full-time", location: "Umuahia, Abia State",
      summary: "Handle the loading, unloading and safe movement of finished water and bread products between production, storage and distribution vehicles.",
      responsibilities: [
        "Load and unload delivery vehicles safely and efficiently",
        "Move finished goods between production, storage and dispatch areas",
        "Check outgoing loads against delivery notes for accuracy",
        "Keep loading bays and storage areas tidy and hazard-free",
      ],
      requirements: [
        "Physically fit and comfortable with manual handling",
        "Reliable and punctual, able to work early or flexible shifts",
        "Basic literacy for checking delivery notes and stock sheets",
        "Teamwork and safety-conscious attitude",
      ] },
  ];
  const JOB_BY_SLUG = Object.fromEntries(JOBS.map((j) => [j.slug, j]));

  /* ------------------------------------------------------------------
     Blog — mirrors the real posts already published at
     ajaliscogroup.com (fetched via the WordPress REST API), so this
     preview matches the live blog content exactly rather than using
     placeholder copy.
  ------------------------------------------------------------------ */
  const POSTS = [
    {
      slug: "hydration-myths-busted",
      title: "Hydration Myths Busted: Expert Advice on Staying Hydrated in Nigeria",
      date: "2025-07-15",
      image: "assets/blog-hydration.webp",
      excerpt: "In Nigeria\u2019s tropical climate, staying hydrated isn\u2019t just a health suggestion \u2014 it\u2019s a daily survival strategy . With scorching heat in the North,\u2026",
      readMins: 4,
      content: `<p>In Nigeria’s tropical climate, <strong>staying hydrated</strong> isn’t just a health suggestion — it’s a <strong>daily survival strategy</strong>. With scorching heat in the North, high humidity in the South, and intense outdoor activity across the country, millions of Nigerians sweat more than they realize. But here’s the catch: <strong>many people are unknowingly dehydrated</strong>, even while holding a bottle or sachet of water.</p>

<p>In this article, we’ll clear the air on <strong>common hydration myths</strong>, share expert advice from a Nigerian <strong>sports coach</strong> and <strong>dermatologist</strong>, and explain why <strong>Ajalisco Premium Water</strong> is the smart hydration choice for your health, skin, and daily energy levels.</p>

<h3 class="wp-block-heading">Myth #1: “If I’m Not Thirsty, I Don’t Need Water”</h3>

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><strong>Expert Insight (Coach David Olawale, Lagos)</strong><br>“Thirst is a <strong>late-stage signal</strong>. By the time you feel thirsty, your body has already lost about 1–2% of its total water. That can affect focus, mood, and muscle function — especially in hot environments like Nigeria.”</p>
</blockquote>

<p><strong>Truth:</strong> Your body needs water consistently throughout the day. Don&#8217;t wait for thirst to hit. Schedule water breaks every 1–2 hours, especially if you work outdoors or commute long distances.</p>

<p><strong>Pro Tip:</strong> Keep <strong>Ajalisco Premium Water sachets or bottles</strong> in your bag, car, or office. The convenient packaging makes it easy to sip consistently without overpaying for water.</p>

<h3 class="wp-block-heading">Myth #2: “Energy Drinks or Soft Drinks Can Replace Water”</h3>

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><strong>Dr. Uchechi Eze, Dermatologist (Enugu):</strong><br>“Sugar-packed drinks cause <strong>water loss</strong> instead of hydration. They make your kidneys work harder, and the excess sugar pulls fluid away from your skin and cells.”</p>
</blockquote>

<p><strong>Truth:</strong> While they may quench your immediate thirst, fizzy drinks and energy drinks often <strong>worsen dehydration</strong>. For real hydration, nothing beats clean, pure water.</p>

<p><strong>Ajalisco Water</strong> is:</p>

<ul class="wp-block-list">
<li><strong>NAFDAC-approved</strong></li>

<li><strong>Filtered using multi-stage purification</strong></li>

<li><strong>Free from sugar, additives, and chemicals</strong></li>
</ul>

<p>Perfect for daily hydration without any health risks.</p>

<h3 class="wp-block-heading">Myth #3: “I Don’t Need Much Water Because I Don’t Sweat”</h3>

<p>Many people assume that only athletes or outdoor workers need to drink lots of water. But even <strong>sitting in traffic</strong>, <strong>working indoors</strong>, or <strong>sleeping in a hot room</strong> can lead to fluid loss through <strong>breathing</strong>, <strong>urination</strong>, and <strong>sweating</strong> — even if you don’t feel it.</p>

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><strong>Coach David:</strong> “You lose water <strong>all day</strong>, even when resting. If you wait until you’re sweating buckets, you’ve already dipped into dehydration.”</p>
</blockquote>

<p><strong>Solution:</strong> Make it a habit to drink water <strong>before</strong> you&#8217;re thirsty. Start your day with one sachet or glass of Ajalisco water and drink small amounts steadily.</p>

<h3 class="wp-block-heading">Myth #4: “Drinking Too Much Water Is Harmful”</h3>

<p>Yes, overhydration is real, but it’s extremely rare — and usually only a risk when people chug gallons at once. For the average Nigerian adult, the body easily regulates water through sweat and urination.</p>

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><strong>Dr. Uchechi:</strong> “For healthy individuals, the kidneys are excellent at removing excess water. As long as you space your intake across the day, there’s no harm in drinking more water.”</p>
</blockquote>

<p><strong>Ideal Intake:</strong></p>

<ul class="wp-block-list">
<li><strong>Men</strong>: 3.0–3.5 liters per day</li>

<li><strong>Women</strong>: 2.5–3.0 liters per day</li>

<li><strong>Children</strong>: At least 5–8 sachets of water depending on activity level and age</li>
</ul>

<h3 class="wp-block-heading">Myth #5: “My Skin Creams Keep My Skin Hydrated”</h3>

<p>External moisturizers help seal moisture in, but <strong>true skin hydration starts from within</strong>.</p>

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><strong>Dr. Uchechi:</strong> “If your water intake is poor, no cream can replace what’s missing internally. Dehydrated skin looks dull, flakes easily, and reacts more to sunlight.”</p>
</blockquote>

<p><strong>What to do:</strong> Drink <strong>Ajalisco Premium Water</strong> consistently — your skin will become clearer, more elastic, and resistant to harsh weather. Combine it with sunscreen and a light moisturizer for best results.</p>

<h3 class="wp-block-heading">Bonus Tip: Build a Hydration Habit (The “3-3-3 Rule”)</h3>

<p>To stay hydrated effortlessly, follow this:</p>

<ul class="wp-block-list">
<li><strong>3 cups (or sachets) by noon</strong></li>

<li><strong>3 sachets between lunch and dinner</strong></li>

<li><strong>3 sachets before bedtime (early enough to not disrupt sleep)</strong></li>
</ul>

<p>Using <strong>Ajalisco sachet water</strong>, this adds up to just over 1.5 liters per day — a great baseline for most adults, especially during hot seasons.</p>

<h3 class="wp-block-heading">Why Choose Ajalisco Premium Water?</h3>

<p>Whether you’re in school, at work, at the gym, or on the road — Ajalisco Premium Water gives you:</p>

<ul class="wp-block-list">
<li><strong>NAFDAC certification</strong></li>

<li><strong>ISO-compliant purity</strong></li>

<li><strong>Affordable packaging for all lifestyles</strong></li>

<li><strong>Available in sachets, bottles, and cartons</strong></li>

<li><strong>Nationwide distribution with consistent quality</strong></li>
</ul>

<p>With <strong>Ajalisco</strong>, hydration is no longer a challenge — it’s a lifestyle.</p>

<h2 class="wp-block-heading">Final Thoughts</h2>

<p>Dehydration doesn&#8217;t always look dramatic — sometimes it’s just fatigue, dull skin, or low concentration. Don’t wait for signs. Stay ahead with smart hydration. Bust the myths. Drink smart. <strong>Choose Ajalisco.</strong></p>`,
    },
    {
      slug: "quality-matters-testing-protocol",
      title: "Quality Matters: Our Multi\u2011Stage Testing Protocol for Sachet and Bottled Water",
      date: "2025-07-15",
      image: "assets/blog-quality.webp",
      excerpt: "In Nigeria\u2019s fast-growing bottled and sachet water industry, not all water is created equal. While clear packaging may give the illusion of purity,\u2026",
      readMins: 4,
      content: `<p>In Nigeria’s fast-growing bottled and sachet water industry, not all water is created equal. While clear packaging may give the illusion of purity, true water quality goes far beyond appearances. At Ajalisco Production Industries, we understand that every drop matters — and that’s why we have invested in world-class laboratory testing, modern machinery, and a team of certified experts to ensure that Ajalisco Premium Water is not just clean, but certified safe for everyday consumption.</p>

<p>In this article, we’ll take you behind the scenes of our multi-stage quality testing protocol — the very system that ensures every sachet and bottle of Ajalisco Water you drink is trusted, traceable, and completely pure.</p>

<h3 class="wp-block-heading">1. Water Quality Begins with Sourcing</h3>

<p>Our commitment to quality starts long before filtration. We extract water from deep, geologically verified boreholes on our premises. These boreholes are lined, sealed, and monitored for:</p>

<ul class="wp-block-list">
<li>Turbidity (clarity)</li>

<li>Mineral concentration</li>

<li>Microbial presence</li>
</ul>

<p>Samples from each borehole undergo monthly geological and microbiological testing to ensure no contaminants seep into the source.</p>

<h3 class="wp-block-heading">2. Multi-Stage Filtration &amp; Purification</h3>

<p>Once extracted, raw water is directed through our <strong>closed-loop filtration system</strong>, which includes:</p>

<h4 class="wp-block-heading">🌀 a. Sand and Sediment Filters</h4>

<p>Removes large particles like sand, dirt, and rust.</p>

<h4 class="wp-block-heading">🧪 b. Activated Carbon Filters</h4>

<p>Eliminates chlorine, odor-causing compounds, and organic residues.</p>

<h4 class="wp-block-heading">💠 c. Microfiltration Membrane</h4>

<p>Traps microscopic particles and bacteria that pass through earlier filters.</p>

<h4 class="wp-block-heading">🔄 d. Reverse Osmosis (RO)</h4>

<p>This high-pressure system removes up to <strong>99% of dissolved solids</strong>, heavy metals, nitrates, and harmful chemicals.</p>

<h4 class="wp-block-heading">🔬 e. UV Light Sterilization</h4>

<p>Neutralizes remaining bacteria and viruses without altering taste.</p>

<h4 class="wp-block-heading">🌬️ f. Ozonation</h4>

<p>Our final stage introduces food-grade ozone, a powerful natural disinfectant that stabilizes the water for safe packaging.</p>

<p>Each filtration stage is connected to <strong>real-time sensors</strong> that monitor:</p>

<ul class="wp-block-list">
<li>pH balance</li>

<li>TDS (Total Dissolved Solids)</li>

<li>Temperature</li>

<li>Flow rate</li>
</ul>

<p>If any parameter moves out of range, our system automatically halts production to prevent compromised water from reaching packaging.</p>

<h3 class="wp-block-heading">3. In-House Laboratory Testing</h3>

<p>Ajalisco’s quality control team includes:</p>

<ul class="wp-block-list">
<li><strong>Certified microbiologists</strong></li>

<li><strong>Food safety officers</strong></li>

<li><strong>Chemical analysts</strong></li>
</ul>

<p>Every batch of sachet and bottled water is tested using:</p>

<ul class="wp-block-list">
<li><strong>Turbidity meters</strong></li>

<li><strong>Coliform presence kits</strong></li>

<li><strong>pH meters</strong></li>

<li><strong>AAS (Atomic Absorption Spectrophotometers)</strong> for heavy metal detection</li>

<li><strong>TDS/conductivity meters</strong></li>
</ul>

<p>We conduct:</p>

<ul class="wp-block-list">
<li><strong>Daily tests</strong> on pH, turbidity, and microbial activity</li>

<li><strong>Weekly tests</strong> for heavy metals (lead, mercury, arsenic)</li>

<li><strong>Monthly third-party tests</strong> for compliance with <strong>NAFDAC and SON standards</strong></li>
</ul>

<h3 class="wp-block-heading">4. Staff Expertise and Training</h3>

<p>At Ajalisco, quality assurance isn’t just a department — it’s a culture. Our team undergoes:</p>

<ul class="wp-block-list">
<li><strong>Quarterly HACCP (Hazard Analysis Critical Control Point)</strong> training</li>

<li><strong>ISO 22000 food safety management workshops</strong></li>

<li>Emergency response drills for contamination alerts</li>

<li>Equipment handling and calibration refreshers every 3 months</li>
</ul>

<p>We also conduct <strong>surprise audits</strong> and <strong>cross-inspections between departments</strong> to minimize human error and ensure transparency.</p>

<h3 class="wp-block-heading">5. Packaging with Precision</h3>

<p>Once water is tested and approved, it flows through <strong>fully automated filling lines</strong> for:</p>

<ul class="wp-block-list">
<li><strong>Sachet water</strong></li>

<li><strong>500ml and 750ml PET bottled water</strong></li>

<li><strong>1.5L family-size bottles</strong></li>
</ul>

<p>Each machine is:</p>

<ul class="wp-block-list">
<li><strong>UV sterilized</strong> before each production run</li>

<li><strong>Temperature-monitored</strong> to ensure heat-seal quality</li>

<li><strong>Batch-coded</strong> for traceability (including time, date, and shift)</li>
</ul>

<p>Our packaging films and PET bottles are <strong>food-grade</strong>, <strong>BPA-free</strong>, and certified by Nigeria’s SONCAP (Standards Organization of Nigeria Conformity Assessment Program).</p>

<h3 class="wp-block-heading">6. Final Product Holding &amp; External Testing</h3>

<p>Before leaving our facility:</p>

<ul class="wp-block-list">
<li>Products are held in <strong>sanitized storage rooms</strong> with temperature and humidity control.</li>

<li>Batches are randomly selected and <strong>sent to NAFDAC-certified laboratories</strong> to verify all parameters.</li>
</ul>

<p>We also maintain a <strong>Customer Feedback and Reporting Desk</strong>, where any product issue can be traced back to the <strong>exact machine, operator, and batch</strong> for correction.</p>

<h3 class="wp-block-heading">Why This Matters to You</h3>

<p>Whether you buy a sachet at a roadside kiosk or a bottle in a supermarket, <strong>you deserve to know that your water is safe</strong>. At Ajalisco, our mission is simple:</p>

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>Deliver clean, affordable, and truly safe water — every single time.</p>
</blockquote>

<p>That’s why schools, hospitals, offices, and families across Nigeria trust <strong>Ajalisco Premium Water</strong> for hydration that’s backed by science, not just claims.</p>

<h2 class="wp-block-heading">Final Thoughts</h2>

<p>Water is life — but only <strong>safe water</strong> sustains life. With our <strong>multi-layered filtration</strong>, <strong>advanced lab testing</strong>, and <strong>world-class staff</strong>, Ajalisco Premium Water leads the way in Nigeria’s packaged water industry. Every sip is proof of our promise: <strong>purity, quality, and care</strong> — from source to seal.</p>`,
    },
    {
      slug: "inside-our-factory",
      title: "Inside Our Factory: How Ajalisco Ensures 100% Pure Sachet Water",
      date: "2025-07-15",
      image: "assets/blog-factory.webp",
      excerpt: "At Ajalisco Production Industries, purity is not just a promise \u2014 it\u2019s a process. In an industry where trust and health are closely tied to what\u2026",
      readMins: 4,
      content: `<p>At Ajalisco Production Industries, purity is not just a promise — it’s a process. In an industry where trust and health are closely tied to what people consume daily, we understand that ensuring clean, safe, and high-quality drinking water is not negotiable. That’s why every sachet of Ajalisco Premium Water undergoes a rigorous journey from sourcing to sealing, guided by strict hygiene standards, state-of-the-art technology, and full NAFDAC compliance.</p>

<p>In this article, we’ll walk you through what happens behind the scenes at our water production facility — from the moment raw water is sourced to when it’s delivered to your hand in a crystal-clear sachet.</p>

<h3 class="wp-block-heading">Step 1: Sourcing from Trusted Water Sources</h3>

<p>Our journey begins with sourcing. Ajalisco only extracts raw water from <strong>certified boreholes</strong> located on our industrial premises. These sources are routinely tested to meet the <strong>World Health Organization (WHO)</strong> and <strong>Nigeria’s NAFDAC</strong> minimum safety standards. The borehole system is equipped with submersible pumps that deliver raw water directly to our treatment facility via sealed stainless-steel pipelines — preventing contamination at the very first stage.</p>

<h3 class="wp-block-heading">Step 2: Multi-Stage Filtration and Purification</h3>

<p>Once the water enters the plant, it undergoes a <strong>multi-stage purification process</strong> designed to eliminate physical impurities, organic contaminants, harmful microorganisms, and undesirable tastes or odors. Here&#8217;s a simplified breakdown of that journey:</p>

<ol class="wp-block-list">
<li><strong>Sediment Filtration</strong><br>The first layer of protection. Sand filters remove visible particles like dust, rust, and mud, ensuring the water is visually clear and physically stable.</li>

<li><strong>Activated Carbon Filtration</strong><br>Next, the water passes through activated carbon filters to remove chlorine, volatile organic compounds (VOCs), and unpleasant odors or tastes.</li>

<li><strong>Microfiltration &amp; Reverse Osmosis (RO)</strong><br>A precision membrane system filters out bacteria, viruses, and dissolved salts. Reverse osmosis ensures the water meets pharmaceutical-grade purity levels.</li>

<li><strong>Ultraviolet (UV) Sterilization</strong><br>As an added line of defense, water is exposed to UV rays that deactivate any remaining microorganisms without the use of chemicals.</li>

<li><strong>Ozonation</strong><br>Finally, a controlled dose of ozone gas is infused into the water. Ozone acts as a natural disinfectant and helps stabilize the water during storage.</li>
</ol>

<p>Each phase is <strong>fully automated</strong> and monitored using industrial-grade sensors. If any value strays from the safe range, the system immediately flags and halts the batch.</p>

<h3 class="wp-block-heading">Step 3: Laboratory Testing &amp; Quality Assurance</h3>

<p>Ajalisco employs an in-house team of trained microbiologists and water technologists who <strong>test samples from every batch</strong>, ensuring consistency and safety. The lab checks for:</p>

<ul class="wp-block-list">
<li>pH balance</li>

<li>Total dissolved solids (TDS)</li>

<li>Microbial activity</li>

<li>Heavy metal presence</li>

<li>Taste, smell, and appearance</li>
</ul>

<p>Only water that passes all parameters proceeds to the packaging stage. We also send routine samples to <strong>third-party laboratories</strong> for independent analysis.</p>

<h3 class="wp-block-heading">Step 4: Hygienic Sachet Packaging</h3>

<p>Once purified, the water is transferred through <strong>closed-loop, stainless-steel lines</strong> to the automatic sachet filling machines. These machines:</p>

<ul class="wp-block-list">
<li>Fill, seal, and batch-label each sachet</li>

<li>Use <strong>food-grade LDPE film</strong> pre-tested for BPA-free compliance</li>

<li>Seal at high temperatures to prevent leakage and external exposure</li>
</ul>

<p>Staff working in this zone wear <strong>sterile gear</strong>, including gloves, face masks, aprons, and hairnets. The environment is air-conditioned, sanitized regularly, and entry is restricted.</p>

<p>Each sachet is batch-coded with a <strong>production date and expiration date</strong>, and once sealed, they&#8217;re packed into branded cartons and stored in temperature-controlled holding areas before distribution.</p>

<h3 class="wp-block-heading">Step 5: NAFDAC Registration and Compliance</h3>

<p>Ajalisco Premium Water is <strong>fully registered with NAFDAC</strong> and bears the official registration number clearly printed on each sachet and carton. Our facility is inspected periodically by NAFDAC officials to ensure ongoing compliance with:</p>

<ul class="wp-block-list">
<li>Good Manufacturing Practices (GMP)</li>

<li>Environmental hygiene standards</li>

<li>Documentation and traceability</li>

<li>Employee health and safety policies</li>
</ul>

<p>Our factory is also aligned with <strong>ISO 22000 food safety standards</strong>, giving us an edge in quality and consumer confidence.</p>

<h3 class="wp-block-heading">Distribution &amp; Customer Feedback</h3>

<p>After approval, the sachets are loaded onto Ajalisco’s branded delivery vehicles and sent to distributors, supermarkets, schools, hospitals, and homes across Nigeria. We maintain a strong relationship with our partners to gather feedback, improve our processes, and uphold product freshness.</p>

<p>We’ve also integrated a customer care line and QR code system for consumers to verify authenticity or report concerns — because transparency is part of the purity promise.</p>

<h3 class="wp-block-heading">Final Thoughts: Purity is Our Reputation</h3>

<p>At Ajalisco Production Industries, we don’t just sell water — we deliver <strong>hydration you can trust</strong>. Every single sachet is a result of science, diligence, and our unwavering commitment to public health. That’s why families, schools, and businesses across Nigeria choose Ajalisco Premium Water — clean, crisp, and crafted with care.</p>

<p>So, the next time you enjoy a cool sachet of Ajalisco, you’ll know exactly what went into making it the best.</p>`,
    },
  ];
  const POST_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p]));
  const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });

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

  /* --------------------------- Careers ---------------------------- */
  const pin = `<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Zm0-8.4a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"/></svg>`;
  function renderCareers() {
    const host = $("[data-jobs]"); if (!host) return;
    host.innerHTML = JOBS.map((j, i) => `
      <button type="button" class="job rv" style="--i:${i % 3}" data-view-job="${j.slug}">
        <span class="job__tag">${esc(j.type)}</span>
        <h3>${esc(j.title)}</h3>
        <p class="job__loc">${pin} ${esc(j.location)}</p>
        <p class="job__sum">${esc(j.summary)}</p>
        <span class="job__link">View role &amp; apply →</span>
      </button>`).join("");
    requestAnimationFrame(() => watch(host));
  }
  const jobModal = $("#jobModal"), jobBody = $("[data-job-body]");
  function openJobDetail(slug) {
    const j = JOB_BY_SLUG[slug]; if (!j) return;
    jobBody.innerHTML = `
      <button class="modal__close" type="button" data-close aria-label="Close">×</button>
      <div class="jobview">
        <span class="job__tag">${esc(j.type)}</span>
        <h2 id="jobModalTitle">${esc(j.title)}</h2>
        <p class="job__loc">${pin} ${esc(j.location)}</p>
        <p class="jobview__sum">${esc(j.summary)}</p>
        <h3>Responsibilities</h3>
        <ul class="jobview__list">${j.responsibilities.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        <h3>What we're looking for</h3>
        <ul class="jobview__list">${j.requirements.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        <button class="btn btn--green btn--lg btn--block" type="button" data-show-apply="${j.slug}">Apply for this role</button>
      </div>`;
    if (!jobModal.open) jobModal.showModal();
  }
  function showApplyForm(slug) {
    const j = JOB_BY_SLUG[slug]; if (!j) return;
    jobBody.innerHTML = `
      <button class="modal__close" type="button" data-close aria-label="Close">×</button>
      <div class="jobapply">
        <button class="jobapply__back" type="button" data-back-job="${j.slug}">← Back to role details</button>
        <h2 id="jobModalTitle">Apply — ${esc(j.title)}</h2>
        <form class="form" data-form="careers" novalidate>
          <input type="hidden" name="position" value="${esc(j.title)}">
          <div class="field"><input id="jName" name="name" type="text" placeholder=" " autocomplete="name" required><label for="jName">Full Name</label></div>
          <div class="field"><input id="jEmail" name="email" type="email" placeholder=" " autocomplete="email" required><label for="jEmail">Email</label></div>
          <div class="field"><input id="jPhone" name="phone" type="tel" placeholder=" " autocomplete="tel" required><label for="jPhone">Phone Number</label></div>
          <div class="field"><textarea id="jMsg" name="message" placeholder=" " rows="4"></textarea><label for="jMsg">Why you're a great fit (optional)</label></div>
          <div class="field--file">
            <label class="field__file" for="jResume">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/></svg>
              <span data-file-label>Upload Resume / CV <small>(optional · PDF or Word, max 5MB)</small></span>
            </label>
            <input id="jResume" name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden>
          </div>
          <button class="btn btn--green btn--lg btn--block" type="submit">Submit Application</button>
          <p class="form__hint">Preview only on this test site — on your live site this sends the application straight to your hiring inbox.</p>
        </form>
      </div>`;
    const form = $("form", jobBody);
    form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));
    const resume = $("#jResume", form), resumeLabel = $("[data-file-label]", form);
    resume.addEventListener("change", () => {
      const file = resume.files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        toast("That file is over 5MB — please choose a smaller resume.", "err");
        resume.value = ""; return;
      }
      resumeLabel.innerHTML = file ? `${esc(file.name)} selected ✓` : `Upload Resume / CV <small>(optional · PDF or Word, max 5MB)</small>`;
      resume.closest(".field--file").classList.toggle("has-file", !!file);
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let bad = 0;
      $$("[required]", form).forEach((inp) => {
        const empty = !inp.value.trim(), badMail = inp.type === "email" && inp.value && !emailOK(inp.value.trim());
        inp.closest(".field")?.classList.toggle("invalid", empty || badMail); if (empty || badMail) bad++;
      });
      if (bad) { toast("Please fill in the highlighted fields.", "err"); $(".invalid input, .invalid textarea", form)?.focus(); return; }
      toast(`Preview only — on your live site this submits your application for ${j.title} to our hiring team.`);
      jobModal.close();
    });
  }
  document.addEventListener("click", (e) => {
    const view = e.target.closest("[data-view-job]"); if (view) { openJobDetail(view.dataset.viewJob); return; }
    const apply = e.target.closest("[data-show-apply]"); if (apply) { showApplyForm(apply.dataset.showApply); return; }
    const back = e.target.closest("[data-back-job]"); if (back) { openJobDetail(back.dataset.backJob); return; }
  });
  jobModal.addEventListener("click", (e) => { if (e.target === jobModal) jobModal.close(); });

  /* --------------------------- CTA banners ----------------------- */
  function renderCta(el) {
    const c = JSON.parse(el.dataset.cta);
    el.innerHTML = `<div class="cta rv"><div class="bubbles bubbles--sm" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <h2>Proudly Made in Nigeria, Trusted by <span>Thousands</span></h2>
      <p>Let’s bring clean water and fresh bread to more homes in Nigeria.</p>
      <div class="btn-row btn-row--center"><a class="btn btn--green btn--lg" href="${c.primary[1]}">${c.primary[0]}</a>${c.secondary ? `<a class="btn btn--ghost-light btn--lg" href="${c.secondary[1]}">${c.secondary[0]}</a>` : ""}</div></div>`;
  }
  $$("[data-cta]").forEach(renderCta);

  /* ------------------------------ Blog ---------------------------- */
  function blogCardHTML(post, i) {
    return `<a class="post rv" style="--i:${i % 3}" href="#/post/${post.slug}">
      <div class="post__img"><img src="${post.image}" alt="" loading="lazy"></div>
      <div class="post__body">
        <p class="post__meta">${fmtDate(post.date)} · ${post.readMins} min read</p>
        <h3>${esc(post.title)}</h3>
        <p>${esc(post.excerpt)}</p>
        <span class="more">Read More <b aria-hidden="true">→</b></span>
      </div>
    </a>`;
  }
  function renderHomePosts() {
    const host = $("[data-home-posts]"); if (!host) return;
    host.innerHTML = POSTS.map(blogCardHTML).join("");
  }
  function renderBlog() {
    const host = $("[data-blog-posts]"); if (!host) return;
    host.innerHTML = POSTS.length ? POSTS.map(blogCardHTML).join("") : `<p class="ajx-jobs__empty">No posts yet — please check back soon.</p>`;
  }
  function renderPost(slug) {
    const p = POST_BY_SLUG[slug]; if (!p) { location.hash = "#/blog"; return; }
    document.title = `${p.title} — Ajalisco Production Industries Limited`;
    const related = POSTS.filter((x) => x.slug !== slug).slice(0, 2);
    $("#postView").innerHTML = `
      <div class="post-hero" style="background-image:linear-gradient(180deg, rgba(10,20,50,.15), rgba(10,20,50,.88)), url('${p.image}')">
        <div class="wrap post-hero__inner">
          <a class="post-hero__back rv" href="#/blog">← Back to Blog</a>
          <h1 class="rv" style="--i:1">${esc(p.title)}</h1>
          <p class="post-hero__meta rv" style="--i:2">${fmtDate(p.date)} · ${p.readMins} min read</p>
        </div>
      </div>
      <section class="section section--tight">
        <div class="wrap">
          <div class="post-body rv">${p.content}</div>
        </div>
      </section>
      ${related.length ? `
      <section class="section section--gray">
        <div class="wrap">
          <div class="head-center"><p class="kicker kicker--center rv">Keep Reading</p><h2 class="title rv">You might also like</h2></div>
          <div class="posts">${related.map(blogCardHTML).join("")}</div>
        </div>
      </section>` : ""}
      <section class="wrap cta-wrap" data-cta='{"primary":["Become a Distributor","#/partnership"]}'></section>`;
    $$("#postView [data-cta]").forEach(renderCta);
  }

  /* ------------------------------ Router ------------------------- */
  const ROUTES = ["home", "shop", "partnership", "about", "blog", "post", "careers", "contact", "cart", "product"];
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
    const navKey = page === "product" || page === "cart" ? "shop" : page === "post" ? "blog" : page;
    $$(".nav__links a[data-route]").forEach((a) => a.classList.toggle("active", a.dataset.route === navKey));
    setMenu(false);
    if (page === "product") renderProduct(parts[1]);
    if (page === "cart") renderCartPage();
    if (page === "shop") renderGrid("shop");
    if (page === "post") renderPost(parts[1]);
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
  renderGrid("home"); renderGrid("shop"); renderPicker(); renderCareers(); renderHomePosts(); renderBlog(); refreshCart(); route();

  const loader = $("#loader"), barEl = $("#loaderBar"), num = $("#loaderNum");
  let p = 0;
  const finish = () => { document.body.classList.add("ready"); loader.classList.add("done"); setTimeout(() => loader.remove(), 700); };
  if (reduce) finish();
  else {
    const t = setInterval(() => { p = Math.min(100, p + 9 + Math.random() * 12); num.textContent = Math.floor(p); barEl.style.width = p + "%"; if (p >= 100) { clearInterval(t); setTimeout(finish, 250); } }, 70);
    setTimeout(() => { if (document.body.contains(loader)) finish(); }, 4000);
  }
})();
