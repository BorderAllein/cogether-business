/* Produktansichten vergroessern + kurze Filme (nur Bereiche s1-s4 haben einen Film). Tastatur: Enter/Leertaste oeffnet, Esc schliesst. */
(function () {
  'use strict';
  var FILMS = { s1: true, s2: true, s3: true, s4: true };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var figs = document.querySelectorAll('.sv2-product figure:not(.pfilm)');
  if (!figs.length) return;
  var modal, lastBtn;

  function build() {
    modal = document.createElement('div');
    modal.className = 'pmodal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.hidden = true;
    modal.innerHTML = '<div class="pmodal__bg" data-close></div><div class="pmodal__box"><button type="button" class="pmodal__close" data-close aria-label="Schließen">×</button><div class="pmodal__media"></div><p class="pmodal__cap"></p></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) close(); });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { var c = modal.querySelector('.pmodal__close'); e.preventDefault(); c.focus(); }
    });
  }

  function open(btn, key, src, alt, cap) {
    if (!modal) build();
    lastBtn = btn;
    var media = modal.querySelector('.pmodal__media');
    if (FILMS[key]) {
      media.innerHTML = '<video controls playsinline muted loop preload="metadata" poster="' + src + '" aria-label="' + alt.replace(/"/g, '&quot;') + '"><source src="/assets/video/film-' + key + '.webm" type="video/webm"><source src="/assets/video/film-' + key + '.mp4" type="video/mp4"></video>';
      var v = media.querySelector('video');
      if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    } else {
      media.innerHTML = '<img src="' + src + '" alt="' + alt.replace(/"/g, '&quot;') + '">';
    }
    modal.querySelector('.pmodal__cap').innerHTML = cap;
    modal.setAttribute('aria-label', alt);
    modal.hidden = false;
    document.documentElement.classList.add('pmodal-open');
    modal.querySelector('.pmodal__close').focus();
  }

  function close() {
    var v = modal.querySelector('video');
    if (v) { v.pause(); }
    modal.querySelector('.pmodal__media').innerHTML = '';
    modal.hidden = true;
    document.documentElement.classList.remove('pmodal-open');
    if (lastBtn) lastBtn.focus();
  }

  figs.forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    var m = (img.getAttribute('src') || '').match(/\/product\/(s\d)\.webp/);
    if (!m) return;
    var key = m[1], capEl = fig.querySelector('figcaption');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pshot-btn';
    var label = FILMS[key] ? 'Vergrößern und Film ansehen' : 'Vergrößern';
    btn.setAttribute('aria-label', label + ': ' + (img.getAttribute('alt') || ''));
    img.parentNode.insertBefore(btn, img);
    btn.appendChild(img);
    var hint = document.createElement('span');
    hint.className = 'pshot-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = FILMS[key] ? '<i>▶</i> Film ansehen' : '<i>⤢</i> Vergrößern';
    btn.appendChild(hint);
    btn.addEventListener('click', function () { open(btn, key, img.getAttribute('src'), img.getAttribute('alt') || '', capEl ? capEl.innerHTML : ''); });
  });
})();
