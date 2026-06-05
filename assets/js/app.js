// AI Reference — site-wide client script
// All Liquid-injected config is read from data-* attributes on <body>.

(function() {
  'use strict';

  // Theme: apply stored preference ASAP to avoid FOUC
  (function() {
    var t = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
  })();

  function updateThemeBtns(t) {
    document.querySelectorAll('.theme-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.theme === t);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    var body = document.body;
    var baseurl = (body && body.dataset.baseurl) || '';

    // --- Theme toggle -------------------------------------------------
    var currentTheme = localStorage.getItem('theme') || 'light';
    updateThemeBtns(currentTheme);

    document.querySelectorAll('.theme-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var next = btn.dataset.theme;
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeBtns(next);
      });
    });

    // --- Mobile sidebar ----------------------------------------------
    var menuBtn = document.getElementById('menuBtn');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
      if (!sidebar || !overlay) return;
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
      }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // --- Code block copy button --------------------------------------
    document.querySelectorAll('.post-content pre').forEach(function(pre) {
      var wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      wrapper.appendChild(btn);

      btn.addEventListener('click', function() {
        var codeNode = pre.querySelector('code');
        if (!codeNode || !navigator.clipboard) return;
        navigator.clipboard.writeText(codeNode.innerText).then(function() {
          btn.textContent = 'Copied!';
          setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
        });
      });
    });

    // --- Reading progress bar & back-to-top --------------------------
    var progressBar = document.getElementById('progressBar');
    var btt = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      if (progressBar) progressBar.style.width = scrolled + '%';

      if (btt) {
        if (winScroll > 300) btt.classList.add('show');
        else btt.classList.remove('show');
      }
    }, { passive: true });

    if (btt) {
      btt.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // --- Search modal ------------------------------------------------
    var searchModal = document.getElementById('searchModal');
    var modalInput = document.getElementById('modalSearchInput');
    var modalResults = document.getElementById('modalSearchResults');
    var sidebarSearch = document.querySelector('.sidebar-search');

    function openSearch() {
      if (!searchModal) return;
      searchModal.classList.add('open');
      if (modalInput) {
        setTimeout(function() { modalInput.focus(); }, 50);
      }
      document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
      if (!searchModal) return;
      searchModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (sidebarSearch) sidebarSearch.addEventListener('click', openSearch);

    if (searchModal) {
      searchModal.addEventListener('click', function(e) {
        if (e.target === searchModal) closeSearch();
      });
    }

    // Initialise search index if library is available
    if (typeof SimpleJekyllSearch === 'function' && modalInput && modalResults) {
      SimpleJekyllSearch({
        searchInput: modalInput,
        resultsContainer: modalResults,
        json: baseurl + '/search.json',
        searchResultTemplate:
          '<a href="{url}" class="search-result-item">' +
            '<span class="search-result-title">{title}</span>' +
            '<span class="search-result-meta">{category} · {date}</span>' +
          '</a>',
        noResultsText:
          '<div class="search-result-item">' +
            '<span class="search-result-meta">결과를 찾을 수 없습니다.</span>' +
          '</div>'
      });
    }

    // Keyboard shortcuts: ⌘K / Ctrl+K to open, Esc to close
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
        closeSearch();
      }
    });
  });
})();
