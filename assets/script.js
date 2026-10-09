(function () {
  "use strict";

  // ---- Footer year --------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Starfield background ----------------------------------------------
  (function starField() {
    var canvas = document.getElementById("starfield");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width, height, raf;
    var dots = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      var count = Math.min(140, Math.floor((width * height) / 12000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 0.3,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * Math.PI * 2,
          s: Math.random() * 0.02 + 0.005
        });
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        d.a += d.s;
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;

        var alpha = 0.4 + Math.sin(d.a) * 0.4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    render();

    window.addEventListener("beforeunload", function () {
      cancelAnimationFrame(raf);
    });
  })();

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

  // Note: APK downloads no longer need JavaScript — the button in index.html
  // is a plain <a href="assets/apks/..." download> link, so the browser
  // handles the download natively. Nothing else to wire up here.
})();
