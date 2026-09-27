(function(){
  var BOOKING_URL = 'https://cogether.de/coach-sven/#termin-buchen';
  var modal = null;

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

  function open(){
    if (!modal) build();
    var iframe = modal.querySelector('.booking-modal__iframe');
    if (!iframe.src) iframe.src = BOOKING_URL;
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
