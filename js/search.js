(function () {
  var searchPath = (window.BLACKICE && window.BLACKICE.searchPath) || '/search.xml';
  var indexPromise = null;

  function loadIndex() {
    if (indexPromise) return indexPromise;
    indexPromise = fetch(searchPath)
      .then(function (res) { return res.text(); })
      .then(function (text) {
        var xml = new DOMParser().parseFromString(text, 'text/xml');
        var entries = Array.prototype.slice.call(xml.getElementsByTagName('entry'));
        return entries.map(function (entry) {
          return {
            title: (entry.getElementsByTagName('title')[0] || {}).textContent || '',
            url: (entry.getElementsByTagName('url')[0] || {}).textContent || '',
            content: (entry.getElementsByTagName('content')[0] || {}).textContent || ''
          };
        });
      })
      .catch(function () { return []; });
    return indexPromise;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function stripHtml(str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || '';
  }

  function excerpt(plainText, query) {
    var idx = plainText.toLowerCase().indexOf(query.toLowerCase());
    var start = idx === -1 ? 0 : Math.max(0, idx - 60);
    var snippet = plainText.slice(start, start + 160).trim();
    var safe = escapeHtml(snippet);
    if (query) {
      var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      safe = safe.replace(re, '<mark>$1</mark>');
    }
    return (start > 0 ? '&hellip;' : '') + safe + '&hellip;';
  }

  function render(resultsEl, items, query) {
    if (!query) {
      resultsEl.innerHTML = '';
      return;
    }
    if (!items.length) {
      resultsEl.innerHTML = '<p class="search-empty">No results for "' + escapeHtml(query) + '"</p>';
      return;
    }
    resultsEl.innerHTML = items.slice(0, 20).map(function (item) {
      var plain = stripHtml(item.content);
      return (
        '<a class="search-result" href="' + item.url + '">' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + excerpt(plain, query) + '</p>' +
        '</a>'
      );
    }).join('');
  }

  function wire(inputEl, resultsEl) {
    if (!inputEl || !resultsEl) return;
    var timer = null;
    inputEl.addEventListener('input', function () {
      clearTimeout(timer);
      var query = inputEl.value.trim();
      timer = setTimeout(function () {
        if (!query) { render(resultsEl, [], ''); return; }
        loadIndex().then(function (entries) {
          var q = query.toLowerCase();
          var matches = entries.filter(function (e) {
            return e.title.toLowerCase().indexOf(q) !== -1 || e.content.toLowerCase().indexOf(q) !== -1;
          });
          render(resultsEl, matches, query);
        });
      }, 150);
    });
  }

  wire(document.getElementById('searchInput'), document.getElementById('searchResults'));
  wire(document.getElementById('searchPageInput'), document.getElementById('searchPageResults'));
})();
