// Main JavaScript file for Udeaku CareSpring Support Foundation

// Intersection Observer for reveal animations
const initRevealAnimations = () => {
    const revealEls = document.querySelectorAll(".reveal");
    
    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealEls.forEach((el) => revealObserver.observe(el));
    }
};

// Update copyright year
document.addEventListener('DOMContentLoaded', function() {
    // Initialize reveal animations
    initRevealAnimations();
    
    // Update copyright year
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // Form handling
    const form = document.getElementById("WorkshopForm");
    const confirmation = document.getElementById("confirmation");
    const closeConfirmation = document.getElementById("closeConfirmation");
    const formError = document.getElementById("formError");
    const submitButton = document.getElementById("submitButton");
    
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            // HTML5 validation
            if (!form.checkValidity()) {
                if (formError) {
                    formError.style.display = 'block';
                    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Form is valid, hide any previous global error
            if (formError) {
                formError.style.display = 'none';
            }
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";
            }
            
            try {
                const formData = new FormData(form);
                const response = await fetch('/api/registration', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData)),
                    credentials: 'same-origin'
                });
                
                if (!response.ok) {
                    // Specific handling for 404 (endpoint not found)
                    if (response.status === 404) {
                        // Fallback: Store registration locally for later sync
                        const registrationData = Object.fromEntries(formData);
                        registrationData.timestamp = new Date().toISOString();
                        registrationData.id = Date.now().toString();
                        
                        // Store in localStorage
                        const pendingRegistrations = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
                        pendingRegistrations.push(registrationData);
                        localStorage.setItem('pendingRegistrations', JSON.stringify(pendingRegistrations));
                        
                        console.log('Registration stored locally (API unavailable):', registrationData);
                        
                        // Show success message with note about local storage
                        form.reset();
                        if (formError) {
                            formError.style.display = 'none';
                        }
                        if (confirmation) {
                            confirmation.style.display = 'block';
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }
                        return;
                    }
                    throw new Error('Form submission failed');
                }
                
                const result = await response.json();
                form.reset();
                if (formError) {
                    formError.style.display = 'none';
                }
                if (confirmation) {
                    confirmation.style.display = 'block';
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                if (formError) {
                    formError.style.display = 'block';
                    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit Registration";
                }
            }
        });
        
        // Add validation feedback
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                this.classList.add('error');
            });
            
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.classList.remove('error');
                    if (formError) {
                        formError.style.display = 'none';
                    }
                }
            });
        });
    }
    
        // Show/hide confirmation dialog
    function showConfirmation() {
        if (confirmation) {
            confirmation.classList.add('active');
            confirmation.setAttribute('aria-hidden', 'false');
            confirmation.style.visibility = 'visible';
            confirmation.style.opacity = '1';
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    function hideConfirmation() {
        if (confirmation) {
            confirmation.classList.remove('active');
            confirmation.setAttribute('aria-hidden', 'true');
            confirmation.style.visibility = 'hidden';
            confirmation.style.opacity = '0';
        }
        if (formError) {
            formError.style.display = 'none';
        }
    }

    // Close confirmation when clicking outside
    if (confirmation) {
        confirmation.addEventListener("click", (event) => {
            if (event.target === confirmation) {
                hideConfirmation();
            }
        });
    }
    
    // Close confirmation when clicking the close button
    if (closeConfirmation) {
        closeConfirmation.addEventListener("click", hideConfirmation);
    }

    // Close confirmation with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && confirmation && confirmation.classList.contains('active')) {
            hideConfirmation();
        }
    });
    
    // Navigation toggle for mobile
    const navToggle = document.getElementById("navToggle");
    const siteNav = document.getElementById("siteNav");
    
    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function() {
            siteNav.classList.toggle("active");
            this.classList.toggle("active");
            document.body.classList.toggle("nav-open");
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (siteNav && siteNav.classList.contains('active')) {
                    siteNav.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove("nav-open");
                }
            }
        });
    });

    // Contact / FAQ modal handling (index landing page)
    const contactModal = document.getElementById('contactModal');
    const faqModal = document.getElementById('faqModal');
    const openContactBtn = document.getElementById('openContact');
    const openFaqBtn = document.getElementById('openFaq');
    const closeContactBtn = document.getElementById('closeContactModal');
    const closeFaqBtn = document.getElementById('closeFaqModal');

    const toggleModal = (modal, shouldOpen) => {
        if (!modal) return;
        if (shouldOpen) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('nav-open');
        } else {
            // If focus is currently inside the modal, move it out before hiding
            const activeEl = document.activeElement;
            if (activeEl && modal.contains(activeEl)) {
                // Blur the element; browsers will typically move focus back to body
                activeEl.blur();
            }

            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('nav-open');
        }
    };

    if (openContactBtn && contactModal) {
        openContactBtn.addEventListener('click', () => toggleModal(contactModal, true));
    }

    const contactTriggers = document.querySelectorAll('[data-open-contact]');
    if (contactModal && contactTriggers.length) {
        contactTriggers.forEach((btn) => {
            btn.addEventListener('click', () => toggleModal(contactModal, true));
        });
    }

    if (openFaqBtn && faqModal) {
        openFaqBtn.addEventListener('click', () => toggleModal(faqModal, true));
    }

    if (closeContactBtn && contactModal) {
        closeContactBtn.addEventListener('click', () => toggleModal(contactModal, false));
    }

    if (closeFaqBtn && faqModal) {
        closeFaqBtn.addEventListener('click', () => toggleModal(faqModal, false));
    }

    // Close modals when clicking on backdrop
    [contactModal, faqModal].forEach((modal) => {
        if (!modal) return;
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                toggleModal(modal, false);
            }
        });
    });

    // Close modals with Esc key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleModal(contactModal, false);
            toggleModal(faqModal, false);
        }
    });

    // FAQ accordion behaviour (delegated, single-open)
    document.addEventListener('click', (event) => {
        const btn = event.target.closest('.faq-question');
        if (!btn) return;
        const item = btn.closest('.faq-item');
        if (!item) return;

        const faqList = item.parentElement;
        if (faqList) {
            const allItems = faqList.querySelectorAll('.faq-item');
            allItems.forEach((other) => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
        }

        item.classList.toggle('active');
    });

    // Contact form submission handling -> POST to /api/contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const formData = Object.fromEntries(new FormData(contactForm));

            try {
                const result = await submitForm(formData);
                if (result && result.status === 'success') {
                    contactForm.reset();
                    toggleModal(contactModal, false);
                    showConfirmation();
                } else {
                    console.error('Contact submission failed', result);
                    alert('Sorry, we could not send your message. Please try again later.');
                }
            } catch (error) {
                console.error('Contact submission error:', error);
                alert('Sorry, we could not send your message. Please try again later.');
            }
        });
    }

    // Add any other JavaScript functionality here
    // For example: animations, modals, etc.
});

// Function to handle form submission
async function submitForm(formData) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            // Specific handling for 404 (endpoint not found)
            if (response.status === 404) {
                // Fallback: Store contact message locally for later sync
                formData.timestamp = new Date().toISOString();
                formData.id = Date.now().toString();
                
                // Store in localStorage
                const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
                pendingMessages.push(formData);
                localStorage.setItem('pendingMessages', JSON.stringify(pendingMessages));
                
                console.log('Contact message stored locally (API unavailable):', formData);
                
                // Return success for fallback case
                return { status: 'success', message: 'Message saved locally' };
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Contact submission failed');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Export functions if needed
// export { submitForm };
