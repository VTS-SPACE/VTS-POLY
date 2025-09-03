/* NAV TOGGLE + DROPDOWN + OUTSIDE CLICK */
(function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const vtsToggle = document.getElementById('vtsToggle');
    const dropdown = vtsToggle ? vtsToggle.nextElementSibling : null;

    // mobile nav toggle
    navToggle && navToggle.addEventListener('click', () => {
        const opened = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });

    // dropdown toggle
    if (vtsToggle && dropdown) {
        vtsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = dropdown.classList.toggle('open');
            vtsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // close menus on outside click or escape
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target) && e.target !== vtsToggle) {
            dropdown.classList.remove('open');
            vtsToggle && vtsToggle.setAttribute('aria-expanded', 'false');
        }
        // close mobile nav when clicking outside (on small screens)
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle) {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown && dropdown.classList.remove('open');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
})();

/* CAROUSEL: sliding via transform (flex) + autoplay + touch support */
(function () {
    const carousel = document.getElementById('screenshotCarousel');
    if (!carousel) return;

    const slidesWrap = carousel.querySelector('.slides');
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');

    const total = slides.length;
    let idx = 0;
    let width = carousel.clientWidth;
    let intervalId = null;
    const AUTOPLAY_MS = 2200;

    // ensure slides container width adapts
    function updateLayout() {
        width = carousel.clientWidth;
        slidesWrap.style.transform = `translateX(-${idx * width}px)`;
        slides.forEach(sl => sl.style.width = `${width}px`);
    }

    // go to index with wrap
    function goTo(i) {
        idx = (i + total) % total;
        slidesWrap.style.transition = 'transform 0.6s cubic-bezier(.22,.9,.28,1)';
        slidesWrap.style.transform = `translateX(-${idx * width}px)`;
    }

    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    // autoplay
    function startAutoplay() {
        stopAutoplay();
        intervalId = setInterval(() => { next(); }, AUTOPLAY_MS);
    }
    function stopAutoplay() {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    // touch / swipe
    (function addTouch() {
        let startX = 0, delta = 0, dragging = false;
        slidesWrap.addEventListener('touchstart', (e) => {
            stopAutoplay();
            dragging = true;
            slidesWrap.style.transition = 'none';
            startX = e.touches[0].clientX;
        }, { passive: true });

        slidesWrap.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            delta = e.touches[0].clientX - startX;
            slidesWrap.style.transform = `translateX(${-idx * width + delta}px)`;
        }, { passive: true });

        slidesWrap.addEventListener('touchend', (e) => {
            dragging = false;
            if (Math.abs(delta) > 40) {
                if (delta > 0) prev(); else next();
            } else {
                goTo(idx);
            }
            delta = 0;
            startAutoplay();
        });
    })();

    // prev/next buttons
    prevBtn && prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

    // handle resize
    window.addEventListener('resize', () => {
        // small delay for responsive layout changes
        setTimeout(updateLayout, 80);
    });

    // initial setup: set slides widths and move to 0
    function init() {
        // make sure slides are full width
        slides.forEach(sl => sl.style.flex = '0 0 100%');
        updateLayout();
        // make transform use px values (computed width) not percent — avoids half-slide glitch on differently-sized images
        slidesWrap.style.transition = 'transform 0.6s cubic-bezier(.22,.9,.28,1)';
        // autoplay starts
        startAutoplay();
    }

    // Start after DOM paint
    requestAnimationFrame(init);
})();
