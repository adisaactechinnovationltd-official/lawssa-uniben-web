// =============================
// LAWSSA UNIBEN MAIN JS (CLEAN)
// =============================

// --- CONFIG ---
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';
const KORAPAY_KEY = 'YOUR_KORAPAY_PUBLIC_KEY';
let supabase = null;
try {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    }
} catch (e) { }
const state = { posts: [], resources: [], leadership: [], settings: {}, calendar: [] };

// --- UI HELPERS ---
function closeModal(id) {
    document.getElementById(id).classList.remove('modal--active');
    document.body.classList.remove('no-scroll');
    if (id === 'resourceModal') document.getElementById('resourceFrame').src = '';
}
function openModal(id) {
    document.getElementById(id).classList.add('modal--active');
    document.body.classList.add('no-scroll');
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.modal--active').forEach(m => closeModal(m.id));
    }
});
globalThis.mobileOpen = false;
function toggleMobile() {
    mobileOpen = !mobileOpen;
    document.getElementById('mobileNav').classList.toggle('open', mobileOpen);
}
function toggleFaq(qEl) {
    const item = qEl.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}
function setLeaderBranch(branch, pill) {
    document.querySelectorAll('.branch-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    document.getElementById('executivesPanel').style.display = branch === 'executives' ? '' : 'none';
    document.getElementById('senatePanel').style.display = branch === 'senate' ? '' : 'none';
    document.getElementById('judiciaryPanel').style.display = branch === 'judiciary' ? '' : 'none';
}
function viewResource(link) {
    if (!link || link.includes('example')) {
        alert('This resource link is a placeholder. Please contact the admin.');
        return;
    }
    const preview = link.replace('/view', '/preview').replace('?usp=sharing', '');
    document.getElementById('resourceFrame').src = preview;
    openModal('resourceModal');
}
function handleContact(e) {
    e.preventDefault();
    openModal('noticeModal');
    document.getElementById('noticeTitle').textContent = 'Message Sent!';
    document.getElementById('noticeBody').textContent = 'Thank you for reaching out. The LAWSSA Executive Council will respond within 48 hours.';
    e.target.reset();
}
// Scroll reveal (for .reveal utility class)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
// Export helpers
window.closeModal = closeModal;
window.openModal = openModal;
window.toggleMobile = toggleMobile;
window.toggleFaq = toggleFaq;
window.setLeaderBranch = setLeaderBranch;
window.viewResource = viewResource;
window.handleContact = handleContact;
window.state = state;
window.supabase = supabase;

// --- GSAP ANIMATIONS ---
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // HERO ENTRANCE & PARALLAX
    function animateHero() {
        const targets = '.hero__title span, .hero__subtitle, .hero__actions .btn';

        gsap.set(targets, { opacity: 0, y: 40 });

        gsap.timeline({ defaults: { ease: 'power4.out' } })
            .to('.hero__title span', {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.7
            })
            .to('.hero__subtitle', {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, '-=0.3')
            .to('.hero__actions .btn', {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.5
            }, '-=0.4');

        gsap.to('.hero__big-word', {
            y: -60,
            scale: 1.12,
            opacity: 0.12,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // TICKERS: Infinite Loop
    function animateTickers() {
        const ticker = document.querySelector('.ticker__track');
        if (ticker) {
            const width = ticker.scrollWidth / 2;
            gsap.to(ticker, { x: -width, duration: 35, ease: 'none', repeat: -1, paused: false, overwrite: true });
        }
        const heroTicker = document.querySelector('.hero__bottom-track');
        if (heroTicker) {
            const width = heroTicker.scrollWidth / 2;
            gsap.to(heroTicker, { x: -width, duration: 40, ease: 'none', repeat: -1, paused: false, overwrite: true });
        }
    }

    // REVEALS: Fade-in-up Stagger
    function animateReveals() {
        // WHAT WE DO: fly in from left
        gsap.utils.toArray('.wwd-item').forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                x: -100,
                duration: 0.7,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
            });
        });
        // NEWS: fade in up (classic)
        gsap.utils.toArray('.news-card').forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: 40,
                duration: 0.7,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });
        // LEADERS: alternate angles
        gsap.utils.toArray('.leader-card').forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                x: i % 2 === 0 ? 50 : -50,
                duration: 0.7,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
            });
        });
        // STATS: scale up
        gsap.utils.toArray('.stat-cell').forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                scale: 0.8,
                duration: 0.7,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
            });
        });
    }

    // STATS: Number Counting
    function animateStats() {
        document.querySelectorAll('.stat-cell__num').forEach(cell => {
            const end = parseInt(cell.textContent.replace(/\D/g, '')) || 0;
            if (!end) return;
            ScrollTrigger.create({
                trigger: cell, start: 'top 85%', once: true,
                onEnter: () => {
                    gsap.fromTo(
                        { val: 0 },
                        {
                            val: end, duration: 1.2, ease: 'power4.out',
                            onUpdate: function () {
                                cell.textContent = end > 99 ? Math.floor(this.targets()[0].val) + '+' : Math.floor(this.targets()[0].val);
                            }
                        }
                    );
                }
            });
        });
    }

    // PRESIDENT: Image Reveal & Text Stagger
    function animatePresident() {
        gsap.from('.pres-image-col img', {
            scale: 1.12, clipPath: 'inset(30% 0 30% 0)', opacity: 0, duration: 0.8, ease: 'power4.out',
            scrollTrigger: { trigger: '.pres-image-col', start: 'top 85%', toggleActions: 'play none none none' }
        });
        const presText = document.querySelector('.pres-message-text');
        if (presText) {
            const words = presText.textContent.split(' ');
            presText.innerHTML = words.map(w => `<span class='pres-word'>${w}</span>`).join(' ');
            gsap.set('.pres-word', { opacity: 0, y: 24 });
            gsap.to('.pres-word', {
                opacity: 1,
                y: 0,
                stagger: 0.02,
                duration: 0.6,
                ease: 'power4.out',
                scrollTrigger: { trigger: presText, start: 'top 85%', toggleActions: 'play none none none' }
            });
        }
    }

    // INIT ALL
    window.addEventListener('DOMContentLoaded', () => {
        if (window.Router) {
            Router.init();
        }

        animateHero();
        animateTickers();
        animateReveals();
        animateStats();
        animatePresident();
    });
}

// Ensure GSAP is loaded in your project
// <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

document.addEventListener('DOMContentLoaded', function () {
  const marquee = document.getElementById('heroMarquee');
  if (!marquee) return;

  // Duplicate content for seamless scroll
  const marqueeContent = marquee.innerHTML;
  marquee.innerHTML += marqueeContent;

  // Get width of the content
  const marqueeWidth = marquee.scrollWidth / 2;

  gsap.to(marquee, {
    x: -marqueeWidth,
    duration: 18,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % marqueeWidth)
    }
  });
});