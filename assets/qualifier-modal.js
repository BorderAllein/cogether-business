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
  var modal, panel, openedAt = 0;
  var ENDPOINT = 'https://cogether.de/wp-json/cogether/v1/funnel/finder';
  // Finder-Groesse -> Geschaeftsphase der Buchung (gleiche Zuordnung wie serverseitig)
  var STAGE = {solo:'solo', small:'building', group:'small_team', team:'company_academy'};

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
    // FUNNEL V1 Stufe 2: Ergebnis per E-Mail (auch ohne Terminbuchung)
    html += '<div class="qualifier-modal__or"><span>oder</span></div>';
    html += '<form class="qualifier-modal__mail" novalidate>' +
      '<label for="q-email">Ergebnis per E-Mail erhalten</label>' +
      '<input type="email" id="q-email" name="email" autocomplete="email" placeholder="Deine E-Mail-Adresse" required>' +
      '<div style="position:absolute;left:-9999px" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
      '<label class="qualifier-modal__consent"><input type="checkbox" name="consent" value="1"> <span>Ich möchte mein Ergebnis per E-Mail erhalten. Das Co;Gether-Team darf mich dazu einmalig persönlich kontaktieren. Es gilt die <a href="https://cogether.de/datenschutz/" target="_blank" rel="noopener">Datenschutzerklärung</a>.</span></label>' +
      '<label class="qualifier-modal__consent"><input type="checkbox" name="sequence" value="1"> <span>Optional: Ich möchte zusätzlich vier kurze Mails zum Paket in den nächsten zehn Tagen erhalten. Ich bestätige das per Link in einer Mail und kann mich jederzeit abmelden.</span></label>' +
      '<button type="submit" class="btn btn-secondary" style="width:100%;justify-content:center">Ergebnis per E-Mail senden</button>' +
      '<p class="qualifier-modal__msg" role="status" aria-live="polite"></p></form>';
    panel.innerHTML = html;
    panel.querySelector('[data-back]').addEventListener('click', renderStep2);
    panel.querySelector('[data-open-booking]').addEventListener('click', function(){
      close();
      if (window.openBookingModal) window.openBookingModal({package: (state.tier || '').toUpperCase(), business_stage: STAGE[state.size] || ''});
    });
    panel.querySelector('.qualifier-modal__mail').addEventListener('submit', submitMail);
  }

  function submitMail(e){
    e.preventDefault();
    var form = e.target, msg = form.querySelector('.qualifier-modal__msg'), btn = form.querySelector('button[type=submit]');
    var email = form.email.value.trim();
    if (email.indexOf('@') < 1 || email.indexOf('.') < 0) { msg.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.'; return; }
    if (!form.consent.checked) { msg.textContent = 'Bitte stimme dem Datenschutzhinweis zu.'; return; }
    var seqChecked = form.sequence.checked;
    btn.disabled = true; msg.textContent = 'Wird gesendet …';
    var a = window.cgAttribution || {};
    var body = new URLSearchParams({email: email, tier: state.tier, size: state.size, consent: '1', sequence: form.sequence.checked ? '1' : '', website: form.website.value, ts: String(openedAt),
      utm_source: a.utm_source || '', utm_medium: a.utm_medium || '', utm_campaign: a.utm_campaign || '', ref: a.ref || '', page: window.location.href.slice(0, 300)});
    fetch(ENDPOINT, {method: 'POST', body: body, mode: 'cors'})
      .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {status: r.status, json: j}; }); })
      .then(function(res){
        if (res.json && res.json.ok) {
          form.innerHTML = '<p class="qualifier-modal__ok"><strong>Danke!</strong> Wir haben Dir Dein Ergebnis per E-Mail geschickt.' + (seqChecked ? ' Bitte bestätige außerdem in der zweiten Mail Deine Anmeldung zur Mail-Folge.' : '') + ' Schau auch im Spam-Ordner nach, falls nichts ankommt.</p>';
        } else {
          btn.disabled = false;
          msg.textContent = res.status === 429 ? 'Zu viele Versuche. Bitte warte kurz.' : 'Das hat leider nicht geklappt. Bitte prüfe die Angaben oder buche direkt einen Termin.';
        }
      })
      .catch(function(){ btn.disabled = false; msg.textContent = 'Verbindung fehlgeschlagen. Bitte versuche es erneut oder buche direkt einen Termin.'; });
  }

  function open(){
    if (!modal) build();
    state = {tier:null,size:null};
    openedAt = Date.now();
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
