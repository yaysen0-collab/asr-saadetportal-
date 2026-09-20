(function () {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (event) {
      if (!event.target.closest('a')) return;
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    });
  }, { passive: true });

  const observer = new MutationObserver(function () {
    document.querySelectorAll('main section:not([data-reveal-ready])').forEach(function (section) {
      section.dataset.revealReady = 'true';
      section.classList.add('reveal-section');
      requestAnimationFrame(function () { section.classList.add('is-visible'); });
    });
  });
  observer.observe(document.getElementById('app'), { childList: true, subtree: true });
})();
