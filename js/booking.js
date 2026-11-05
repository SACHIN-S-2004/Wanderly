export function initBooking() {
    const modal = document.getElementById('booking-modal');
    const triggers = document.querySelectorAll('.open-modal');
    const closeBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    const targetInput = document.getElementById('target-dest');
    const form = document.getElementById('enquiry-form');
    const formView = document.getElementById('modal-form-view');
    const successView = document.getElementById('modal-success-view');

    // Open Modal and Populate Target
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetData = trigger.getAttribute('data-target');
            
            // Reset views
            formView.classList.remove('hidden');
            successView.classList.add('hidden');
            form.reset();

            // Populate input
            if(targetData && targetData !== 'general') {
                targetInput.value = targetData;
            } else {
                targetInput.value = "Open Enquiry";
                targetInput.removeAttribute('readonly');
            }

            modal.classList.add('active');
        });
    });

    // Close Modal Logic
    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate API call delay
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        
        setTimeout(() => {
            formView.classList.add('hidden');
            successView.classList.remove('hidden');
            submitBtn.innerText = originalText;
        }, 800);
    });
}