(() => {
  const root = document.querySelector(".ajx-careers");
  if (!root || typeof ajxCareers === "undefined") return;

  const $ = (s, c = root) => c.querySelector(s);
  const $$ = (s, c = root) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const JOBS = Array.isArray(ajxCareers.jobs) ? ajxCareers.jobs : [];
  const JOB_BY_ID = Object.fromEntries(JOBS.map((j) => [String(j.id), j]));
  const pin = `<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Zm0-8.4a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"/></svg>`;
  const JOBS_PAGE_SIZE = 4;
  const viewAllUrl = root.dataset.viewAllUrl || "";
  // Two modes, chosen once, never mixed:
  //  - no view_all_url (the Careers page itself): a plain grid, every job.
  //  - view_all_url set (a teaser elsewhere, e.g. the homepage): capped to
  //    4, a horizontal slider, and a "View All" tile linking out.
  root.classList.toggle("ajx-careers--grid", !viewAllUrl);

  let toastT;
  function toast(msg, type = "ok") {
    const t = $("[data-ajx-toast]"); if (!t) return;
    t.textContent = msg; t.className = "ajx-toast show " + type;
    clearTimeout(toastT); toastT = setTimeout(() => (t.className = "ajx-toast"), 4600);
  }

  function jobCardHTML(j, i) {
    return `
      <button type="button" class="job" style="--i:${i % 4}" data-view-job="${j.id}">
        <span class="job__tag">${esc(j.type)}</span>
        <h3>${esc(j.title)}</h3>
        <p class="job__loc">${pin} ${esc(j.location)}</p>
        <p class="job__sum">${esc(j.summary)}</p>
        <span class="job__link">View role &amp; apply →</span>
      </button>`;
  }

  function viewAllTileHTML(hiddenCount) {
    return `<a href="${esc(viewAllUrl)}" class="job job--viewall">
      <span class="job--viewall__count">+${hiddenCount}</span>
      <span class="job--viewall__label">View All Roles</span>
    </a>`;
  }

  function renderJobs() {
    const host = $("[data-ajx-jobs]"); if (!host) return;
    if (!JOBS.length) { host.innerHTML = `<p class="ajx-jobs__empty">No open roles right now — please check back soon.</p>`; return; }
    if (!viewAllUrl) {
      host.innerHTML = JOBS.map(jobCardHTML).join("");
      return;
    }
    const visible = JOBS.slice(0, JOBS_PAGE_SIZE);
    const hiddenCount = JOBS.length - visible.length;
    host.innerHTML = visible.map(jobCardHTML).join("") + (hiddenCount > 0 ? viewAllTileHTML(hiddenCount) : "");
  }

  const jobModal = $("#ajxJobModal"), jobBody = $("[data-ajx-job-body]");

  function openJobDetail(id) {
    const j = JOB_BY_ID[id]; if (!j) return;
    jobBody.innerHTML = `
      <button class="modal__close" type="button" data-close aria-label="Close">×</button>
      <div class="jobview">
        <span class="job__tag">${esc(j.type)}</span>
        <h2 id="ajxJobModalTitle">${esc(j.title)}</h2>
        <p class="job__loc">${pin} ${esc(j.location)}</p>
        <p class="jobview__sum">${esc(j.summary)}</p>
        ${j.responsibilities.length ? `<h3>Responsibilities</h3><ul class="jobview__list">${j.responsibilities.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        ${j.requirements.length ? `<h3>What we're looking for</h3><ul class="jobview__list">${j.requirements.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        <button class="btn btn--green btn--lg btn--block" type="button" data-show-apply="${j.id}">Apply for this role</button>
      </div>`;
    if (!jobModal.open) jobModal.showModal();
  }

  function showApplyForm(id) {
    const j = JOB_BY_ID[id]; if (!j) return;
    jobBody.innerHTML = `
      <button class="modal__close" type="button" data-close aria-label="Close">×</button>
      <div class="jobapply">
        <button class="jobapply__back" type="button" data-back-job="${j.id}">← Back to role details</button>
        <h2 id="ajxJobModalTitle">Apply — ${esc(j.title)}</h2>
        <form class="ajx-form" novalidate>
          <div class="ajx-hp" aria-hidden="true"><label for="ajxHp">Leave this field empty</label><input id="ajxHp" name="ajx_hp" type="text" tabindex="-1" autocomplete="off"></div>
          <div class="field"><input id="ajxName" name="name" type="text" placeholder=" " autocomplete="name" required><label for="ajxName">Full Name</label></div>
          <div class="field"><input id="ajxEmail" name="email" type="email" placeholder=" " autocomplete="email" required><label for="ajxEmail">Email</label></div>
          <div class="field"><input id="ajxPhone" name="phone" type="tel" placeholder=" " autocomplete="tel" required><label for="ajxPhone">Phone Number</label></div>
          <div class="field"><textarea id="ajxMsg" name="message" placeholder=" " rows="4"></textarea><label for="ajxMsg">Why you're a great fit (optional)</label></div>
          <div class="field--file">
            <label class="field__file" for="ajxResume">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/></svg>
              <span data-file-label>Upload Resume / CV <small>(optional · PDF or Word, max 5MB)</small></span>
            </label>
            <input id="ajxResume" name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden>
          </div>
          <button class="btn btn--green btn--lg btn--block" type="submit">Submit Application</button>
          <p class="form__hint" data-ajx-form-hint>Your application is emailed straight to our hiring team.</p>
        </form>
      </div>`;

    const form = $("form", jobBody);
    form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));

    const resume = $("#ajxResume", form), resumeLabel = $("[data-file-label]", form);
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

      const submitBtn = $('button[type="submit"]', form);
      submitBtn.disabled = true; submitBtn.textContent = "Sending…";

      const fd = new FormData(form);
      fd.append("action", "ajx_submit_application");
      fd.append("nonce", ajxCareers.nonce);
      fd.append("job_id", j.id);

      fetch(ajxCareers.ajaxUrl, { method: "POST", body: fd, credentials: "same-origin" })
        .then((r) => r.json())
        .then((res) => {
          if (res && res.success) {
            toast(res.data?.message || "Thanks! Your application has been sent.");
            jobModal.close();
          } else {
            toast(res?.data?.message || "Something went wrong — please try again.", "err");
            submitBtn.disabled = false; submitBtn.textContent = "Submit Application";
          }
        })
        .catch(() => {
          toast("Network error — please check your connection and try again.", "err");
          submitBtn.disabled = false; submitBtn.textContent = "Submit Application";
        });
    });
  }

  root.addEventListener("click", (e) => {
    const view = e.target.closest("[data-view-job]"); if (view) { openJobDetail(view.dataset.viewJob); return; }
    const apply = e.target.closest("[data-show-apply]"); if (apply) { showApplyForm(apply.dataset.showApply); return; }
    const back = e.target.closest("[data-back-job]"); if (back) { openJobDetail(back.dataset.backJob); return; }
    const close = e.target.closest("[data-close]"); if (close) { close.closest("dialog")?.close(); return; }
    const nav = e.target.closest("[data-jobs-nav]");
    if (nav) {
      const track = $("[data-ajx-jobs]");
      const card = track?.querySelector(".job");
      const step = card ? card.getBoundingClientRect().width + 22 : 320;
      track?.scrollBy({ left: step * parseInt(nav.dataset.jobsNav, 10), behavior: "smooth" });
    }
  });
  jobModal.addEventListener("click", (e) => { if (e.target === jobModal) jobModal.close(); });

  renderJobs();
})();
