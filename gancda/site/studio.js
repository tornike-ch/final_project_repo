/* gancda studio: language, mobile menu and the hero's play button. The site is dark-only, per the brand kit. */
(() => {
  'use strict';
  const words = {
    ka: {
      skip: 'მთავარ ნაწილზე გადასვლა', navPlay: 'გამოცდილებები', navResults: 'შედეგები', navProcess: 'პროცესი', navStart: 'პროექტის დაწყება',
      eyebrow: 'ინტერაქტიული გამოცდილებების სტუდია', first: 'ციფრული გამოცდილებები, რომლებიც', second: 'რეაქციას იწვევს.',
      intro: 'გაკვეთილს, პირველ სამუშაო დღეს თუ მოსაწვევს ვაქცევთ მოკლე ინტერაქტიულ თამაშად. მონაწილეს მხოლოდ ტელეფონი და ბმული სჭირდება.',
      explore: 'ნახეთ მაგალითები', how: 'როგორ ვმუშაობთ', tryDemo: 'სცადეთ თამაში',
      meaning: 'განცდა — ის, რასაც თავად განიცდი.', studioCity: 'ინტერაქტიული გამოცდილებების სტუდია · თბილისი',
      demoNotice: 'მაგალითებში წარმოდგენილი ბრენდები, სახელები და მონაცემები საჩვენებელია.', back: 'თავში დაბრუნება ↑',
      menu: 'მენიუ', closeMenu: 'მენიუს დახურვა'
    },
    en: {
      skip: 'Skip to main content', navPlay: 'Experiences', navResults: 'Results', navProcess: 'Process', navStart: 'Start a project',
      eyebrow: 'Interactive experiences studio', first: 'Digital experiences that', second: 'spark a reaction.',
      intro: 'We turn a lesson, a first day at work or an invitation into a short interactive game. All anyone needs is a phone and a link.',
      explore: 'See the examples', how: 'How we work', tryDemo: 'Try a game',
      meaning: 'Gancda — the feeling you live through yourself.', studioCity: 'Interactive experiences studio · Tbilisi',
      demoNotice: 'Brands, names and figures in the examples are for demonstration.', back: 'Back to top ↑',
      menu: 'Menu', closeMenu: 'Close menu'
    }
  };
  const store = {
    get(k){ try { return localStorage.getItem('gancda.' + k); } catch (e) { return null; } },
    set(k, v){ try { localStorage.setItem('gancda.' + k, v); } catch (e) {} }
  };
  const root = document.documentElement;
  let lang = store.get('lang') === 'en' ? 'en' : 'ka';

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
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    paintMenuButton();
    window.GancdaDemos?.setLanguage(lang);
    window.GancdaExperiences?.setLanguage(lang);
    window.GancdaProject?.setLanguage(lang);
    if (!initial) document.title = lang === 'ka' ? 'gancda — ინტერაქტიული გამოცდილებების სტუდია' : 'gancda — Interactive Experiences Studio';
  }

  function init(){
    document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) setLanguage(b.dataset.lang); }));
    const menu = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
    const closeMenu = () => { if (!nav) return; nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); paintMenuButton(); };
    menu?.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); paintMenuButton();
    });
    nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.getElementById('heroPlay')?.addEventListener('click', () => window.GancdaExperiences?.open('learn'));
    setLanguage(lang, lang === 'ka');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
