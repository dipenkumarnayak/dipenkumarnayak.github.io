/* Runs in <head> before paint to avoid a theme flash. External file so CSP can forbid inline scripts. */
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
  } catch (e) { /* storage blocked: fall back to system preference */ }
})();
