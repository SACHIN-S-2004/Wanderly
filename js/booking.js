export function initBooking() {

    const modal = document.getElementById('booking-modal');

    const form = document.getElementById('enquiry-form');

    const targetInput = document.getElementById('target-dest');

    const formView = document.getElementById('modal-form-view');

    const successView = document.getElementById('modal-success-view');

    const closeButtons = document.querySelectorAll(
        '.close-modal, .close-modal-btn'
    );

    if (!modal || !form) return;

    let previousFocus = null;

    // OPEN MODAL USING EVENT DELEGATION
    document.addEventListener('click', (e) => {

        const trigger = e.target.closest('.open-modal');

        if (!trigger) return;

        e.preventDefault();

        previousFocus = document.activeElement;

        const targetData = trigger.dataset.target || 'general';

        // Reset form and views
        form.reset();

        formView.classList.remove('hidden');
        successView.classList.add('hidden');

        // Populate destination/package
        if (targetData === 'general') {

            targetInput.value = '';
            targetInput.readOnly = false;

        } else {

            targetInput.value = targetData;
            targetInput.readOnly = true;

        }

        modal.classList.add('active');

        modal.setAttribute('aria-hidden', 'false');

        document.body.style.overflow = 'hidden';

        document.getElementById('fname').focus();

    });

    // CLOSE MODAL
    function closeModal() {

        modal.classList.remove('active');

        modal.setAttribute('aria-hidden', 'true');

        document.body.style.overflow = '';

        if (previousFocus && document.contains(previousFocus)) {
            previousFocus.focus();
        }

    }

    closeButtons.forEach(button => {

        button.addEventListener('click', closeModal);

    });

    // CLOSE WHEN CLICKING BACKDROP
    modal.addEventListener('click', (e) => {

        if (e.target === modal) {
            closeModal();
        }

    });

    // ESCAPE KEY + KEYBOARD FOCUS MANAGEMENT
    modal.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        if (e.key === 'Tab') {

            const focusable = Array.from(
                modal.querySelectorAll(
                    'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
                )
            ).filter(element => element.getClientRects().length > 0);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }

            if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }

        }

    });

    // SET MINIMUM TRAVEL DATE
    const dateInput = document.getElementById('date');

    if (dateInput) {

        const today = new Date();

        const localToday = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split('T')[0];

        dateInput.min = localToday;

    }

    // FORM SUBMISSION
    form.addEventListener('submit', (e) => {

        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitBtn = form.querySelector(
            'button[type="submit"]'
        );

        submitBtn.disabled = true;

        submitBtn.innerText = 'Processing...';

        // Frontend demonstration only
        setTimeout(() => {

            formView.classList.add('hidden');

            successView.classList.remove('hidden');

            submitBtn.disabled = false;

            submitBtn.innerText = 'Submit Enquiry';

            successView.querySelector('button').focus();

        }, 700);

    });

}