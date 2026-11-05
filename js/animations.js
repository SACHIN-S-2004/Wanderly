export function initAnimations() {
    // 1. Intersection Observer for Fade/Up Reveals
    const fadeElements = document.querySelectorAll('.fade-up, .clip-reveal');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 2. Initial Hero Reveal (Wait slightly for load)
    window.addEventListener('load', () => {
        setTimeout(() => {
            const heroBg = document.querySelector('.hero-bg');
            if(heroBg) heroBg.classList.add('visible');
        }, 100);
    });

    // 3. Subtle Parallax for Hero Image
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroImg = document.querySelector('.hero-bg img');
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
        }
    });
}