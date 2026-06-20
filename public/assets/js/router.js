// Router logic for LAWSSA UNIBEN
const Router = (() => {
  const allSections = () => document.querySelectorAll('[data-section]');
  const allNavLinks = () => document.querySelectorAll('[data-nav]');

  function navigate(target) {
    allSections().forEach(s => s.classList.remove('section--active'));
    allNavLinks().forEach(l => l.classList.remove('nav-link--active'));

    const sec = document.querySelector(`[data-section="${target}"]`);
    const link = document.querySelector(`.nav-link[data-nav="${target}"]`);

    if (sec) sec.classList.add('section--active');
    if (link) link.classList.add('nav-link--active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({ page: target }, '', `#${target}`);
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
  }

  return { init, navigate };
})();
window.Router = Router;
