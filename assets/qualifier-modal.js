(function(){
  var TIERS = [
    {id:'start',label:'START',desc:'Solo-Praxis oder kleinerer Business-Anfang · ab 129 €/Monat'},
    {id:'grow',label:'GROW',desc:'Mehr Kund:innen, erste Programme & Gruppen · ab 199 €/Monat'},
    {id:'pro',label:'PRO',desc:'Etabliertes Unternehmen mit mehreren Bereichen · ab 399 €/Monat'},
    {id:'universe',label:'UNIVERSE',desc:'Individuelle Infrastruktur, Akademien & Multi-Coach-Teams · auf Anfrage'}
  ];
  var SIZES = [
    {id:'solo',label:'Nur ich',desc:'1 Coach, kein Team'},
    {id:'small',label:'2–10 Klient:innen laufend',desc:'Solo mit wachsender Kundenzahl'},
    {id:'group',label:'11–30 Klient:innen bzw. erste Gruppen',desc:'Programme, Gruppen, mehr Struktur'},
    {id:'team',label:'30+ Klient:innen oder mehrere Coaches',desc:'Team, Akademie oder Organisation'}
  ];

  var state = {tier:null,size:null};
  var modal, panel;

  function build(){
    modal = document.createElement('div');
    modal.className = 'qualifier-modal';
    modal.innerHTML =
      '<div class="qualifier-modal__overlay" data-qclose></div>' +
      '<div class="qualifier-modal__panel" role="dialog" aria-modal="true" aria-label="Setup-Finder">' +
        '<button type="button" class="qualifier-modal__close" data-qclose aria-label="Schließen">×</button>' +
        '<div class="qualifier-modal__body"></div>' +
      '</div>';
    document.body.appendChild(modal);
    panel = modal.querySelector('.qualifier-modal__body');
    modal.addEventListener('click', function(e){
      if (e.target.hasAttribute('data-qclose')) close();
    });
  }

  function progress(step){
    var html = '<div class="qualifier-modal__progress">';
    for (var i=1;i<=3;i++) html += '<i class="'+(i<=step?'done':'')+'"></i>';
    return html + '</div>';
  }

  function tierLabel(id){ var m=TIERS.filter(function(t){return t.id===id;})[0]; return m?m.label:id; }
  function sizeLabel(id){ var m=SIZES.filter(function(s){return s.id===id;})[0]; return m?m.label:id; }

  function renderStep1(){
    var html = progress(1);
    html += '<span class="qualifier-modal__eyebrow">Setup-Finder · Schritt 1 von 3</span>';
    html += '<h3 class="qualifier-modal__title">Welches Paket passt ungefähr?</h3>';
    html += '<div class="qualifier-modal__options">';
    TIERS.forEach(function(t){
      html += '<button type="button" class="qualifier-option" data-tier="'+t.id+'"><b>'+t.label+'</b><span>'+t.desc+'</span></button>';
    });
    html += '</div>';
    panel.innerHTML = html;
    panel.querySelectorAll('[data-tier]').forEach(function(btn){
      btn.addEventListener('click', function(){ state.tier = btn.getAttribute('data-tier'); renderStep2(); });
    });
  }

  function renderStep2(){
    var html = progress(2);
    html += '<button type="button" class="qualifier-modal__back" data-back>← Zurück</button>';
    html += '<span class="qualifier-modal__eyebrow">Setup-Finder · Schritt 2 von 3</span>';
    html += '<h3 class="qualifier-modal__title">Wie viele Klient:innen bzw. Coaches begleitest Du aktuell?</h3>';
    html += '<div class="qualifier-modal__options">';
    SIZES.forEach(function(s){
      html += '<button type="button" class="qualifier-option" data-size="'+s.id+'"><b>'+s.label+'</b><span>'+s.desc+'</span></button>';
    });
    html += '</div>';
    panel.innerHTML = html;
    panel.querySelector('[data-back]').addEventListener('click', renderStep1);
    panel.querySelectorAll('[data-size]').forEach(function(btn){
      btn.addEventListener('click', function(){ state.size = btn.getAttribute('data-size'); renderStep3(); });
    });
  }

  function renderStep3(){
    var html = progress(3);
    html += '<button type="button" class="qualifier-modal__back" data-back>← Zurück</button>';
    html += '<span class="qualifier-modal__eyebrow">Setup-Finder · Schritt 3 von 3</span>';
    html += '<h3 class="qualifier-modal__title">Alles klar.</h3>';
    html += '<div class="qualifier-modal__summary">Passendes Paket: <strong>'+tierLabel(state.tier)+'</strong><br>Aktuelle Größe: <strong>'+sizeLabel(state.size)+'</strong><br><br>Im Erstgespräch schauen wir gemeinsam, ob das genau passt oder ob eine andere Stufe sinnvoller ist.</div>';
    html += '<button type="button" class="btn btn-primary" data-open-booking style="width:100%;justify-content:center">Termin mit Sven auswählen →</button>';
    panel.innerHTML = html;
    panel.querySelector('[data-back]').addEventListener('click', renderStep2);
    panel.querySelector('[data-open-booking]').addEventListener('click', function(){
      close();
      if (window.openBookingModal) window.openBookingModal();
    });
  }

  function open(){
    if (!modal) build();
    state = {tier:null,size:null};
    renderStep1();
    modal.classList.add('open');
    document.body.classList.add('booking-modal-lock');
  }

  function close(){
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('booking-modal-lock');
  }

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) close();
  });

  document.addEventListener('click', function(e){
    var trigger = e.target.closest('.js-qualifier-cta');
    if (!trigger) return;
    e.preventDefault();
    open();
  });
})();
