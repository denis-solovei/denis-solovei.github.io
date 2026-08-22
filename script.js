(function () {
  "use strict";

  /* =================================================================
     i18n dictionary — EN / RU / UK
  ================================================================= */
  var dict = {
    en: {
      "hero.eyebrow": "AI Content Creator",
      "hero.title": "Photoreal product content,<br>engineered by AI.",
      "hero.sub": "A single phone photo, rebuilt into studio-grade commercial visuals — with exact geometry and zero artifacts.",
      "hero.cta": "See the work",

      "case1.title": "From phone to studio flatlay",
      "case1.desc": "A raw product photo, rebuilt into a clean studio flatlay — same geometry, same materials, gallery-grade light.",

      "case2.title": "One face, one product, any location",
      "case2.desc": "A single product shot becomes three lifestyle scenes — same model, same face, same product, zero drift.",

      "case3.title": "From cluttered shelf to boutique",
      "case3.desc": "A chaotic storefront, redesigned into a premium boutique — every original item kept, nothing invented.",

      "label.before": "BEFORE",
      "label.after": "AFTER",
      "grid.source": "SOURCE",
      "grid.scene1": "SCENE 1",
      "grid.scene2": "SCENE 2",
      "grid.scene3": "SCENE 3",

      "contacts.title": "Let's talk",
      "contacts.sub": "Open for collaborations.",

      "footer.text": "© 2026 Denis Solovei — AI Content Creator"
    },

    ru: {
      "hero.eyebrow": "AI Content Creator",
      "hero.title": "Фотореалистичный контент<br>для товаров — создан ИИ.",
      "hero.sub": "Превращаю одно фото с телефона в готовый коммерческий кадр студийного качества — без искажений формы и без артефактов.",
      "hero.cta": "Смотреть работы",

      "case1.title": "Из телефона — в студийный flatlay",
      "case1.desc": "Черновое фото товара превращается в чистый студийный flatlay — та же геометрия, те же материалы, свет как в галерее.",

      "case2.title": "Одно лицо, один товар, любая локация",
      "case2.desc": "Один кадр товара превращается в три lifestyle-сцены — та же модель, то же лицо, тот же товар, без искажений.",

      "case3.title": "Из хаотичной витрины — в бутик",
      "case3.desc": "Хаотичная витрина превращается в премиальный бутик — весь ассортимент сохранён, ничего не выдумано.",

      "label.before": "ДО",
      "label.after": "ПОСЛЕ",
      "grid.source": "ИСХОДНИК",
      "grid.scene1": "СЦЕНА 1",
      "grid.scene2": "СЦЕНА 2",
      "grid.scene3": "СЦЕНА 3",

      "contacts.title": "Давайте обсудим",
      "contacts.sub": "Доступен для сотрудничества.",

      "footer.text": "© 2026 Денис Соловей — AI Content Creator"
    },

    uk: {
      "hero.eyebrow": "AI Content Creator",
      "hero.title": "Фотореалістичний контент<br>для товарів — створений ШІ.",
      "hero.sub": "Перетворюю одне фото з телефону на готовий комерційний кадр студійної якості — без спотворень форми і без артефактів.",
      "hero.cta": "Переглянути роботи",

      "case1.title": "З телефону — у студійний flatlay",
      "case1.desc": "Чорнове фото товару перетворюється на чистий студійний flatlay — та сама геометрія, ті самі матеріали, світло як у галереї.",

      "case2.title": "Одне обличчя, один товар, будь-яка локація",
      "case2.desc": "Один кадр товару перетворюється на три lifestyle-сцени — та сама модель, те саме обличчя, той самий товар, без спотворень.",

      "case3.title": "З хаотичної вітрини — у бутик",
      "case3.desc": "Хаотична вітрина перетворюється на преміальний бутик — весь асортимент збережено, нічого не вигадано.",

      "label.before": "ДО",
      "label.after": "ПІСЛЯ",
      "grid.source": "ОРИГІНАЛ",
      "grid.scene1": "СЦЕНА 1",
      "grid.scene2": "СЦЕНА 2",
      "grid.scene3": "СЦЕНА 3",

      "contacts.title": "Поговорімо",
      "contacts.sub": "Відкритий для співпраці.",

      "footer.text": "© 2026 Денис Соловей — AI Content Creator"
    }
  };

  var STORAGE_KEY = "portfolio-lang";
  var supported = ["en", "ru", "uk"];

  /* =================================================================
     Language switching
  ================================================================= */
  function getSavedLang() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && supported.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage unavailable — ignore */ }
    return null;
  }

  function saveLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); }
    catch (e) { /* storage unavailable — ignore */ }
  }

  function detectInitialLang() {
    var saved = getSavedLang();
    if (saved) return saved;
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("ru") === 0) return "ru";
    if (nav.indexOf("uk") === 0) return "uk";
    return "en";
  }

  function applyLang(lang) {
    var entries = dict[lang] || dict.en;
    document.documentElement.setAttribute("lang", lang === "uk" ? "uk" : lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = entries[key];
      if (value === undefined) return;
      el.innerHTML = value;
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
    });

    saveLang(lang);
  }

  function initLangSwitch() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
    applyLang(detectInitialLang());
  }

  /* =================================================================
     Before / After compare sliders
  ================================================================= */
  function setupCompareSlider(root) {
    var frame = root.querySelector(".compare-frame");
    var after = root.querySelector(".compare-after");
    var handle = root.querySelector(".compare-handle");
    if (!frame || !after || !handle) return;

    var dragging = false;

    function setPosition(percent) {
      percent = Math.max(0, Math.min(100, percent));
      after.style.clipPath = "inset(0 " + (100 - percent) + "% 0 0)";
      handle.style.left = percent + "%";
      handle.setAttribute("aria-valuenow", Math.round(percent));
    }

    function percentFromClientX(clientX) {
      var rect = frame.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onPointerMove(e) {
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(percentFromClientX(clientX));
    }

    function stopDragging() {
      dragging = false;
    }

    function startDragging(e) {
      if (e.target.closest(".compare-expand")) return;
      dragging = true;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(percentFromClientX(clientX));
    }

    frame.addEventListener("mousedown", startDragging);
    frame.addEventListener("touchstart", startDragging, { passive: true });
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchend", stopDragging);

    handle.addEventListener("keydown", function (e) {
      var current = parseFloat(handle.style.left) || 50;
      if (e.key === "ArrowLeft") { setPosition(current - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPosition(current + 5); e.preventDefault(); }
    });
  }

  function initCompareSliders() {
    document.querySelectorAll("[data-compare]").forEach(setupCompareSlider);
  }

  /* =================================================================
     Lightbox — grid photos (with prev/next) and compare expand
  ================================================================= */
  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var stage = lightbox.querySelector(".lightbox-stage");
    var prevBtn = lightbox.querySelector("[data-lightbox-prev]");
    var nextBtn = lightbox.querySelector("[data-lightbox-next]");
    var lastTrigger = null;
    var group = [];
    var groupIndex = -1;

    function renderGroupImage(index) {
      groupIndex = (index + group.length) % group.length;
      var tile = group[groupIndex];
      stage.classList.remove("is-wide");
      stage.innerHTML = tile.innerHTML;
    }

    function updateNavVisibility() {
      var showNav = group.length > 1;
      prevBtn.hidden = !showNav;
      nextBtn.hidden = !showNav;
    }

    function openGroup(tiles, startIndex, trigger) {
      lastTrigger = trigger;
      group = tiles;
      renderGroupImage(startIndex);
      updateNavVisibility();
      show();
    }

    function openCompare(btn) {
      lastTrigger = btn;
      group = [];
      updateNavVisibility();
      stage.classList.add("is-wide");
      stage.innerHTML =
        '<div class="compare" data-compare>' +
          '<div class="compare-frame">' +
            '<div class="compare-img compare-before"><img src="' + btn.dataset.before + '" alt="' + btn.dataset.beforeAlt + '"></div>' +
            '<div class="compare-img compare-after" style="clip-path: inset(0 50% 0 0);"><img src="' + btn.dataset.after + '" alt="' + btn.dataset.afterAlt + '"></div>' +
            '<div class="compare-handle" style="left:50%;" tabindex="0" role="slider" aria-label="Before and after comparison" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><span class="handle-grip"></span></div>' +
          '</div>' +
        '</div>';
      setupCompareSlider(stage.querySelector("[data-compare]"));
      show();
    }

    function show() {
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox-close").focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll(".grid4").forEach(function (grid) {
      var tiles = Array.prototype.slice.call(grid.querySelectorAll("[data-lightbox]"));
      tiles.forEach(function (tile, i) {
        tile.addEventListener("click", function () { openGroup(tiles, i, tile); });
      });
    });

    document.querySelectorAll("[data-compare-expand]").forEach(function (btn) {
      btn.addEventListener("click", function () { openCompare(btn); });
    });

    prevBtn.addEventListener("click", function () { renderGroupImage(groupIndex - 1); });
    nextBtn.addEventListener("click", function () { renderGroupImage(groupIndex + 1); });

    lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (group.length > 1 && e.key === "ArrowLeft") renderGroupImage(groupIndex - 1);
      if (group.length > 1 && e.key === "ArrowRight") renderGroupImage(groupIndex + 1);
    });
  }

  /* =================================================================
     Scroll reveal
  ================================================================= */
  function initScrollReveal() {
    var items = document.querySelectorAll(".case");
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
  }

  /* =================================================================
     Init
  ================================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initCompareSliders();
    initLightbox();
    initScrollReveal();
  });
})();
