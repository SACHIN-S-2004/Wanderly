export function initNavigation() {

    const navbar = document.getElementById('main-nav');

    const backToTop = document.getElementById('back-to-top');

    const menuToggle = document.querySelector('.menu-toggle');

    const navLinks = document.querySelector('.nav-links');


    // HEADER SCROLL EFFECT

    function updateNavbar() {

        if (window.scrollY > 50) {

            navbar.classList.add('scrolled');

        } else {

            navbar.classList.remove('scrolled');

        }

    }

    updateNavbar();

    window.addEventListener('scroll', updateNavbar, {
        passive: true
    });


    // MOBILE MENU

    if (menuToggle && navLinks) {

        menuToggle.addEventListener('click', () => {

            const isOpen = navLinks.classList.toggle('open');

            menuToggle.classList.toggle('active', isOpen);

            menuToggle.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

            menuToggle.setAttribute(
                'aria-label',
                isOpen ? 'Close navigation menu' : 'Open navigation menu'
            );

        });


        // Close menu after clicking navigation links

        navLinks.querySelectorAll('a, .mobile-plan-btn').forEach(link => {

            link.addEventListener('click', () => {

                navLinks.classList.remove('open');

                menuToggle.classList.remove('active');

                menuToggle.setAttribute('aria-expanded', 'false');

                menuToggle.setAttribute(
                    'aria-label',
                    'Open navigation menu'
                );

            });

        });


        // Close when clicking outside the navigation

        document.addEventListener('click', (e) => {

            if (
                !navbar.contains(e.target) &&
                navLinks.classList.contains('open')
            ) {

                navLinks.classList.remove('open');

                menuToggle.classList.remove('active');

                menuToggle.setAttribute('aria-expanded', 'false');

            }

        });

    }


    // BACK TO TOP

    if (backToTop) {

        backToTop.addEventListener('click', () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        });

    }


    // SMOOTH SCROLL

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function(e) {

            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                e.preventDefault();

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

            }

        });

    });

}