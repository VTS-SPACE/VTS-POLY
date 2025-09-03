// changelog.js — Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const expanded = header.getAttribute('aria-expanded') === 'true';

            // Toggle current item
            header.setAttribute('aria-expanded', !expanded);
            body.classList.toggle('show');

            // Close other accordions
            headers.forEach(other => {
                if (other !== header) {
                    other.setAttribute('aria-expanded', false);
                    const otherBody = other.nextElementSibling;
                    otherBody.classList.remove('show');
                }
            });
        });
    });
});
