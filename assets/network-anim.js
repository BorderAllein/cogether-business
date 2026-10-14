/* Loest die Netzwerk-Animation aus, sobald das Bild sichtbar wird; ohne IntersectionObserver sofort Endzustand. */
(function(){var els=document.querySelectorAll('.mockup--network');if(!els.length)return;
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-active')});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-active');io.unobserve(e.target);}})},{threshold:.55});
els.forEach(function(e){io.observe(e)});})();
