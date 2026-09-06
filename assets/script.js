(function () {
  "use strict";

  // ---- Config -----------------------------------------------------------
  // Public Supabase storage bucket where the APK files are hosted.
  var SUPABASE_URL = "https://queeschxvtpizvdqxxgs.supabase.co";

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

  // ---- APK download --------------------------------------------------------
  (function downloads() {
    var buttons = document.querySelectorAll(".app-download");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var fileName = btn.getAttribute("data-file");
        var downloadName = btn.getAttribute("data-name") || fileName;
        var url = SUPABASE_URL + "/storage/v1/object/public/apks/" + fileName;
        var label = btn.querySelector(".btn-label");
        var originalLabel = label ? label.textContent : null;

        btn.classList.add("is-loading");
        if (label) label.textContent = "Descargando...";

        fetch(url)
          .then(function (res) {
            if (!res.ok) throw new Error("network");
            return res.blob();
          })
          .then(function (blob) {
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = blobUrl;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
          })
          .catch(function () {
            // Fallback: open the direct link so the browser handles the download.
            window.open(url, "_blank");
          })
          .finally(function () {
            btn.classList.remove("is-loading");
            if (label && originalLabel) label.textContent = originalLabel;
          });
      });
    });
  })();
})();
