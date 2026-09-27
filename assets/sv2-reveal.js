/*
 * sv2Reveal(el, activate) — robust one-time viewport-entry trigger.
 *
 * Used by the diamond scatter->organize animations (and the chaos->system
 * bloom) on / and /start/. IntersectionObserver alone proved unreliable
 * in some real conditions, so this combines it with a rAF-throttled
 * scroll/resize fallback plus an immediate check for elements already
 * visible on load. Fires `activate(instant)` at most once, then removes
 * every listener it added.
 *
 * `activate(instant)` — instant=true means prefers-reduced-motion is on
 * and the caller should render the final state with no travel animation.
 */
(function () {
  function sv2Reveal(el, activate) {
    if (!el || typeof activate !== 'function') return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      activate(true);
      return;
    }

    var done = false;
    var ticking = false;
    var io = null;

    function fire() {
      if (done) return;
      done = true;
      activate(false);
      cleanup();
    }

    function check() {
      if (done) return;
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.8 && rect.bottom > vh * 0.15) {
        fire();
      }
    }

    // setTimeout-based throttle rather than requestAnimationFrame: rAF
    // is paced to the compositor and can be suspended in some render
    // contexts (backgrounded/occluded tabs, some embedded webviews)
    // even while scroll/resize events still fire — a plain timer keeps
    // the fallback working in those cases too.
    function onScroll() {
      if (ticking || done) return;
      ticking = true;
      setTimeout(function () {
        ticking = false;
        check();
      }, 100);
    }

    function cleanup() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (io) { io.disconnect(); io = null; }
    }

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) fire();
        });
      }, { threshold: [0.25, 0.3, 0.35, 0.4] });
      io.observe(el);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Covers the case where the element is already on screen at load
    // (short pages, deep-linked anchors, restored scroll position).
    check();
  }

  window.sv2Reveal = sv2Reveal;
})();
