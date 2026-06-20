// Router logic for LAWSSA UNIBEN
const Router = (() => {
  const allSections = () => document.querySelectorAll('[data-section]');
  const allNavLinks = () => document.querySelectorAll('[data-nav]');

  function navigate(target, replaceState = false) {
    allSections().forEach(s => s.classList.remove('section--active'));
    allNavLinks().forEach(l => l.classList.remove('nav-link--active'));

    const sec = document.querySelector(`[data-section="${target}"]`);
    const link = document.querySelector(`.nav-link[data-nav="${target}"]`);

    if (sec) sec.classList.add('section--active');
    if (link) link.classList.add('nav-link--active');

    if (replaceState) {
      window.history.replaceState({ page: target }, '', `#${target}`);
    } else {
      window.history.pushState({ page: target }, '', `#${target}`);
    }

    if (window.ScrollTrigger) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }

  function init() {
    allNavLinks().forEach(l => {
      l.addEventListener('click', () => {
        navigate(l.dataset.nav);

        // Close mobile nav if open
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          globalThis.mobileOpen = false;
        }
      });
    });

    window.addEventListener('popstate', (event) => {
      const target = event.state?.page || window.location.hash.replace('#', '') || 'home';
      navigate(target, true);
    });

    const initialTarget = window.location.hash.replace('#', '') || 'home';
    navigate(initialTarget, true);
  }

  return { init, navigate };
})();
window.Router = Router;
