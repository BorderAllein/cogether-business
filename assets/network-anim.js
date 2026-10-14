/* UNIVERSE-Netzwerk: vier Punkte wandern aus einem Knaeuel nacheinander auf die Ecken einer Raute; die Linien haengen von Anfang an an den Punkten. */
(function () {
  'use strict';
  var els = document.querySelectorAll('.mockup--network');
  if (!els.length) return;
  var P1 = [[13.33, 50], [50, 16.67], [50, 83.33], [86.67, 50]];   // Ecken der Raute (links, oben, unten, rechts)
  var P0 = [[27, 86], [66, 8], [36, 30], [80, 78]];                 // Chaos-Startpositionen
  var E = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 2]];                 // Kanten
  var DUR = 1100, STEP = 480;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function init(el) {
    var hubs = [].slice.call(el.querySelectorAll('.hub'));
    var svg = el.querySelector('svg');
    if (hubs.length !== 4 || !svg) return null;
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var lines = E.map(function () { var l = document.createElementNS(NS, 'line'); svg.appendChild(l); return l; });
    function draw(pos, prog) {
      pos.forEach(function (p, i) { hubs[i].style.left = p[0] + '%'; hubs[i].style.top = p[1] + '%'; });
      E.forEach(function (e, k) {
        var a = pos[e[0]], b = pos[e[1]], l = lines[k];
        l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]);
        l.style.opacity = (0.28 + 0.62 * prog).toFixed(2);
      });
    }
    function at(t) {
      var pos = P0.map(function (s, i) {
        var k = ease(Math.min(1, Math.max(0, (t - i * STEP) / DUR)));
        return [s[0] + (P1[i][0] - s[0]) * k, s[1] + (P1[i][1] - s[1]) * k];
      });
      var prog = Math.min(1, t / (DUR + STEP * 3));
      draw(pos, prog);
    }
    return { at: at, total: DUR + STEP * 3, draw: draw };
  }

  els.forEach(function (el) {
    var a = init(el);
    if (!a) return;
    if (reduce || !('IntersectionObserver' in window)) { a.at(a.total + 1); el.classList.add('is-complete'); return; }
    a.at(0);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        el.classList.add('is-active');
        var t0 = null;
        (function frame(ts) {
          if (t0 === null) t0 = ts;
          var t = ts - t0;
          a.at(t);
          if (t < a.total) requestAnimationFrame(frame); else { a.at(a.total + 1); el.classList.add('is-complete'); }
        })(performance.now());
      });
    }, { threshold: 0.55 });
    io.observe(el);
  });
})();
