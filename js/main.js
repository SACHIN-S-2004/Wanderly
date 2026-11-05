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


// ==========================================
// DISCOVER BY EXPERIENCE
// ==========================================

function initDiscoveryFeature() {

    const tabs = document.querySelectorAll('.exp-tab');

    const display = document.getElementById('exp-display');

    if (!display || !tabs.length) return;

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

            img: "https://iasgyan.sgp1.cdn.digitaloceanspaces.com/images/sun_onara.png?auto=format&fit=crop&w=800&q=80"
        }

    };

    // Preload all four experience images
    Object.values(experiencesData).forEach((experience) => {
        const img = new Image();
        img.src = experience.img;
    });


    function renderExperience(type) {
        const data = experiencesData[type];

        if (!data) return;

        // Immediately replace the content
        display.innerHTML = `
            <div class="exp-text">
                <h3>${data.title}</h3>

                <p>${data.text}</p>

                <button
                    class="btn-text open-modal"
                    data-target="Experience: ${type}"
                    type="button">
                    Curate This Experience
                </button>
            </div>

            <div class="exp-img img-zoom">
                <img
                    src="${data.img}"
                    alt="${data.title}"
                    loading="eager"
                    decoding="async"
                    width="800"
                    height="600">
            </div>
        `;

        // Restart the entrance animation on every tab switch
        display.classList.remove('experience-enter');

        // Force browser to register the animation reset
        void display.offsetWidth;

        // Trigger the animation
        display.classList.add('experience-enter');
    }


    tabs.forEach(tab => {

        tab.addEventListener('click', () => {

            tabs.forEach(t => t.classList.remove('active'));

            tab.classList.add('active');

            renderExperience(tab.dataset.exp);

        });

    });


    renderExperience('tropical');

}


// ==========================================
// JOURNEY FINDER
// ==========================================

function initJourneyFinder() {

    const form = document.getElementById('journey-finder-form');

    const results = document.getElementById('finder-results');

    if (!form || !results) return;

    results.addEventListener('click', (e) => {

        if (e.target.closest('.finder-reset')) {

            document.getElementById('find-exp').value = 'tropical';

            document.getElementById('find-budget').value = '2';

            document.getElementById('find-duration').value = 'short';

            form.requestSubmit();

        }

    });


    // Static recommendation dataset

    const journeys = [

        {
            name: "Island Escape",
            destination: "Maldives",
            experience: ["tropical"],
            price: 45000,
            duration: 5,
            package: "Island Escape - Maldives",
            image: "https://gos3.ibcdn.com/cde5573225a011ec89170a58a9feac02.jpg?auto=format&fit=crop&w=500&q=80"
        },

        {
            name: "Bali Discovery",
            destination: "Bali, Indonesia",
            experience: ["tropical", "cultural"],
            price: 28000,
            duration: 5,
            package: "Bali Discovery - Bali",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80"
        },

        {
            name: "Desert & Beyond",
            destination: "Dubai",
            experience: ["desert", "cultural"],
            price: 32000,
            duration: 4,
            package: "Desert & Beyond - Dubai",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80"
        },

        {
            name: "Alpine Discovery",
            destination: "Switzerland",
            experience: ["mountain"],
            price: 85000,
            duration: 7,
            package: "Alpine Discovery - Switzerland",
            image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=500&q=80"
        }

    ];


    // Budget ranges

    const budgetRanges = {

        "1": { min: 0, max: 30000 },

        "2": { min: 30000, max: 60000 },

        "3": { min: 60000, max: 100000 },

        "4": { min: 100000, max: Infinity }

    };


    // Duration ranges

    const durationRanges = {

        weekend: { min: 1, max: 2 },

        short: { min: 3, max: 5 },

        med: { min: 6, max: 8 },

        long: { min: 9, max: Infinity }

    };


    form.addEventListener('submit', (e) => {

        e.preventDefault();


        const experience = document.getElementById('find-exp').value;

        const budget = budgetRanges[
            document.getElementById('find-budget').value
        ];

        const duration = durationRanges[
            document.getElementById('find-duration').value
        ];


        if (!budget || !duration) return;


        results.innerHTML = `

            <p class="finder-loading">

                Finding journeys that match your preferences...

            </p>

        `;


        setTimeout(() => {

            const matches = journeys.filter(journey => {

                const experienceMatch =
                    journey.experience.includes(experience);

                const budgetMatch =
                    journey.price >= budget.min &&
                    journey.price <= budget.max;

                const durationMatch =
                    journey.duration >= duration.min &&
                    journey.duration <= duration.max;

                return experienceMatch && budgetMatch && durationMatch;

            });


            if (matches.length === 0) {

                results.innerHTML = `

                    <div class="result-card">

                        <h3>No exact matches found.</h3>

                        <p>
                            Try adjusting your budget or travel duration
                            to discover more journeys.
                        </p>

                        <button class="btn-secondary finder-reset" type="button">
                            Try Popular Options
                        </button>

                    </div>

                `;

                return;

            }


            results.innerHTML = `

                <h3 class="finder-result-heading">

                    ${matches.length} Journey${matches.length > 1 ? 's' : ''}
                    Found

                </h3>

                <div class="finder-match-grid">

                    ${matches.map(journey => `

                        <div class="result-card">

                            <img
                                src="${journey.image}"
                                alt="${journey.destination}"
                                loading="lazy">

                            <div class="result-card-content">

                                <span>${journey.destination}</span>

                                <h3>${journey.name}</h3>

                                <p>
                                    ${journey.duration} Days
                                    · Starting at ₹${journey.price.toLocaleString('en-IN')}
                                </p>

                                <button
                                    class="btn-primary open-modal"
                                    type="button"
                                    data-target="${journey.package}">

                                    Plan This Trip

                                </button>

                            </div>

                        </div>

                    `).join('')}

                </div>

            `;

        }, 500);

    });

}