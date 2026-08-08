(function () {
  var blocks = document.querySelectorAll('.post-content figure.highlight');
  if (!blocks.length) return;

  blocks.forEach(function (figure) {
    figure.classList.add('code-block');

    var lang = figure.className
      .split(/\s+/)
      .filter(function (c) { return c && c !== 'highlight' && c !== 'code-block'; })[0] || 'shell';

    var bar = document.createElement('div');
    bar.className = 'term-bar';

    var dots = document.createElement('span');
    dots.className = 'term-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';

    var label = document.createElement('span');
    label.className = 'term-lang';
    label.textContent = lang;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.textContent = 'Copy';

    btn.addEventListener('click', function () {
      var lines = figure.querySelectorAll('.line');
      var code = Array.prototype.map.call(lines, function (l) { return l.textContent; }).join('\n');

      var done = function () {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(function () { fallbackCopy(code, done); });
      } else {
        fallbackCopy(code, done);
      }
    });

    bar.appendChild(dots);
    bar.appendChild(label);
    bar.appendChild(btn);
    figure.insertBefore(bar, figure.firstChild);
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }
})();
