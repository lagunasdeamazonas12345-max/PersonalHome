(function () {
  "use strict";

  var root = document.documentElement;

  // ---- Footer year --------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Fondo aurora: luces flotantes ---------------------------------------
  // Se crean UNA sola vez; la animación la hace el CSS (transform/opacity en
  // la GPU). No hay requestAnimationFrame ni trabajo de JS por frame.
  (function aura() {
    var box = document.getElementById("aura-dots");
    if (!box) return;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Equipo modesto: pocos núcleos, poca RAM o "ahorro de datos".
    var cores = navigator.hardwareConcurrency || 4;
    var mem = navigator.deviceMemory || 4;
    var saveData = navigator.connection && navigator.connection.saveData;
    var small = window.innerWidth < 640;
    var lite = cores <= 4 || mem <= 2 || saveData;
    if (lite) root.classList.add("aura-lite");

    // Original: 56 luces. Aquí: 22 en escritorio, 14 en celular, 9 en modo ligero.
    var count = lite ? 9 : small ? 14 : 22;

    // Generador pseudoaleatorio con semilla: el fondo se ve igual en cada visita.
    var t = 20261021;
    function rnd() {
      t += 0x6d2b79f5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var size = 4 + Math.pow(rnd(), 1.6) * 13;
      var wrap = document.createElement("div");
      wrap.className = "aura-dot";
      wrap.style.left = (rnd() * 100).toFixed(2) + "%";
      wrap.style.animationDuration = (24 + rnd() * 26).toFixed(1) + "s";
      wrap.style.animationDelay = (-rnd() * 50).toFixed(1) + "s";

      var core = document.createElement("span");
      core.className = "aura-dot-core";
      core.style.width = core.style.height = size.toFixed(1) + "px";
      core.style.setProperty("--drift", (10 + rnd() * 26).toFixed(1) + "px");
      core.style.setProperty("--alpha", (0.5 + rnd() * 0.5).toFixed(2));
      core.style.animationDuration = (5 + rnd() * 6).toFixed(1) + "s, " + (3 + rnd() * 4).toFixed(1) + "s";
      core.style.animationDelay = (-i * 0.7).toFixed(1) + "s, " + (-i * 0.4).toFixed(1) + "s";

      wrap.appendChild(core);
      frag.appendChild(wrap);
    }
    box.appendChild(frag);
  })();

  // ---- Pausar animaciones cuando la pestaña no se ve ------------------------
  document.addEventListener("visibilitychange", function () {
    root.classList.toggle("app-hidden", document.hidden);
  });

  // ---- Scroll reveal --------------------------------------------------------
  (function scrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach(function (el) { observer.observe(el); });

    // Hero content reveals immediately on load.
    var hero = document.querySelector('[data-reveal="hero"]');
    if (hero) requestAnimationFrame(function () { hero.classList.add("is-visible"); });
  })();

  // Nota: la descarga del APK no necesita JavaScript; el botón de index.html
  // es un <a href="assets/apks/..." download> y el navegador la maneja solo.
})();
