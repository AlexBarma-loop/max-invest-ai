/* ==========================================================================
   MAX Invest AI — interactions
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle + scroll state ---------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }
  if (navLinks) {
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("is-open");
    });
  }
  window.addEventListener("scroll", function () {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  });

  /* ---------- Round-up demo ---------- */
  var ruSlider = document.getElementById("ruSlider");
  function ceilToInt(n) { return Math.ceil(n - 1e-9); }
  function fmt(n) { return n.toFixed(2); }
  function updateRoundup() {
    var price = parseFloat(ruSlider.value) / 10; // 0.4 .. 19.5
    var rounded = ceilToInt(price);
    if (rounded === price) rounded += 1; // always invest something on whole numbers
    var diff = rounded - price;
    set("ruFrom", fmt(price));
    set("ruTo", fmt(rounded));
    set("ruDiff", fmt(diff));
    set("ruPriceLabel", fmt(price));
  }
  if (ruSlider) {
    ruSlider.addEventListener("input", updateRoundup);
    updateRoundup();
  }

  /* ---------- Dynamic fee meter ---------- */
  var feeSlider = document.getElementById("feeSlider");
  function updateFee() {
    var pct = parseInt(feeSlider.value, 10);             // 1..100 (round-up %)
    var fee = (5.5 - (pct - 1) / 99 * 5.0).toFixed(2);   // 5.50% at 1% .. 0.50% at 100%
    set("feeValue", fee + "%");
  }
  if (feeSlider) {
    feeSlider.addEventListener("input", updateFee);
    updateFee();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var ans = item.querySelector(".faq__a");
      var open = item.classList.toggle("is-open");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : null;
    });
  });

  /* ---------- Reveal on scroll + count-up + progress bars ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dur = 1100, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString("he-IL");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var t = entry.target;
      t.classList.add("in");
      t.querySelectorAll("[data-count]").forEach(countUp);
      t.querySelectorAll("[data-progress]").forEach(function (bar) {
        bar.style.width = bar.getAttribute("data-progress") + "%";
      });
      io.unobserve(t);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal, .hero").forEach(function (el) { io.observe(el); });

  /* ---------- Sign-up form validation (demo) ---------- */
  var form = document.getElementById("signupForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[data-required]").forEach(function (field) {
        var input = field.querySelector("input, select");
        var ok = input.value.trim() !== "";
        if (input.type === "email") ok = ok && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value);
        if (input.type === "tel") ok = ok && /^0\d{8,9}$/.test(input.value.replace(/[-\s]/g, ""));
        field.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });
      var success = document.getElementById("formSuccess");
      if (valid) {
        form.reset();
        if (success) {
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (success) {
        success.classList.remove("show");
      }
    });
    form.querySelectorAll("input, select").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".form-field").classList.remove("has-error");
      });
    });
  }

  function set(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
})();
