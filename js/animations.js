export function initAnimations() {

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const fadeElements = document.querySelectorAll(
        '.fade-up, .clip-reveal'
    );


    // REDUCED MOTION SUPPORT

    if (reduceMotion) {

        fadeElements.forEach(element => {
            element.classList.add('visible');
        });

        return;

    }


    // SCROLL REVEAL

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('visible');

                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.15,

        rootMargin: '0px 0px -40px 0px'

    });


    fadeElements.forEach(element => {

        observer.observe(element);

    });


    // HERO IMAGE REVEAL

    window.addEventListener('load', () => {

        const heroBg = document.querySelector('.hero-bg');

        if (heroBg) {

            setTimeout(() => {

                heroBg.classList.add('visible');

            }, 100);

        }

    });


    // OPTIMIZED HERO PARALLAX

    const heroImg = document.querySelector('.hero-bg img');

    let ticking = false;

    function updateParallax() {

        if (!heroImg) return;

        const scrollY = window.scrollY;

        if (scrollY < window.innerHeight) {

            heroImg.style.transform =
                `scale(1.1) translateY(${scrollY * 0.2}px)`;

        }

        ticking = false;

    }


    window.addEventListener('scroll', () => {

        if (!ticking) {

            window.requestAnimationFrame(updateParallax);

            ticking = true;

        }

    }, { passive: true });

}