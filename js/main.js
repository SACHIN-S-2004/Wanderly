import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initBooking } from './booking.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initBooking();
    initDiscoveryFeature();
    initJourneyFinder();
});

// Section B: Interactive Discovery
function initDiscoveryFeature() {
    const tabs = document.querySelectorAll('.exp-tab');
    const display = document.getElementById('exp-display');
    
    const experiencesData = {
        tropical: {
            title: "The Call of the Ocean",
            text: "White sands, azure waters, and palm-fringed shores. Surrender to the rhythm of the tides in places where time slows down.",
            img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
        },
        mountain: {
            title: "Elevate Your Senses",
            text: "Crisp alpine air and dramatic peaks. For those who seek perspective and solitude above the clouds.",
            img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
        },
        desert: {
            title: "Vast Horizons",
            text: "Golden dunes beneath endless starry skies. Discover the profound silence and fierce beauty of the wilderness.",
            img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80"
        },
        cultural: {
            title: "Stories of the Past",
            text: "Ancient architecture, vibrant bazaars, and timeless traditions. Connect with the human heritage that shapes our world.",
            img: "https://images.unsplash.com/photo-1518349635034-7a32d1844b26?auto=format&fit=crop&w=800&q=80"
        }
    };

    const renderExperience = (type) => {
        const data = experiencesData[type];
        display.style.opacity = '0';
        setTimeout(() => {
            display.innerHTML = `
                <div class="exp-text">
                    <h3>${data.title}</h3>
                    <p>${data.text}</p>
                    <button class="btn-text open-modal" data-target="Experience: ${type}">Curate This Experience</button>
                </div>
                <div class="exp-img img-zoom">
                    <img src="${data.img}" alt="${data.title}">
                </div>
            `;
            display.style.opacity = '1';
            display.style.transition = 'opacity 0.4s ease';
            
            // Re-init booking modal triggers for dynamic content
            import('./booking.js').then(module => module.initBooking());
        }, 300);
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderExperience(tab.getAttribute('data-exp'));
        });
    });

    // Init default
    if(display) renderExperience('tropical');
}

// Section E: Journey Finder Simulator
function initJourneyFinder() {
    const form = document.getElementById('journey-finder-form');
    const results = document.getElementById('finder-results');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const exp = document.getElementById('find-exp').options[document.getElementById('find-exp').selectedIndex].text;
            
            results.innerHTML = '';
            // Simulate processing
            const loader = document.createElement('p');
            loader.innerText = 'Searching curated journeys...';
            results.appendChild(loader);

            setTimeout(() => {
                results.innerHTML = `
                    <div class="result-card fade-up visible">
                        <h3>Match Found: The Ultimate ${exp}</h3>
                        <p>Based on your criteria, we have a curated itinerary perfectly matched for you.</p>
                        <button class="btn-primary open-modal" data-target="Custom: ${exp}">Plan This Trip</button>
                    </div>
                `;
                // Re-bind modal
                import('./booking.js').then(module => module.initBooking());
            }, 600);
        });
    }
}