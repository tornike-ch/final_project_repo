/* gancda studio: language, light/dark theme, mobile menu and the hero's play button. */
(() => {
  'use strict';
  const words = {
    ka: {
      skip: 'მთავარ ნაწილზე გადასვლა', navPlay: 'გამოცდილებები', navResults: 'შედეგები', navProcess: 'პროცესი', navStart: 'პროექტის დაწყება',
      eyebrow: 'ინტერაქტიული გამოცდილებების სტუდია', first: 'ციფრული გამოცდილებები, რომლებიც', second: 'რეაქციას იწვევს.',
      intro: 'გაკვეთილს, პირველ სამუშაო დღეს თუ მოსაწვევს ვაქცევთ მოკლე ინტერაქტიულ თამაშად. მონაწილეს მხოლოდ ტელეფონი და ბმული სჭირდება.',
      explore: 'ნახეთ მაგალითები', how: 'როგორ ვმუშაობთ', tryDemo: 'ითამაშეთ: ოთახი 214', tagline: 'გრძნობ, როცა მოქმედებ.', themeLabel: 'თემა',
      meaning: 'განცდა — ის, რასაც თავად განიცდი.', studioCity: 'ინტერაქტიული გამოცდილებების სტუდია · თბილისი',
      demoNotice: 'მაგალითებში წარმოდგენილი ბრენდები, სახელები და მონაცემები საჩვენებელია.', back: 'თავში დაბრუნება ↑',
      lblNav: 'ნავიგაცია', lblLang: 'ენა', lblPlay: 'გამოცდილებები', lblReport: 'საჩვენებელი ანგარიში', lblStart: 'პროცესი', toDark: 'მუქ თემაზე გადასვლა', toLight: 'ღია თემაზე გადასვლა', menu: 'მენიუ', closeMenu: 'მენიუს დახურვა'
    },
    en: {
      skip: 'Skip to main content', navPlay: 'Experiences', navResults: 'Results', navProcess: 'Process', navStart: 'Start a project',
      eyebrow: 'Interactive experiences studio', first: 'Digital experiences that', second: 'spark a reaction.',
      intro: 'We turn a lesson, a first day at work or an invitation into a short interactive game. All anyone needs is a phone and a link.',
      explore: 'See the examples', how: 'How we work', tryDemo: 'Play Room 214', tagline: 'Feel it. Make it happen.', themeLabel: 'Theme',
      meaning: 'gancda — the feeling you live through yourself.', studioCity: 'Interactive experiences studio · Tbilisi',
      demoNotice: 'Brands, names and figures in the examples are for demonstration.', back: 'Back to top ↑',
      lblNav: 'Navigation', lblLang: 'Language', lblPlay: 'Experiences', lblReport: 'Example report', lblStart: 'Process', toDark: 'Switch to dark theme', toLight: 'Switch to light theme', menu: 'Menu', closeMenu: 'Close menu'
    }
  };
  const store = {
    get(k){ try { return localStorage.getItem('gancda.' + k); } catch (e) { return null; } },
    set(k, v){ try { localStorage.setItem('gancda.' + k, v); } catch (e) {} }
  };
  const root = document.documentElement;
  let lang = store.get('lang') === 'en' ? 'en' : 'ka';

  function effectiveTheme(){
    const set = root.getAttribute('data-theme');
    if (set === 'dark' || set === 'light') return set;
    return 'light';
  }
  function paintThemeButton(){
    const dark = effectiveTheme() === 'dark';
    document.querySelectorAll('#themeToggle,[data-theme-toggle]').forEach(b => {
      b.querySelector('use').setAttribute('href', dark ? '#sun' : '#moon');
      b.setAttribute('aria-label', words[lang][dark ? 'toLight' : 'toDark']);
    });
  }
  /* the Georgian lockup in Georgian, the kit's Latin logo in English; aubergine on light, cream and lime on dark */
  function paintLogo(){
    const dark = effectiveTheme() === 'dark';
    document.querySelectorAll('img.logo').forEach(img => {
      img.src = 'assets/' + (lang === 'ka' ? (dark ? 'gancda-lockup-ka.png' : 'gancda-lockup-ka-light.png') : (dark ? 'gancda-primary-dark.svg' : 'gancda-primary-light.svg'));
      img.alt = lang === 'ka' ? 'განცდა' : 'gancda';
    });
    const tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.content = dark ? '#1A0B2E' : '#F8F4EB';
  }
  function paintMenuButton(){
    const b = document.getElementById('menuToggle'); if (!b) return;
    const open = b.getAttribute('aria-expanded') === 'true';
    b.querySelector('use').setAttribute('href', open ? '#closeIcon' : '#menuIcon');
    b.setAttribute('aria-label', words[lang][open ? 'closeMenu' : 'menu']);
  }

  function setLanguage(next, initial){
    lang = next === 'en' ? 'en' : 'ka';
    root.lang = lang;
    store.set('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = words[lang][el.dataset.i18n]; if (v != null) el.textContent = v; });
    document.querySelectorAll('[data-i18n-label]').forEach(el => { const v = words[lang][el.dataset.i18nLabel]; if (v != null) el.setAttribute('aria-label', v); });
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    paintThemeButton(); paintMenuButton();
    /* the Georgian lockup in Georgian, the kit's Latin logo in English */
    paintLogo();
    window.GancdaDemos?.setLanguage(lang);
    window.GancdaExperiences?.setLanguage(lang);
    window.GancdaProject?.setLanguage(lang);
    document.title = lang === 'ka' ? 'gancda — ინტერაქტიული გამოცდილებების სტუდია' : 'gancda — Interactive Experiences Studio';
  }

  function init(){
    const saved = store.get('theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
    document.querySelectorAll('#themeToggle,[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next); store.set('theme', next); paintThemeButton(); paintLogo();
    }));
    document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) setLanguage(b.dataset.lang); }));
    const menu = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
    /* the phone menu: focus moves in when it opens, back to the button when it closes; language and theme keep it open */
    const closeMenu = back => {
      if (!nav || !nav.classList.contains('open')) return;
      const inside = nav.contains(document.activeElement);
      nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); paintMenuButton();
      if (back || inside) menu?.focus();
    };
    menu?.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); paintMenuButton();
      if (open) nav.querySelector('a')?.focus();
    });
    nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(true); });
    document.addEventListener('pointerdown', e => { if (!e.target.closest('#mainNav,#menuToggle')) closeMenu(); });
    document.getElementById('heroPlay')?.addEventListener('click', () => window.GancdaExperiences?.open('learn'));
    setLanguage(lang, lang === 'ka');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
