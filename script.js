/* ============================================================
   INDONESIA DI ERA GLOBAL — Analisis SWOT
   Satu script: progres baca, menu mobile, akordeon,
   nav aktif, animasi reveal, kembali ke atas.
   ============================================================ */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Progres bar membaca ---------- */
    var progress = document.getElementById('readingProgress');

    function updateProgress() {
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - doc.clientHeight;
        var ratio = scrollable > 0 ? (doc.scrollTop || document.body.scrollTop) / scrollable : 0;
        progress.style.width = Math.min(100, Math.max(0, ratio * 100)) + '%';
    }

    /* ---------- 2. Menu mobile ---------- */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    function closeMenu() {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', function () {
        var open = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    /* ---------- 3. Akordeon Tantangan ---------- */
    var accItems = document.querySelectorAll('.acc-item');

    accItems.forEach(function (item) {
        var trigger = item.querySelector('.acc-trigger');

        trigger.addEventListener('click', function () {
            var isOpen = item.classList.contains('is-open');

            accItems.forEach(function (other) {
                other.classList.remove('is-open');
                other.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- 4. Penanda nav aktif saat scroll ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a'));
    var watched = navLinks
        .map(function (link) {
            var id = link.getAttribute('href').slice(1);
            var section = document.getElementById(id);
            return section ? { link: link, section: section } : null;
        })
        .filter(Boolean);

    function updateActiveNav() {
        var position = window.scrollY + 140;
        var current = null;

        watched.forEach(function (entry) {
            if (entry.section.offsetTop <= position) current = entry;
        });

        navLinks.forEach(function (link) {
            link.classList.remove('is-active');
        });
        if (current) current.link.classList.add('is-active');
    }

    /* ---------- 5. Kembali ke atas ---------- */
    var toTop = document.createElement('button');
    toTop.className = 'to-top';
    toTop.type = 'button';
    toTop.setAttribute('aria-label', 'Kembali ke atas');
    toTop.innerHTML = '&#8593;';
    document.body.appendChild(toTop);

    toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    function updateToTop() {
        toTop.classList.toggle('is-visible', window.scrollY > 500);
    }

    /* ---------- 6. Satu handler scroll ---------- */
    var ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            updateProgress();
            updateActiveNav();
            updateToTop();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* ---------- 7. Animasi reveal saat masuk layar ---------- */
    var revealEls = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) {
            el.classList.add('is-in');
        });
    } else {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
        );

        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---------- 8. Inisialisasi ---------- */
    updateProgress();
    updateActiveNav();
    updateToTop();
})();
