// pauser-online-legal/assets/i18n.js
//
// Bilingual switcher (zh-CN / en) for the Pauser legal site.
// - Initial language: localStorage > navigator.language > "zh".
// - Toggle buttons are any element with [data-lang-toggle].
// - Each translatable span is wrapped as
//     <span data-lang-show="zh">…</span>
//     <span data-lang-show="en">…</span>
//   and hidden via the injected CSS below until the user (or auto-detect)
//   selects the matching language.
// - <title> and <meta name="description"> can carry data-zh / data-en
//   attributes; the script swaps their text on toggle so search / social
//   previews stay in sync.
//
// The styling for `[data-lang-show]` and `.lang-toggle` is injected
// inline so the legal pages don't need any edits to style.css.

(function () {
  var KEY = 'pauser.legal.lang';
  var detect = (navigator.language || navigator.userLanguage || 'zh-CN')
    .toLowerCase();
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  // Prefer "en" only for an explicit English primary tag. Anything else
  // (zh, zh-CN, zh-Hans, ja, ko, …) defaults to the Chinese copy.
  var initial = saved || (detect.indexOf('en') === 0 ? 'en' : 'zh');

  function applyLang(lang) {
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = lang === 'zh' ? 'EN' : '中文';
      btns[i].setAttribute(
        'aria-label',
        lang === 'zh' ? 'Switch to English' : '切换到中文'
      );
      btns[i].setAttribute(
        'title',
        lang === 'zh' ? 'Switch to English' : '切换到中文'
      );
    }

    var t = document.querySelector('title[data-zh][data-en]');
    if (t) {
      t.textContent = lang === 'zh'
        ? t.getAttribute('data-zh')
        : t.getAttribute('data-en');
    }

    var md = document.querySelector(
      'meta[name="description"][data-zh][data-en]'
    );
    if (md) {
      md.setAttribute(
        'content',
        lang === 'zh'
          ? md.getAttribute('data-zh')
          : md.getAttribute('data-en')
      );
    }

    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function bindToggles() {
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        var cur = document.documentElement.dataset.lang || 'zh';
        applyLang(cur === 'zh' ? 'en' : 'zh');
      });
    }
  }

  // Inline styles: hide non-active language spans, and provide a neutral
  // pill-style toggle button so the page CSS doesn't need changes.
  var style = document.createElement('style');
  style.textContent = [
    'html[data-lang="zh"] [data-lang-show="en"],',
    'html:not([data-lang]) [data-lang-show="en"] { display: none !important; }',
    'html[data-lang="en"] [data-lang-show="zh"] { display: none !important; }',
    '.lang-toggle {',
    '  background: rgba(255,255,255,0.10);',
    '  color: inherit;',
    '  border: 1px solid rgba(255,255,255,0.22);',
    '  border-radius: 999px;',
    '  padding: 4px 12px;',
    '  font-size: 12px;',
    '  font-weight: 600;',
    '  cursor: pointer;',
    '  letter-spacing: 0.04em;',
    '  transition: background 0.15s ease;',
    '  font-family: inherit;',
    '  line-height: 1.4;',
    '}',
    '.lang-toggle:hover { background: rgba(255,255,255,0.18); }',
    '.lang-toggle:focus-visible { outline: 2px solid #FBC95B; outline-offset: 2px; }',
    // Keep the language toggle and the "‹ Back" link on one row inside
    // the sticky nav header (style.css leaves .nav-actions unstyled).
    '.nav-actions { display: inline-flex; align-items: center; gap: 12px; }'
  ].join('\n');
  document.head.appendChild(style);

  applyLang(initial);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }
})();