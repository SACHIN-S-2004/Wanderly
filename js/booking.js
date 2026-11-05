
const STORAGE_KEY = 'wanderly_enquiries';

export function initBooking() {
    const modal = document.getElementById('booking-modal');
    const form = document.getElementById('enquiry-form');
    const targetInput = document.getElementById('target-dest');
    const formView = document.getElementById('modal-form-view');
    const successView = document.getElementById('modal-success-view');
    const downloadButton = document.getElementById('download-enquiry-pdf');
    const referenceDisplay = document.getElementById('success-reference');

    const closeButtons = document.querySelectorAll(
        '.close-modal, .close-modal-btn'
    );

    if (
        !modal || !form || !targetInput ||
        !formView || !successView || !downloadButton
    ) return;

    let previousFocus = null;
    let currentEnquiry = null;

    // ---------- STORAGE ----------

    function getSavedEnquiries() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || '[]'
            );

            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            console.error('Unable to read saved enquiries:', error);
            return [];
        }
    }

    function saveEnquiry(enquiry) {
        try {
            const enquiries = getSavedEnquiries();
            enquiries.push(enquiry);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(enquiries)
            );

            return true;
        } catch (error) {
            console.error('Unable to save enquiry:', error);
            return false;
        }
    }

    // ---------- REFERENCE GENERATION ----------

    function generateReference() {
        const randomPart = window.crypto?.randomUUID
            ? crypto.randomUUID().slice(0, 8).toUpperCase()
            : Math.random().toString(36).slice(2, 10).toUpperCase();

        return `WDR-${randomPart}`;
    }

    // ---------- MODAL ----------

    function openModal(targetData = 'general') {
        previousFocus = document.activeElement;

        form.reset();
        currentEnquiry = null;

        formView.classList.remove('hidden');
        successView.classList.add('hidden');

        targetInput.value = targetData === 'general' ? '' : targetData;
        targetInput.readOnly = targetData !== 'general';

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        document.getElementById('fname')?.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (previousFocus && document.contains(previousFocus)) {
            previousFocus.focus();
        }
    }

    // Event delegation supports dynamically generated package buttons.
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.open-modal');

        if (!trigger) return;

        e.preventDefault();
        openModal(trigger.dataset.target || 'general');
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

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
            ).filter((element) => element.getClientRects().length > 0);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // ---------- DATE VALIDATION ----------

    const dateInput = document.getElementById('date');

    if (dateInput) {
        const today = new Date();

        const localToday = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split('T')[0];

        dateInput.min = localToday;
    }

    // ---------- COLLECT FORM DATA ----------

    function collectEnquiry() {
        return {
            reference: generateReference(),
            name: document.getElementById('fname').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            destination: targetInput.value.trim(),
            travelDate: document.getElementById('date').value,
            travellers: Number(
                document.getElementById('travellers').value
            ),
            preferences: document.getElementById('prefs').value.trim(),
            submittedAt: new Date().toISOString()
        };
    }

    // ---------- FORM SUBMISSION ----------

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        const originalText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = 'Saving enquiry...';

        const enquiry = collectEnquiry();

        const saved = saveEnquiry(enquiry);

        submitButton.disabled = false;
        submitButton.textContent = originalText;

        if (!saved) {
            alert(
                'Your enquiry could not be saved in this browser. ' +
                'Please check your browser storage settings and try again.'
            );
            return;
        }

        currentEnquiry = enquiry;

        if (referenceDisplay) {
            referenceDisplay.textContent = enquiry.reference;
        }

        formView.classList.add('hidden');
        successView.classList.remove('hidden');

        downloadButton.focus();
    });

    // ---------- PDF GENERATION ----------

    // ---------- LOAD PDF LIBRARY WITH FALLBACK ----------

    let pdfLibraryPromise = null;

    function loadPDFLibrary() {
        if (window.jspdf?.jsPDF) {
            return Promise.resolve(window.jspdf.jsPDF);
        }

        if (pdfLibraryPromise) return pdfLibraryPromise;

        const cdnUrls = [
            'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
            'https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js'
        ];

        pdfLibraryPromise = (async () => {
            for (const url of cdnUrls) {
                try {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');

                        script.src = url;
                        script.async = true;

                        const timeout = setTimeout(() => {
                            script.remove();
                            reject(new Error('PDF library loading timed out'));
                        }, 15000);

                        script.onload = () => {
                            clearTimeout(timeout);

                            if (window.jspdf?.jsPDF) {
                                resolve();
                            } else {
                                script.remove();
                                reject(new Error('jsPDF was not initialized'));
                            }
                        };

                        script.onerror = () => {
                            clearTimeout(timeout);
                            script.remove();
                            reject(new Error(`Failed to load ${url}`));
                        };

                        document.head.appendChild(script);
                    });

                    return window.jspdf.jsPDF;

                } catch (error) {
                    console.warn('PDF CDN failed:', url, error);
                }
            }

            throw new Error('Unable to load jsPDF from available CDNs');
        })().catch((error) => {
            pdfLibraryPromise = null;
            throw error;
        });

        return pdfLibraryPromise;
    }

    async function downloadPDF(enquiry) {
        let jsPDF;

        try {
            jsPDF = await loadPDFLibrary();
        } catch (error) {
            console.error('PDF generation error:', error);

            alert(
                'Unable to load the PDF generator. ' +
                'Please check your internet connection and try again.'
            );

            return;
        }

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = 210;
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;

        // Wanderly brand palette
        const forest = [24, 59, 53];
        const ivory = [247, 245, 239];
        const terracotta = [217, 120, 83];
        const charcoal = [32, 37, 34];
        const muted = [112, 116, 108];
        const line = [222, 220, 211];

        const formatDate = (dateString) => {
            if (!dateString) return 'Not specified';

            return new Date(`${dateString}T00:00:00`)
                .toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
        };

        const submittedDate = new Date(enquiry.submittedAt)
            .toLocaleString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

        // Page background
        pdf.setFillColor(...ivory);
        pdf.rect(0, 0, pageWidth, 297, 'F');

        // Header
        pdf.setFillColor(...forest);
        pdf.rect(0, 0, pageWidth, 66, 'F');

        pdf.setTextColor(...ivory);
        pdf.setFont('times', 'italic');
        pdf.setFontSize(28);
        pdf.text('Wanderly', margin, 25);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setCharSpace(2);
        pdf.text('TRAVEL  /  EXPLORE  /  EXPERIENCE', margin, 34);
        pdf.setCharSpace(0);

        pdf.setTextColor(220, 224, 216);
        pdf.setFontSize(9);
        pdf.text('TRAVEL ENQUIRY', pageWidth - margin, 24, {
            align: 'right'
        });

        pdf.setFontSize(8);
        pdf.text(enquiry.reference, pageWidth - margin, 32, {
            align: 'right'
        });

        // Document heading
        pdf.setTextColor(...terracotta);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setCharSpace(1.5);
        pdf.text('YOUR JOURNEY STARTS HERE', margin, 83);
        pdf.setCharSpace(0);

        pdf.setTextColor(...charcoal);
        pdf.setFont('times', 'normal');
        pdf.setFontSize(27);
        pdf.text('Enquiry Confirmation', margin, 96);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);

        const intro = pdf.splitTextToSize(
            'Thank you for choosing Wanderly. Your travel enquiry details are recorded below for your reference.',
            contentWidth
        );

        pdf.text(intro, margin, 105);

        // Reference and date strip
        pdf.setFillColor(238, 234, 224);
        pdf.roundedRect(margin, 119, contentWidth, 22, 2, 2, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(...muted);
        pdf.text('ENQUIRY REFERENCE', margin + 6, 127);
        pdf.text('SUBMITTED ON', margin + 105, 127);

        pdf.setFontSize(10);
        pdf.setTextColor(...forest);
        pdf.text(enquiry.reference, margin + 6, 135);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(submittedDate, margin + 105, 135);

        // Reusable section heading
        function sectionHeading(title, y) {
            pdf.setTextColor(...forest);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.setCharSpace(1);
            pdf.text(title.toUpperCase(), margin, y);
            pdf.setCharSpace(0);

            pdf.setDrawColor(...line);
            pdf.setLineWidth(0.3);
            pdf.line(margin, y + 4, pageWidth - margin, y + 4);
        }

        // Reusable label/value row
        function detailRow(label, value, x, y, width = contentWidth) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(...muted);
            pdf.text(label.toUpperCase(), x, y);

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(...charcoal);

            const safeValue = String(value || 'Not specified');
            const lines = pdf.splitTextToSize(safeValue, width);

            pdf.text(lines, x, y + 7);

            return Math.max(15, lines.length * 5 + 9);
        }

        // Traveller details
        sectionHeading('Traveller Details', 158);

        detailRow('Full Name', enquiry.name, margin, 173, 75);
        detailRow('Email Address', enquiry.email, margin + 90, 173, 75);
        detailRow('Phone Number', enquiry.phone, margin, 196, 75);

        // Travel details
        sectionHeading('Travel Details', 220);

        detailRow(
            'Destination / Package',
            enquiry.destination,
            margin,
            235,
            contentWidth
        );

        detailRow(
            'Preferred Travel Date',
            formatDate(enquiry.travelDate),
            margin,
            257,
            75
        );

        detailRow(
            'Number of Travellers',
            String(enquiry.travellers),
            margin + 90,
            257,
            75
        );

        
        // ---------- ADDITIONAL PREFERENCES: ALWAYS PAGE 2 ----------

        const preferences = enquiry.preferences?.trim()
            || 'No additional preferences provided.';

        // Always create a new page, irrespective of content length
        pdf.addPage();

        // Page background
        pdf.setFillColor(...ivory);
        pdf.rect(0, 0, pageWidth, 297, 'F');

        // Header
        pdf.setFillColor(...forest);
        pdf.rect(0, 0, pageWidth, 45, 'F');

        pdf.setTextColor(...ivory);
        pdf.setFont('times', 'italic');
        pdf.setFontSize(23);
        pdf.text('Wanderly', margin, 27);

        // Section eyebrow
        pdf.setTextColor(...terracotta);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setCharSpace(1);
        pdf.text('TRAVEL NOTES', margin, 67);
        pdf.setCharSpace(0);

        // Section title
        pdf.setTextColor(...charcoal);
        pdf.setFont('times', 'normal');
        pdf.setFontSize(23);
        pdf.text('Additional Preferences', margin, 83);

        // Divider
        pdf.setDrawColor(...line);
        pdf.setLineWidth(0.3);
        pdf.line(margin, 90, pageWidth - margin, 90);

        // Preference content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...muted);

        const wrappedPreferences = pdf.splitTextToSize(
            preferences,
            contentWidth
        );

        pdf.text(wrappedPreferences, margin, 103);

        // Footer on every page
        const pageCount = pdf.getNumberOfPages();

        for (let page = 1; page <= pageCount; page++) {
            pdf.setPage(page);

            pdf.setDrawColor(...line);
            pdf.line(margin, 287, pageWidth - margin, 287);

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(7);
            pdf.setTextColor(...muted);

            pdf.text(
                'WANDERLY  ·  THE ART OF EXPLORATION',
                margin,
                293
            );

            pdf.text(
                `PAGE ${page} OF ${pageCount}`,
                pageWidth - margin,
                293,
                { align: 'right' }
            );
        }

        // Important booking disclaimer
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(7);
        pdf.setTextColor(...muted);

        // Add disclaimer in the footer area of the last page
        pdf.setPage(pageCount);

        pdf.text(
            'This document acknowledges an enquiry only. It is not a booking confirmation.',
            margin,
            283
        );

        const safeName = enquiry.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') || 'guest';

        pdf.save(`Wanderly-Enquiry-${safeName}.pdf`);
    }

    downloadButton.addEventListener('click', async () => {
        if (!currentEnquiry) return;

        const originalHTML = downloadButton.innerHTML;

        downloadButton.disabled = true;
        downloadButton.innerHTML = '<span>Preparing PDF...</span>';

        try {
            await downloadPDF(currentEnquiry);
        } finally {
            downloadButton.disabled = false;
            downloadButton.innerHTML = originalHTML;
        }
    });
}