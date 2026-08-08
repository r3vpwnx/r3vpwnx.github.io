(function () {
  var cfg = (window.BLACKICE && window.BLACKICE.clickEffect) || {};
  if (!cfg.enable || !cfg.words || !cfg.words.length) return;

  var IGNORE_SELECTOR = 'a, button, input, textarea, select, label, .search-overlay, .search-overlay *';

  document.addEventListener('click', function (e) {
    if (e.target.closest(IGNORE_SELECTOR)) return;

    var word = cfg.words[Math.floor(Math.random() * cfg.words.length)];
    var el = document.createElement('span');
    el.className = 'click-word';
    el.textContent = word;
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.fontSize = (0.85 + Math.random() * 0.5).toFixed(2) + 'rem';

    document.body.appendChild(el);
    el.addEventListener('animationend', function () {
      el.remove();
    });
    // safety net in case animationend doesn't fire
    setTimeout(function () {
      if (el.parentNode) el.remove();
    }, 1600);
  });
})();
