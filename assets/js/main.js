/* ReFlo3D – kleine Helfer in Vanilla-JS. Keine Cookies, kein Tracking. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Header: transparent über dem Hero, solide beim Scrollen ---------- */
  var header = document.querySelector('[data-header]');
  if (header && !header.classList.contains('is-solid')) {
    var ticking = false;
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });
    updateHeader();
  }

  /* ---------- Burger-Menü (Vollbild-Overlay) ---------- */
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-menu]');
  if (burger && menu) {
    var lastFocus = null;
    var closeTimer = null;

    var focusables = function () {
      return [burger].concat(Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])')));
    };

    var openMenu = function () {
      clearTimeout(closeTimer);
      lastFocus = document.activeElement;
      menu.hidden = false;
      // Reflow, damit die Einblendung animiert
      void menu.offsetWidth;
      menu.classList.add('is-open');
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('is-locked');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Menü schließen');
      var first = menu.querySelector('a[href]');
      if (first) first.focus({ preventScroll: true });
    };

    var closeMenu = function (restoreFocus) {
      menu.classList.remove('is-open');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('is-locked');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Menü öffnen');
      closeTimer = setTimeout(function () { menu.hidden = true; }, reduceMotion.matches ? 0 : 350);
      if (restoreFocus !== false) (lastFocus && lastFocus !== document.body ? lastFocus : burger).focus({ preventScroll: true });
    };

    var isOpen = function () { return burger.getAttribute('aria-expanded') === 'true'; };

    burger.addEventListener('click', function () { isOpen() ? closeMenu() : openMenu(); });

    // Link geklickt: Menü schließen, Anker-Sprung passiert normal
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key === 'Tab') {
        // Fokus im Menü halten
        var items = focusables();
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) {
      if (mq.matches && isOpen()) closeMenu(false);
    });
  }

  /* ---------- Kennzahlen zählen beim Sichtbarwerden hoch ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion.matches) { el.textContent = String(target); return; }
    var duration = 1400 + Math.min(target, 100) * 6;
    var start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };
  if (counters.length) {
    if (hasIO && !reduceMotion.matches) {
      counters.forEach(function (el) { el.textContent = '0'; });
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // kurz warten, bis die Hero-Einblendung durch ist
            var el = entry.target;
            setTimeout(function () { runCounter(el); }, window.scrollY < 50 ? 1500 : 0);
            countObserver.unobserve(el);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- Weiche Einblendungen beim Scrollen ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (hasIO && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Zeitraffer-Video: nur mit Bewegung, sonst Poster ---------- */
  var video = document.querySelector('.feature-video');
  var toggle = document.querySelector('[data-video-toggle]');
  if (video && video.dataset.src && !reduceMotion.matches) {
    var userPaused = false;
    var failed = false;

    var setToggle = function (playing) {
      if (!toggle) return;
      toggle.setAttribute('aria-label', playing ? 'Video pausieren' : 'Video abspielen');
      var use = toggle.querySelector('use');
      if (use) use.setAttribute('href', playing ? '#i-pause' : '#i-play');
    };

    var fail = function () {
      // Video fehlt oder lässt sich nicht abspielen: Poster bleibt einfach stehen
      failed = true;
      if (toggle) toggle.hidden = true;
      video.removeAttribute('src');
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
    };

    var source = document.createElement('source');
    source.src = video.dataset.src;
    source.type = 'video/mp4';
    source.addEventListener('error', fail);
    video.appendChild(source);
    video.addEventListener('error', fail);
    video.addEventListener('playing', function () { if (!failed && toggle) { toggle.hidden = false; setToggle(true); } });
    video.addEventListener('pause', function () { setToggle(false); });

    var tryPlay = function () {
      if (failed || userPaused) return;
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* Autoplay blockiert: Poster bleibt */ });
    };

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (video.paused) { userPaused = false; tryPlay(); }
        else { userPaused = true; video.pause(); }
      });
    }

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (video.preload === 'none') { video.preload = 'auto'; video.load(); }
            tryPlay();
          } else if (!video.paused) {
            video.pause();
          }
        });
      }, { threshold: 0.25 }).observe(video);
    } else {
      video.preload = 'auto';
      video.load();
      tryPlay();
    }
  }

  /* ---------- Mobile Aktionsleiste: erst zeigen, wenn der Hero-Button weg ist ---------- */
  var bar = document.querySelector('[data-action-bar]');
  var heroCta = document.querySelector('[data-hero-cta]');
  if (bar && heroCta && hasIO) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        bar.classList.toggle('is-visible', past);
      });
    }, { threshold: 0 }).observe(heroCta);
  } else if (bar && !heroCta) {
    bar.classList.add('is-visible');
  }
})();
