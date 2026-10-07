"use strict";
/* No innerHTML, eval or inline handlers, so the page works under a strict Content-Security-Policy. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Theme toggle */
  $("#theme-toggle")?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked */ }
  });

  /* Mobile menu */
  const nav = $("#site-nav");
  const menuBtn = $("#menu-toggle");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* Highlight the section in view */
  const links = $$("a", nav);
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.getAttribute("href") === "#" + en.target.id
        ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  $$("main section[id]").forEach(s => io.observe(s));

  /* Profile photo: show assets/profile.jpg if it exists, otherwise keep the initials */
  const img = $("#avatar-img");
  if (img) {
    const show = () => { img.hidden = false; $("#avatar")?.classList.add("has-photo"); };
    if (img.complete && img.naturalWidth > 0) show();
    else img.addEventListener("load", show, { once: true });
  }

  /* Diagram respects reduced motion */
  const net = $("#network");
  function syncMotion() {
    if (!net || typeof net.pauseAnimations !== "function") return;
    if (reduceMotion.matches) { net.pauseAnimations(); net.classList.add("paused"); }
    else { net.unpauseAnimations(); net.classList.remove("paused"); }
  }
  syncMotion();
  reduceMotion.addEventListener?.("change", syncMotion);

  /* Tabs (WAI-ARIA pattern) */
  $$("[data-tabs]").forEach(group => {
    const tabs = $$('[role="tab"]', group);
    function select(tab, focus) {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab, false));
      tab.addEventListener("keydown", e => {
        let n = null;
        if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[n], true); }
      });
    });
  });
})();
