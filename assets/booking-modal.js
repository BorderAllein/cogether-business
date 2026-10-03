(function(){
  var BOOKING_URL = 'https://cogether.de/termin-embed/sven/';
  var modal = null;
  var lastQuery = null;

  // FUNNEL V1 (2026-10-03): Herkunft der Seite (utm_* + externer Referrer) -- ohne Cookie, ohne Browser-Speicher.
  // Wird beim Laden der Seite einmal gelesen und an Buchung/Setup-Finder weitergegeben.
  var attribution = (function(){
    var out = {};
    try {
      var q = new URLSearchParams(window.location.search);
      ['utm_source','utm_medium','utm_campaign'].forEach(function(k){ var v = q.get(k); if (v) out[k] = v.slice(0,100); });
      if (document.referrer) {
        var h = new URL(document.referrer).host;
        if (h && h !== window.location.host && h !== 'cogether.de' && h !== 'www.cogether.de') out.ref = document.referrer.slice(0,300);
      }
    } catch (e) {}
    return out;
  })();
  window.cgAttribution = attribution;

  function build(){
    modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML =
      '<div class="booking-modal__overlay" data-close></div>' +
      '<div class="booking-modal__panel" role="dialog" aria-modal="true" aria-label="Termin mit Sven buchen">' +
        '<button type="button" class="booking-modal__close" data-close aria-label="Schließen">×</button>' +
        '<iframe class="booking-modal__iframe" title="Terminbuchung mit Sven" loading="lazy"></iframe>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){
      if (e.target.hasAttribute('data-close')) close();
    });
  }

  // params: optionale Finder-Antworten {package, business_stage}; Herkunft wird immer ergaenzt.
  function open(params){
    if (!modal) build();
    var p = {};
    var extra = (params && typeof params === 'object' && !(params instanceof Event)) ? params : {};
    Object.keys(attribution).forEach(function(k){ p[k] = attribution[k]; });
    Object.keys(extra).forEach(function(k){ if (extra[k]) p[k] = extra[k]; });
    var qs = new URLSearchParams(p).toString();
    var iframe = modal.querySelector('.booking-modal__iframe');
    if (!iframe.src || lastQuery !== qs) {
      iframe.src = BOOKING_URL + (qs ? '?' + qs : '');
      lastQuery = qs;
    }
    modal.classList.add('open');
    document.body.classList.add('booking-modal-lock');
  }

  function close(){
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('booking-modal-lock');
  }

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', function(e){
    var trigger = e.target.closest('.js-booking-cta');
    if (!trigger) return;
    e.preventDefault();
    open();
  });

  window.openBookingModal = open;
})();
